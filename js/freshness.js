/* ============================================================
 * freshness.js — P0-4 全局时间戳/过期警告 + P0-2 数据健康度
 * 读取各数据源 as_of，显示"截至 YYYY-MM-DD"；超 2 个自然日未更新则醒目警告。
 * 页面底部"数据健康度"展示各数据源最近成功更新时间与校验说明。
 * ============================================================ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function daysBetween(a, b) {
    var d1 = new Date(a + 'T00:00:00'), d2 = new Date(b + 'T00:00:00');
    return Math.round((d2 - d1) / 86400000);
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var sources = [];
  function addSource(name, asOf, note) {
    sources.push({ name: name, asOf: asOf || null, note: note || '' });
  }

  function renderBanner() {
    var banner = $('dataBanner'); if (!banner) return;
    if (!sources.length) return;
    var today = todayStr();
    var maxStale = 0, staleName = '';
    sources.forEach(function (s) {
      if (s.asOf) { var d = daysBetween(s.asOf, today); if (d > maxStale) { maxStale = d; staleName = s.name; } }
    });
    var asOfList = sources.filter(function (s) { return s.asOf; }).map(function (s) { return s.asOf; });
    var latest = asOfList.sort().pop() || '—';
    if (maxStale > 2) {
      banner.className = 'data-banner warn';
      banner.innerHTML = '⚠️ 数据可能已过期：' + staleName + ' 最近更新为 ' + staleName + '（已超 ' + maxStale + ' 天）。投资决策请先确认最新数据。';
    } else {
      banner.className = 'data-banner ok';
      banner.innerHTML = '✅ 数据时效正常 · 最新更新 ' + latest + '（截至 ' + today + ' 校验）';
    }
  }

  function renderHealth() {
    var host = $('dataHealth'); if (!host) return;
    var today = todayStr();
    var rows = sources.map(function (s) {
      var ok = !!s.asOf;
      var stale = s.asOf ? daysBetween(s.asOf, today) : 999;
      var dot = !ok ? 'dot-unknown' : (stale > 2 ? 'dot-warn' : 'dot-ok');
      var status = !ok ? '未知' : (stale > 2 ? '已过期 ' + stale + '天' : '正常（' + stale + '天前）');
      return '<tr><td>' + s.name + '</td><td>' + (s.asOf || '—') + '</td><td><span class="dh-dot ' + dot + '"></span>' + status + '</td><td class="dh-note">' + s.note + '</td></tr>';
    }).join('');
    host.innerHTML = '<div class="data-health">' +
      '<h3>数据健康度 · 各数据源更新时间</h3>' +
      '<table class="risk-table"><thead><tr><th>数据源</th><th>最近更新</th><th>状态</th><th>说明</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="dh-foot">净值/信号/回测由 <code>pipeline.js</code> 每日拉取天天基金真实净值生成；市场快照/指数温度来自 neodata 真实行情；校验脚本 <code>validate_*.js</code> 在本地/CI 运行，覆盖数据结构与字段完整性。本面板仅展示更新时间，不代表投资建议。</p>' +
      '</div>';
  }

  function collect() {
    // 净值 / 信号 / 回测
    if (window.FundAnalytics && window.FundAnalytics.meta && window.FundAnalytics.meta.asOf) {
      addSource('基金净值 fund_nav.json', window.FundAnalytics.meta.asOf, '天天基金 F10 真实净值');
    }
    // fund_signals.json asOf
    fetch('fund_signals.json?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (j) {
      if (j.meta && j.meta.asOf) {
        addSource('前瞻信号 fund_signals.json', j.meta.asOf, '技术面信号（真实净值计算）');
        renderBanner(); renderHealth();
      }
    }).catch(function () {});
    // 市场快照
    if (window.MARKET_SNAPSHOT && window.MARKET_SNAPSHOT.date) {
      addSource('市场快照 MARKET_SNAPSHOT', window.MARKET_SNAPSHOT.date, 'neodata 真实行情快照');
    }
    // 指数温度
    if (window.INDEX_TEMPERATURE && window.INDEX_TEMPERATURE.date) {
      addSource('指数温度', window.INDEX_TEMPERATURE.date, window.INDEX_TEMPERATURE.source);
    }
    renderBanner(); renderHealth();
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 等 analytics 把 fund_nav 加载进来
    if (window.FundAnalytics) {
      window.FundAnalytics.ready().then(collect).catch(collect);
      window.addEventListener('fundAnalyticsFailed', collect);
    } else {
      window.addEventListener('fundAnalyticsReady', collect);
      window.addEventListener('fundAnalyticsFailed', collect);
    }
    // MARKET_SNAPSHOT / INDEX_TEMPERATURE 由各自脚本同步设置，稍后再 collect 一次
    setTimeout(collect, 800);
  });
  window.__initFreshness = collect;
})();
