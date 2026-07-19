/* ============================================
 * 前瞻信号层 + 回测参考 —— 增量板块渲染
 * 依赖：全局 Chart（js/lib/chart.umd.min.js）、css/style.css 变量
 * 数据：fund_signals.json（分组归因+三色信号）、backtest.json（回测示例）
 * ============================================ */
(function () {
  'use strict';

  /* ---------- 注入新板块样式（复用原站 CSS 变量，保证视觉统一） ---------- */
  var style = document.createElement('style');
  style.id = 'signalLayerStyle';
  style.textContent = [
    '.sig-asof{color:var(--color-accent);font-weight:600;}',
    '.signal-group-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin:8px 0 28px;}',
    '@media(max-width:1100px){.signal-group-grid{grid-template-columns:repeat(3,1fr);}}',
    '@media(max-width:720px){.signal-group-grid{grid-template-columns:repeat(2,1fr);}}',
    '@media(max-width:480px){.signal-group-grid{grid-template-columns:1fr;}}',
    '.sig-card{background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;transition:var(--transition);}',
    '.sig-card:hover{border-color:var(--border-hover);transform:translateY(-2px);}',
    '.sig-card-head{display:flex;align-items:center;gap:8px;margin-bottom:6px;}',
    '.sig-g{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:var(--color-accent);color:#fff;font-weight:700;font-size:13px;}',
    '.sig-name{font-weight:600;font-size:14px;}',
    '.sig-driver{font-size:12px;color:var(--text-muted);margin-bottom:10px;}',
    '.sig-row{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:var(--text-secondary);margin-top:8px;}',
    '.sig-row b{font-size:13px;}',
    '.sig-bar{height:6px;border-radius:4px;background:var(--bg-elevated);margin-top:4px;overflow:hidden;}',
    '.sig-bar i{display:block;height:100%;border-radius:4px;}',
    '.sig-risk{margin-top:12px;font-size:13px;color:var(--text-secondary);}',
    '.signal-table-wrap{overflow-x:auto;margin-top:8px;}',
    '.signal-table{width:100%;border-collapse:collapse;font-size:13px;min-width:560px;}',
    '.signal-table th,.signal-table td{padding:10px 12px;text-align:left;border-bottom:1px solid var(--border-color);}',
    '.signal-table th{color:var(--text-secondary);font-weight:600;background:var(--bg-secondary);}',
    '.signal-table tbody tr:hover{background:var(--bg-card-hover);}',
    '.sf-group{display:inline-flex;width:26px;height:26px;border-radius:7px;background:var(--bg-elevated);align-items:center;justify-content:center;font-weight:700;font-size:12px;color:var(--color-accent);}',
    '.signal-methodology{margin-top:24px;}',
    '.methodology-toggle{background:var(--bg-elevated);border:1px solid var(--border-color);color:var(--text-secondary);padding:10px 16px;border-radius:var(--radius-sm);font-size:13px;transition:var(--transition);}',
    '.methodology-toggle:hover{color:var(--text-primary);border-color:var(--border-hover);}',
    '.methodology-panel{margin-top:12px;padding:18px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);color:var(--text-secondary);font-size:14px;line-height:1.7;}',
    '.methodology-panel h4{color:var(--text-primary);margin:14px 0 6px;font-size:15px;}',
    '.methodology-panel h4:first-child{margin-top:0;}',
    '.methodology-panel ul{margin:0 0 0 18px;}',
    '.methodology-panel p{margin:0;}',
    '.sig-err{color:var(--color-down);padding:16px;}',
    '.backtest-overview{margin-bottom:18px;}',
    '.bt-summary{display:flex;flex-wrap:wrap;gap:18px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px 20px;font-size:14px;color:var(--text-secondary);}',
    '.bt-summary b{color:var(--text-primary);font-size:16px;margin-left:4px;}',
    '.backtest-chart-wrap{background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:16px;margin-bottom:18px;height:300px;position:relative;}',
    '.backtest-table-wrap{overflow-x:auto;}',
    '.backtest-subtitle{font-size:15px;color:var(--text-primary);margin:22px 0 10px;font-weight:600;}',
    '.signal-funds{min-width:1000px;}',
    '.sf-spark{width:96px;height:30px;display:block;}',
    '.sf-stat{font-weight:600;font-variant-numeric:tabular-nums;}',
    '.sf-name-cell{display:flex;align-items:center;gap:8px;}',
    /* 信号/回测解释表格 */
    '.signal-legend-table{width:100%;border-collapse:collapse;font-size:13px;margin:10px 0;color:var(--text-secondary);}',
    '.signal-legend-table th,.signal-legend-table td{padding:10px 12px;text-align:left;border:1px solid var(--border-color);}',
    '.signal-legend-table th{background:var(--bg-elevated);color:var(--text-primary);font-weight:600;}',
    '.signal-legend-table td b{font-weight:600;}',
    '.backtest-explain{margin:0 0 18px;}'
  ].join('\n');
  document.head.appendChild(style);

  /* ---------- 工具 ---------- */
  function $(id) { return document.getElementById(id); }
  function getCss(v) {
    try { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#8b8fa3'; }
    catch (e) { return '#8b8fa3'; }
  }
  // 分数→颜色：中国市场惯例「涨红跌绿」
  // 高=红(偏多/积极) 低=绿(偏空/风险) 中=黄/灰
  function scoreColor(score) {
    if (score >= 70) return getCss('--color-gain');
    if (score >= 55) return getCss('--color-gold');
    if (score >= 40) return getCss('--color-neutral');
    if (score >= 30) return '#ff8f40';
    return getCss('--color-loss');
  }
  function riskColor(r) {
    if (r === '高') return getCss('--color-gain');     // 高风险=红
    if (r === '中低') return getCss('--color-loss');   // 中低风险=绿
    if (r === '中') return getCss('--color-gold');
    return getCss('--color-neutral');
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  }); }

  async function loadJSON(url) {
    var r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }

  /* ---------- 渲染：分组卡片 ---------- */
  function renderGroups(groups) {
    var grid = $('signalGroupGrid');
    if (!grid || !groups) return;
    var order = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'];
    grid.innerHTML = order.map(function (g) {
      var m = groups[g];
      if (!m) return '';
      return '<div class="sig-card">' +
        '<div class="sig-card-head"><span class="sig-g">' + g + '</span><span class="sig-name">' + esc(m.name) + '</span></div>' +
        '<div class="sig-driver">代理：' + esc(m.driver) + '</div>' +
        '<div class="sig-row"><span>短期动能</span><b style="color:' + scoreColor(m.shortScore) + '">' + esc(m.shortLabel) + ' · ' + m.shortScore + '</b></div>' +
        '<div class="sig-bar"><i style="width:' + m.shortScore + '%;background:' + scoreColor(m.shortScore) + '"></i></div>' +
        '<div class="sig-row"><span>中期结构</span><b style="color:' + scoreColor(m.midScore) + '">' + esc(m.midLabel) + ' · ' + m.midScore + '</b></div>' +
        '<div class="sig-bar"><i style="width:' + m.midScore + '%;background:' + scoreColor(m.midScore) + '"></i></div>' +
        '<div class="sig-risk">风险 <b style="color:' + riskColor(m.risk) + '">' + esc(m.risk) + '</b></div>' +
        '</div>';
    }).join('');
  }

  /* ---------- 迷你走势图（SVG sparkline） ---------- */
  function sparkline(nav, w, h) {
    if (!nav || nav.length < 2) return '<span style="color:var(--text-muted)">—</span>';
    var data = nav.slice(-80);
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    var range = (max - min) || 1;
    var n = data.length;
    var pts = data.map(function (v, i) {
      var x = (i / (n - 1)) * w;
      var y = h - ((v - min) / range) * (h - 2) - 1;
      return x.toFixed(1) + ',' + y.toFixed(1);
    });
    var up = data[n - 1] >= data[0];
    var col = up ? getCss('--color-gain') : getCss('--color-loss');  // 涨红跌绿
    return '<svg class="sf-spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + col + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  }

  function fmtPct(v) {
    if (v == null) return '—';
    return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
  }
  function retColor(v) {
    if (v == null) return getCss('--text-muted');
    return v >= 0 ? getCss('--color-gain') : getCss('--color-loss');   // 涨红跌绿
  }
  function ddColor(v) {
    if (v == null) return getCss('--text-muted');
    // 最大回撤为负(亏损)=绿；正值极少，按红处理
    return v >= 0 ? getCss('--color-gain') : getCss('--color-loss');
  }

  /* ---------- 渲染：25 只信号表（含真实风险字段 + 走势） ---------- */
  function renderFunds(funds, navMap) {
    var wrap = $('signalTableWrap');
    if (!wrap || !funds) return;
    var rows = funds.map(function (f) {
      var nav = navMap && navMap[f.code] ? navMap[f.code].nav : null;
      return '<tr>' +
        '<td class="sf-code">' + esc(f.code) + '</td>' +
        '<td class="sf-name-cell"><span class="sf-name">' + esc(f.name) + '</span></td>' +
        '<td><span class="sf-group">' + esc(f.group) + '</span></td>' +
        '<td style="color:' + scoreColor(f.shortScore) + '">' + esc(f.shortLabel) + '<br><small>' + f.shortScore + '</small></td>' +
        '<td style="color:' + scoreColor(f.midScore) + '">' + esc(f.midLabel) + '<br><small>' + f.midScore + '</small></td>' +
        '<td style="color:' + riskColor(f.risk) + '">' + esc(f.risk) + '</td>' +
        '<td class="sf-stat" style="color:' + retColor(f.ret30) + '">' + fmtPct(f.ret30) + '</td>' +
        '<td class="sf-stat" style="color:' + ddColor(f.drawdown) + '">' + (f.drawdown == null ? '—' : f.drawdown.toFixed(2) + '%') + '</td>' +
        '<td class="sf-stat">' + (f.annualVol == null ? '—' : f.annualVol.toFixed(1) + '%') + '</td>' +
        '<td>' + sparkline(nav, 96, 30) + '</td>' +
        '</tr>';
    }).join('');
    wrap.innerHTML = '<table class="signal-table signal-funds">' +
      '<thead><tr><th>代码</th><th>基金</th><th>组</th><th>短期动能</th><th>中期结构</th><th>风险</th>' +
      '<th>近30日收益</th><th>最大回撤</th><th>年化波动</th><th>净值走势</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>';
  }

  async function initSignals() {
    try {
      var data = await loadJSON('fund_signals.json');
      var navMap = {};
      try {
        var navData = await loadJSON('fund_nav.json');
        (navData.series || []).forEach(function (s) { navMap[s.code] = s; });
      } catch (e) { /* 净值曲线数据缺失时不阻断信号表渲染 */ }
      if (data.meta && data.meta.asOf && $('sigAsOf')) $('sigAsOf').textContent = data.meta.asOf;
      renderGroups(data.groups);
      renderFunds(data.funds, navMap);
    } catch (e) {
      var w = $('signalTableWrap');
      if (w) w.innerHTML = '<p class="sig-err">信号数据加载失败：' + esc(e.message) + '（请确认 fund_signals.json 已部署）</p>';
    }
  }

  function initExplainToggles() {
    initToggle('methodologyToggle', 'methodologyPanel', '数据口径与方法论');
    initToggle('backtestExplainToggle', 'backtestExplainPanel', '回测含义说明');
  }
  function initToggle(btnId, panelId, label) {
    var btn = $(btnId), panel = $(panelId);
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden');
      if (open) { panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded', 'true'); btn.textContent = '收起' + label + ' ▴'; }
      else { panel.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false'); btn.textContent = label + ' ▾'; }
    });
  }

  /* ---------- 渲染：回测参考 ---------- */
  async function initBacktest() {
    try {
      var data = await loadJSON('backtest.json');
      var ov = $('backtestOverview');
      if (ov && data.summary) {
        var s = data.summary;
        ov.innerHTML = '<div class="bt-summary">' +
          '回测信号 <b>' + esc(s.signalName) + '</b>' +
          '前瞻窗口 <b>' + s.holdDays + '日</b>' +
          '样本 <b>' + s.sampleSignals + '</b>' +
          '命中率 <b>' + (s.winRate * 100).toFixed(1) + '%</b>' +
          '平均收益 <b style="color:' + (s.avgReturnPct >= 0 ? getCss('--color-gain') : getCss('--color-loss')) + '">' + (s.avgReturnPct >= 0 ? '+' : '') + s.avgReturnPct + '%</b>' +
          '基准命中 <b>' + (s.benchmarkWinRate * 100).toFixed(1) + '%</b>' +
          '</div>';
      }
      var tw = $('backtestTableWrap');
      if (tw && data.byGroup) {
        var rows = data.byGroup.map(function (r) {
          var ret = (r.avgReturnPct >= 0 ? '+' : '') + r.avgReturnPct + '%';
          return '<tr>' +
            '<td><span class="sf-group">' + esc(r.group) + '</span></td>' +
            '<td>' + esc(r.name) + '</td>' +
            '<td style="color:' + scoreColor(r.winRate * 100) + '">' + (r.winRate * 100).toFixed(1) + '%</td>' +
            '<td style="color:' + (r.avgReturnPct >= 0 ? getCss('--color-gain') : getCss('--color-loss')) + '">' + ret + '</td>' +
            '<td>' + r.sampleSignals + '</td>' +
            '</tr>';
        }).join('');
        tw.innerHTML = '<table class="signal-table"><thead><tr><th>组</th><th>赛道</th><th>命中率</th><th>平均收益</th><th>样本</th></tr></thead><tbody>' + rows + '</tbody></table>';
      }
      // 各信号标签的前瞻收益表
      var stw = $('backtestSignalTable');
      if (stw && data.summary && data.summary.bySignalForward) {
        var srows = data.summary.bySignalForward.map(function (r) {
          var ret = (r.avgFwdReturnPct >= 0 ? '+' : '') + r.avgFwdReturnPct + '%';
          return '<tr>' +
            '<td>' + esc(r.signal) + '</td>' +
            '<td>' + r.count + '</td>' +
            '<td style="color:' + scoreColor(r.winRate * 100) + '">' + (r.winRate * 100).toFixed(1) + '%</td>' +
            '<td style="color:' + (r.avgFwdReturnPct >= 0 ? getCss('--color-gain') : getCss('--color-loss')) + '">' + ret + '</td>' +
            '</tr>';
        }).join('');
        stw.innerHTML = '<table class="signal-table"><thead><tr><th>信号标签</th><th>出现次数</th><th>5日胜率</th><th>平均前瞻5日收益</th></tr></thead><tbody>' + srows + '</tbody></table>';
      }
      if (window.Chart && data.byGroup && $('backtestChart')) {
        var ctx = $('backtestChart').getContext('2d');
        new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.byGroup.map(function (r) { return r.group; }),
            datasets: [{
              label: '命中率(%)',
              data: data.byGroup.map(function (r) { return +(r.winRate * 100).toFixed(1); }),
              backgroundColor: data.byGroup.map(function (r) { return scoreColor(r.winRate * 100); }),
              borderRadius: 6
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 100, ticks: { color: getCss('--text-secondary') }, grid: { color: getCss('--border-color') } },
              x: { ticks: { color: getCss('--text-secondary') }, grid: { display: false } }
            }
          }
        });
      }
    } catch (e) {
      var w2 = $('backtestTableWrap');
      if (w2) w2.innerHTML = '<p class="sig-err">回测数据加载失败：' + esc(e.message) + '</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSignals();
    initExplainToggles();
    initBacktest();
  });
})();
