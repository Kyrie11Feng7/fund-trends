/* ============================================================
 * overview_tools.js — P1-1 总览排序/筛选 + P1-2 风险调整指标表
 * 依赖：window.FUNDS（data.js，同步）、window.FundAnalytics（analytics.js，异步）
 * 涨跌配色：红=涨/正，绿=跌/负（中国市场惯例）
 * ============================================================ */
(function () {
  'use strict';
  var LS_KEY = 'fundtrends:fundTools';
  var RED = '#ff5252', GREEN = '#00d68f', MUTED = '#8b8fa3';

  function $(id) { return document.getElementById(id); }
  function loadState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveState(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} }
  function valColor(v) { return v == null ? MUTED : (v >= 0 ? RED : GREEN); }
  function fmt(v, d) { if (v == null) return '样本不足'; return (v >= 0 ? '+' : '') + v.toFixed(d == null ? 2 : d) + '%'; }
  function fmtNum(v, d) { if (v == null) return '—'; return v.toFixed(d == null ? 2 : d); }

  /* ---------- P1-1：卡片排序 / 类型筛选 ---------- */
  var typeColors = {};
  function initCardTools() {
    var section = $('funds');
    if (!section) return;
    var header = section.querySelector('.section-header');
    var st = loadState();
    var types = Array.from(new Set(window.FUNDS.map(function (f) { return f.type; })));

    var bar = document.createElement('div');
    bar.className = 'fund-tools';
    bar.innerHTML =
      '<div class="ft-row">' +
        '<span class="ft-label">类型</span>' +
        '<div class="ft-types" id="ftTypes">' +
          '<button class="ft-chip active" data-type="__all">全部</button>' +
          types.map(function (t) {
            return '<button class="ft-chip" data-type="' + t + '">' + t + '</button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="ft-row">' +
        '<span class="ft-label">排序</span>' +
        '<select class="ft-select" id="ftSort">' +
          '<option value="ret30">近30日收益</option>' +
          '<option value="maxDD">最大回撤</option>' +
          '<option value="annVol">年化波动</option>' +
          '<option value="annRet">年化收益</option>' +
          '<option value="sharpe">Sharpe</option>' +
          '<option value="type">类型</option>' +
          '<option value="name">名称</option>' +
        '</select>' +
        '<button class="ft-dir" id="ftDir" title="切换升降序">降序 ↓</button>' +
        '<button class="ft-reset" id="ftReset">重置</button>' +
      '</div>';
    header.insertAdjacentElement('afterend', bar);

    var activeTypes = st.types && st.types.length ? st.types : ['__all'];
    var sortKey = st.sort || 'ret30';
    var dir = (st.dir == null ? -1 : st.dir); // -1 降序

    function applyFilterTypes() {
      bar.querySelectorAll('.ft-chip').forEach(function (c) {
        c.classList.toggle('active', activeTypes.indexOf(c.dataset.type) >= 0);
      });
    }
    function metricOf(code, key) {
      var m = window.FundAnalytics && window.FundAnalytics.get(code);
      if (key === 'maxDD' || key === 'annVol' || key === 'annRet' || key === 'sharpe' || key === 'ret30') {
        if (!m) return -Infinity;
        if (key === 'ret30') return m.ret30 == null ? -Infinity : m.ret30;
        return m[key] == null ? -Infinity : m[key];
      }
      return 0;
    }
    function apply() {
      var grid = $('fundGrid');
      if (!grid) return;
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.fund-card'));
      // 过滤
      var filtered = cards.filter(function (card) {
        if (activeTypes.indexOf('__all') >= 0) return true;
        var f = window.FUNDS[parseInt(card.dataset.index)];
        return f && activeTypes.indexOf(f.type) >= 0;
      });
      // 排序
      filtered.sort(function (a, b) {
        var ia = parseInt(a.dataset.index), ib = parseInt(b.dataset.index);
        var fa = window.FUNDS[ia], fb = window.FUNDS[ib];
        var va, vb;
        if (sortKey === 'name') { va = fa.name; vb = fb.name; }
        else if (sortKey === 'type') { va = fa.type; vb = fb.type; }
        else { va = metricOf(fa.code, sortKey); vb = metricOf(fb.code, sortKey); }
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
      // 重排 DOM：先隐藏全部，再按顺序追加过滤后的
      cards.forEach(function (c) { c.style.display = 'none'; });
      filtered.forEach(function (c) { grid.appendChild(c); c.style.display = ''; });
      // 持久化
      saveState({ types: activeTypes, sort: sortKey, dir: dir });
    }

    bar.querySelector('#ftTypes').addEventListener('click', function (e) {
      var chip = e.target.closest('.ft-chip'); if (!chip) return;
      var t = chip.dataset.type;
      if (t === '__all') { activeTypes = ['__all']; }
      else {
        activeTypes = activeTypes.filter(function (x) { return x !== '__all'; });
        var i = activeTypes.indexOf(t);
        if (i >= 0) activeTypes.splice(i, 1); else activeTypes.push(t);
        if (!activeTypes.length) activeTypes = ['__all'];
      }
      applyFilterTypes(); apply();
    });
    bar.querySelector('#ftSort').addEventListener('change', function (e) {
      sortKey = e.target.value; apply();
    });
    bar.querySelector('#ftDir').addEventListener('click', function () {
      dir = -dir;
      this.textContent = dir < 0 ? '降序 ↓' : '升序 ↑';
      apply();
    });
    bar.querySelector('#ftReset').addEventListener('click', function () {
      activeTypes = ['__all']; sortKey = 'ret30'; dir = -1;
      bar.querySelector('#ftSort').value = 'ret30';
      bar.querySelector('#ftDir').textContent = '降序 ↓';
      applyFilterTypes(); apply();
    });

    // 初始化控件值
    bar.querySelector('#ftSort').value = sortKey;
    bar.querySelector('#ftDir').textContent = dir < 0 ? '降序 ↓' : '升序 ↑';
    applyFilterTypes();
    // 等 analytics 就绪后再排一次（让数值指标生效）
    apply();
    window.addEventListener('fundAnalyticsReady', apply);
  }

  /* ---------- P1-2：风险调整指标表 ---------- */
  var rtState = { sort: 'sharpe', dir: -1, types: ['__all'] };
  function initRiskTable() {
    var host = $('analyticsTableWrap');
    if (!host) return;
    var types = Array.from(new Set(window.FUNDS.map(function (f) { return f.type; })));

    var tools = document.createElement('div');
    tools.className = 'fund-tools';
    tools.innerHTML =
      '<div class="ft-row"><span class="ft-label">类型</span>' +
        '<div class="ft-types" id="rtTypes">' +
          '<button class="ft-chip active" data-type="__all">全部</button>' +
          types.map(function (t) { return '<button class="ft-chip" data-type="' + t + '">' + t + '</button>'; }).join('') +
        '</div></div>';
    host.parentNode.insertBefore(tools, host);

    var cols = [
      { k: 'name', t: '基金', num: false },
      { k: 'type', t: '类型', num: false },
      { k: 'ret30', t: '近30日', num: true },
      { k: 'maxDD', t: '最大回撤', num: true },
      { k: 'annVol', t: '年化波动', num: true },
      { k: 'annRet', t: '年化收益', num: true },
      { k: 'sharpe', t: 'Sharpe', num: true },
      { k: 'sortino', t: 'Sortino', num: true },
      { k: 'calmar', t: 'Calmar', num: true }
    ];
    var table = document.createElement('table');
    table.className = 'risk-table';
    table.innerHTML = '<thead><tr>' +
      cols.map(function (c) {
        return '<th data-k="' + c.k + '" class="' + (c.num ? 'num' : '') + '">' + c.t +
          (rtState.sort === c.k ? (rtState.dir < 0 ? ' ↓' : ' ↑') : '') + '</th>';
      }).join('') + '</tr></thead><tbody></tbody>';
    host.appendChild(table);

    function rowVal(m, k) {
      if (!m || !m.sufficient) return null;
      if (k === 'ret30') return m.ret30;
      return m[k];
    }
    function render() {
      var A = window.FundAnalytics; if (!A) return;
      var rows = A.list.filter(function (m) {
        if (rtState.types.indexOf('__all') >= 0) return true;
        var f = window.FUNDS.find(function (x) { return x.code === m.code; });
        return f && rtState.types.indexOf(f.type) >= 0;
      });
      rows.sort(function (a, b) {
        var va = rtState.sort === 'name' ? a.name : (rtState.sort === 'type' ?
          (window.FUNDS.find(function (x) { return x.code === a.code; }) || {}).type : rowVal(a, rtState.sort));
        var vb = rtState.sort === 'name' ? b.name : (rtState.sort === 'type' ?
          (window.FUNDS.find(function (x) { return x.code === b.code; }) || {}).type : rowVal(b, rtState.sort));
        if (va == null) va = -Infinity; if (vb == null) vb = -Infinity;
        if (va < vb) return -1 * rtState.dir; if (va > vb) return 1 * rtState.dir; return 0;
      });
      var tb = table.querySelector('tbody');
      tb.innerHTML = rows.map(function (m) {
        var f = window.FUNDS.find(function (x) { return x.code === m.code; });
        var tn = window.FUNDS.find(function (x) { return x.code === m.code; });
        var type = tn ? tn.type : '';
        function cell(k, isPct) {
          var v = rowVal(m, k);
          if (v == null) return '<td class="num muted">样本不足</td>';
          if (k === 'maxDD') return '<td class="num" style="color:' + GREEN + '">' + v.toFixed(2) + '%</td>';
          if (k === 'annVol') return '<td class="num">' + v.toFixed(2) + '%</td>';
          if (isPct) return '<td class="num" style="color:' + valColor(v) + '">' + fmt(v, 2) + '</td>';
          return '<td class="num" style="color:' + valColor(v) + '">' + fmtNum(v, 2) + '</td>';
        }
        return '<tr>' +
          '<td class="rk-name"><a href="#chart" data-code="' + m.code + '">' + m.name + '</a><span class="rk-code">' + m.code + '</span></td>' +
          '<td>' + type + '</td>' +
          cell('ret30', true) + cell('maxDD') + cell('annVol') + cell('annRet', true) +
          cell('sharpe') + cell('sortino') + cell('calmar') +
          '</tr>';
      }).join('');
      // 点击基金名 -> 复用 app.js 卡片点击逻辑跳转趋势分析
      tb.querySelectorAll('a[data-code]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          var idx = window.FUNDS.findIndex(function (x) { return x.code === a.dataset.code; });
          var card = idx >= 0 ? document.querySelector('#fundGrid .fund-card[data-index="' + idx + '"]') : null;
          if (card) card.click();
          else document.getElementById('chart').scrollIntoView({ behavior: 'smooth' });
        });
      });
      // 表头排序
      table.querySelectorAll('th').forEach(function (th) {
        th.onclick = function () {
          var k = th.dataset.k;
          if (rtState.sort === k) rtState.dir = -rtState.dir;
          else { rtState.sort = k; rtState.dir = (k === 'name' || k === 'type') ? 1 : -1; }
          table.querySelectorAll('th').forEach(function (t) { t.textContent = t.textContent.replace(/ [↓↑]$/, ''); });
          th.textContent += rtState.dir < 0 ? ' ↓' : ' ↑';
          render();
        };
      });
    }
    tools.querySelector('#rtTypes').addEventListener('click', function (e) {
      var chip = e.target.closest('.ft-chip'); if (!chip) return;
      var t = chip.dataset.type;
      if (t === '__all') rtState.types = ['__all'];
      else {
        rtState.types = rtState.types.filter(function (x) { return x !== '__all'; });
        var i = rtState.types.indexOf(t);
        if (i >= 0) rtState.types.splice(i, 1); else rtState.types.push(t);
        if (!rtState.types.length) rtState.types = ['__all'];
      }
      tools.querySelectorAll('.ft-chip').forEach(function (c) {
        c.classList.toggle('active', rtState.types.indexOf(c.dataset.type) >= 0);
      });
      render();
    });
    render();
    window.addEventListener('fundAnalyticsReady', render);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCardTools();
    initRiskTable();
  });
  window.__initOverviewTools = function () { initCardTools(); initRiskTable(); };
})();
