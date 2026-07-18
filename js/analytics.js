/* ============================================================
 * analytics.js — 基于 fund_nav.json 真实净值的风险/收益分析引擎
 * 提供：近30日收益、最大回撤、年化波动、年化收益、Sharpe、Sortino、Calmar、相关系数
 * 所有指标由真实历史净值实时计算，口径在「方法论」中标注。
 * 无风险利率假设 2%（rf=0.02），按 252 交易日年化。
 * ============================================================ */
(function () {
  'use strict';
  var RF = 0.02;            // 无风险利率假设
  var TRADING_DAYS = 252;   // 年化因子
  var MIN_POINTS = 40;      // 少于该点数视为样本不足

  function mean(a) {
    if (!a.length) return 0;
    var s = 0; for (var i = 0; i < a.length; i++) s += a[i];
    return s / a.length;
  }
  function std(a) {
    if (a.length < 2) return 0;
    var m = mean(a), s = 0;
    for (var i = 0; i < a.length; i++) { var d = a[i] - m; s += d * d; }
    return Math.sqrt(s / (a.length - 1));
  }
  function dailyReturns(nav) {
    var r = [];
    for (var i = 1; i < nav.length; i++) {
      if (nav[i - 1] > 0) r.push(nav[i] / nav[i - 1] - 1);
    }
    return r;
  }
  function maxDrawdown(nav) {
    var peak = -Infinity, mdd = 0;
    for (var i = 0; i < nav.length; i++) {
      if (nav[i] > peak) peak = nav[i];
      var dd = nav[i] / peak - 1;
      if (dd < mdd) mdd = dd;
    }
    return mdd; // 负数
  }
  function computeMetrics(series) {
    var nav = series.nav, dates = series.dates;
    var n = nav.length;
    var out = {
      code: series.code, name: series.name, group: series.group,
      points: n, sufficient: n >= MIN_POINTS
    };
    if (n < 2) return out;
    var rets = dailyReturns(nav);
    // 近30日收益（取最后最多30个交易日）
    var k = Math.min(30, n - 1);
    out.ret30 = (nav[n - 1] / nav[n - 1 - k] - 1) * 100;
    // 最大回撤（全样本）
    out.maxDD = maxDrawdown(nav) * 100;
    // 年化波动
    out.annVol = std(rets) * Math.sqrt(TRADING_DAYS) * 100;
    // 年化收益（CAGR）
    out.annRet = (Math.pow(nav[n - 1] / nav[0], TRADING_DAYS / (n - 1)) - 1) * 100;
    // Sharpe
    out.sharpe = out.annVol > 0 ? (out.annRet / 100 - RF) / (out.annVol / 100) : null;
    // Sortino（下行波动）
    var down = rets.filter(function (x) { return x < 0; });
    var ddDev = std(down) * Math.sqrt(TRADING_DAYS) * 100;
    out.sortino = ddDev > 0 ? (out.annRet / 100 - RF) / (ddDev / 100) : null;
    // Calmar
    out.calmar = out.maxDD < 0 ? (out.annRet / 100) / (Math.abs(out.maxDD) / 100) : null;
    out.returns = rets;          // 供相关系数计算
    out.nav = nav; out.dates = dates;
    return out;
  }

  function correlation(a, b) {
    // a, b 为 metrics 对象（含 returns）
    var ra = a.returns, rb = b.returns;
    var n = Math.min(ra.length, rb.length);
    if (n < 10) return null;
    // 对齐尾部 n 个
    var sa = ra.slice(ra.length - n), sb = rb.slice(rb.length - n);
    var ma = mean(sa), mb = mean(sb), cov = 0, va = 0, vb = 0;
    for (var i = 0; i < n; i++) {
      var da = sa[i] - ma, db = sb[i] - mb;
      cov += da * db; va += da * da; vb += db * db;
    }
    if (va === 0 || vb === 0) return null;
    return cov / Math.sqrt(va * vb);
  }

  var API = {
    meta: null,
    funds: {},        // code -> metrics
    list: [],         // 数组
    _ready: null,
    ready: function () {
      if (this._ready) return this._ready;
      var self = this;
      this._ready = fetch('fund_nav.json?t=' + Date.now())
        .then(function (r) { return r.json(); })
        .then(function (json) {
          self.meta = json.meta || {};
          self.list = json.series.map(computeMetrics);
          self.list.forEach(function (m) { self.funds[m.code] = m; });
          return self;
        });
      return this._ready;
    },
    get: function (code) { return this.funds[code]; },
    corr: correlation
  };

  window.FundAnalytics = API;
  // 触发点：供其它模块等待
  API.ready().then(function () {
    window.dispatchEvent(new Event('fundAnalyticsReady'));
  }).catch(function (e) {
    console.error('[analytics] 加载 fund_nav.json 失败', e);
    window.dispatchEvent(new Event('fundAnalyticsFailed'));
  });
})();
