/* ============================================================
 * portfolio.js — P1-3 模拟组合 / 自选对比
 * 勾选 ≥2 只基金 -> 等权组合收益曲线 + 综合最大回撤；命名保存/加载组合（localStorage）
 * 对齐口径：取所选基金净值日期交集，组合日收益=成分等权日收益均值
 * ============================================================ */
(function () {
  'use strict';
  var LS_KEY = 'fundtrends:portfolios';
  var RED = '#ff5252', GREEN = '#00d68f';

  function $(id) { return document.getElementById(id); }
  function maxDD(nav) { var peak = -Infinity, mdd = 0; for (var i = 0; i < nav.length; i++) { if (nav[i] > peak) peak = nav[i]; var d = nav[i] / peak - 1; if (d < mdd) mdd = d; } return mdd * 100; }

  var chart = null;
  function buildCombined(codes) {
    var A = window.FundAnalytics; if (!A) return null;
    var ms = codes.map(function (c) { return A.get(c); }).filter(Boolean);
    if (ms.length < 2) return null;
    // 日期交集
    var sets = ms.map(function (m) {
      var map = {}; for (var i = 0; i < m.dates.length; i++) map[m.dates[i]] = m.returns[i - 1];
      return { code: m.code, name: m.name, map: map };
    });
    var common = Object.keys(sets[0].map);
    for (var s = 1; s < sets.length; s++) common = common.filter(function (d) { return d in sets[s].map; });
    common.sort();
    if (common.length < 20) return { error: '共同交易日不足（需≥20），无法可靠计算组合曲线' };
    var comb = [1];
    for (var i = 1; i < common.length; i++) {
      var r = 0;
      for (var k = 0; k < sets.length; k++) r += sets[k].map[common[i]] || 0;
      r /= sets.length;
      comb.push(comb[comb.length - 1] * (1 + r));
    }
    var navCurve = comb.map(function (x) { return x * 100; });
    return {
      dates: common, nav: navCurve,
      mdd: maxDD(navCurve),
      annRet: (Math.pow(navCurve[navCurve.length - 1] / navCurve[0], 252 / (navCurve.length - 1)) - 1) * 100,
      count: ms.length, names: ms.map(function (m) { return m.name; }),
      perFund: ms.map(function (m) {
        return { code: m.code, name: m.name, ret30: m.ret30, maxDD: m.maxDD, annRet: m.annRet };
      })
    };
  }

  function loadPortfolios() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; } }
  function savePortfolios(p) { try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch (e) {} }

  function render() {
    var host = $('portfolioBody'); if (!host) return;
    var A = window.FundAnalytics; if (!A) return;
    var checked = Array.prototype.slice.call(host.querySelectorAll('.pf-check:checked')).map(function (c) { return c.value; });

    var html = '<div class="pf-summary" id="pfSummary">';
    if (checked.length < 2) {
      html += '<p class="pf-hint">勾选 ≥ 2 只基金即可生成组合收益曲线与综合最大回撤。当前已选 <b>' + checked.length + '</b> 只。</p>';
    } else {
      var r = buildCombined(checked);
      if (r.error) {
        html += '<p class="pf-hint pf-err">' + r.error + '</p>';
      } else {
        html += '<div class="pf-stats">' +
          '<div class="pf-stat"><span>成分数</span><b>' + r.count + '</b></div>' +
          '<div class="pf-stat"><span>组合年化收益</span><b style="color:' + (r.annRet >= 0 ? RED : GREEN) + '">' + (r.annRet >= 0 ? '+' : '') + r.annRet.toFixed(1) + '%</b></div>' +
          '<div class="pf-stat"><span>组合最大回撤</span><b style="color:' + GREEN + '">' + r.mdd.toFixed(1) + '%</b></div>' +
          '<div class="pf-stat"><span>区间</span><b>' + r.dates[0] + ' ~ ' + r.dates[r.dates.length - 1] + '</b></div>' +
          '</div>' +
          '<div class="chart-canvas-wrap"><canvas id="pfChart"></canvas></div>' +
          '<div class="pf-perfund"><table class="risk-table"><thead><tr><th>成分基金</th><th class="num">近30日</th><th class="num">最大回撤</th><th class="num">年化收益</th></tr></thead><tbody>' +
          r.perFund.map(function (p) {
            return '<tr><td>' + p.name + '</td>' +
              '<td class="num" style="color:' + (p.ret30 >= 0 ? RED : GREEN) + '">' + (p.ret30 >= 0 ? '+' : '') + p.ret30.toFixed(2) + '%</td>' +
              '<td class="num" style="color:' + GREEN + '">' + p.maxDD.toFixed(2) + '%</td>' +
              '<td class="num" style="color:' + (p.annRet >= 0 ? RED : GREEN) + '">' + (p.annRet >= 0 ? '+' : '') + p.annRet.toFixed(2) + '%</td></tr>';
          }).join('') + '</tbody></table></div>';
      }
    }
    html += '</div>';
    // 保存/加载栏
    var saved = loadPortfolios();
    html += '<div class="pf-savebar">' +
      '<input class="pf-name" id="pfName" placeholder="给组合起个名字" />' +
      '<button class="pf-btn" id="pfSave">保存当前组合</button>' +
      '<span class="pf-sep">已保存：</span>' +
      '<select class="pf-load" id="pfLoad"><option value="">— 选择 —</option>' +
        Object.keys(saved).map(function (n) { return '<option value="' + n + '">' + n + '（' + saved[n].length + '只）</option>'; }).join('') +
      '</select>' +
      '<button class="pf-btn ghost" id="pfDel">删除</button>' +
      '</div>';
    host.innerHTML = html;

    if (checked.length >= 2) {
      var r = buildCombined(checked);
      if (r && !r.error && window.Chart) {
        var ctx = document.getElementById('pfChart').getContext('2d');
        if (chart) chart.destroy();
        chart = new window.Chart(ctx, {
          type: 'line',
          data: {
            labels: r.dates,
            datasets: [{
              label: '等权组合', data: r.nav, borderColor: '#4da3ff',
              backgroundColor: 'rgba(77,163,255,.12)', fill: true,
              pointRadius: 0, borderWidth: 2, tension: 0.1
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#c8cce0' } } },
            scales: {
              x: { ticks: { color: '#8b8fa3', maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,.05)' } },
              y: { ticks: { color: '#8b8fa3' }, grid: { color: 'rgba(255,255,255,.05)' } }
            }
          }
        });
      }
    }
    // 保存
    var saveBtn = host.querySelector('#pfSave');
    if (saveBtn) saveBtn.onclick = function () {
      var name = (host.querySelector('#pfName').value || '').trim();
      if (!name) { alert('请先输入组合名称'); return; }
      var p = loadPortfolios(); p[name] = checked; savePortfolios(p); render();
    };
    var loadSel = host.querySelector('#pfLoad');
    if (loadSel) loadSel.onchange = function () {
      var name = loadSel.value; if (!name) return;
      var codes = loadPortfolios()[name] || [];
      host.querySelectorAll('.pf-check').forEach(function (c) { c.checked = codes.indexOf(c.value) >= 0; });
      render();
    };
    var delBtn = host.querySelector('#pfDel');
    if (delBtn) delBtn.onclick = function () {
      var name = loadSel.value; if (!name) return;
      var p = loadPortfolios(); delete p[name]; savePortfolios(p); render();
    };
  }

  function init() {
    var host = $('portfolioPicker'); if (!host) return;
    var A = window.FundAnalytics; if (!A) { window.addEventListener('fundAnalyticsReady', init); return; }
    var types = Array.from(new Set(window.FUNDS.map(function (f) { return f.type; })));
    host.innerHTML = '<div class="pf-filters" id="pfFilters">' +
      '<button class="ft-chip active" data-t="__all">全部</button>' +
      types.map(function (t) { return '<button class="ft-chip" data-t="' + t + '">' + t + '</button>'; }).join('') +
      '</div><div class="pf-checks" id="pfChecks">' +
      window.FUNDS.map(function (f) {
        return '<label class="pf-label" data-type="' + f.type + '"><input type="checkbox" class="pf-check" value="' + f.code + '"/> ' + f.name + ' <span class="pf-code">' + f.code + '</span></label>';
      }).join('') + '</div>';
    host.addEventListener('change', function (e) {
      if (e.target.classList.contains('pf-check')) render();
    });
    host.querySelector('#pfFilters').addEventListener('click', function (e) {
      var c = e.target.closest('.ft-chip'); if (!c) return;
      var t = c.dataset.t;
      host.querySelectorAll('.ft-chip').forEach(function (x) { x.classList.toggle('active', x === c); });
      host.querySelectorAll('.pf-label').forEach(function (l) {
        l.style.display = (t === '__all' || l.dataset.type === t) ? '' : 'none';
      });
    });
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.FundAnalytics) window.FundAnalytics.ready().then(init);
    else window.addEventListener('fundAnalyticsReady', init);
  });
  window.__initPortfolio = init;
})();
