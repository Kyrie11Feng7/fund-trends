/*
 * livequote.js — 盘中实时行情层（腾讯自选股 qt.gtimg.cn）
 * 解决"网站数据不实时"：基金净值 T 日收盘后才披露、T+1 可见，给不出盘中涨跌；
 * 本模块在页面端直接拉取腾讯实时行情（ETF/LOF 在交易时段有盘中价），叠加显示现价与实时涨跌幅。
 * 数据来源：腾讯自选股公开行情接口；仅供展示，不构成投资建议。
 */
(function () {
  var REFRESH_TRADING = 30000;      // 交易时段每 30 秒刷新
  var REFRESH_IDLE = 5 * 60 * 1000; // 非交易时段每 5 分钟刷新（显示最新价）
  var timer = null;
  var started = false;

  // 6 位基金/股票代码 -> 带市场前缀（腾讯接口需要 sh/sz/bj 前缀）
  function prefix(code) {
    if (/^(sh|sz|bj)/i.test(code)) return code.toLowerCase();
    if (/^(60|68|51|58|56|50|53|59|11)/.test(code)) return 'sh' + code; // 上交所
    if (/^(00|30|15|16|18|12|39|20|0|3)/.test(code)) return 'sz' + code; // 深交所（含 01/02/03 等）
    if (/^(8|4)/.test(code)) return 'bj' + code;                          // 北交所
    return 'sh' + code;
  }
  function code6(code) { return String(code).replace(/^(sh|sz|bj)/i, ''); }

  // 解析 v_xxx="1~名称~代码~现价~昨收~今开~...~时间~涨跌额~涨跌幅~..." 字段
  function parseOne(raw) {
    var f = raw.split('~');
    if (f.length < 33) return null;
    var p = parseFloat(f[3]);
    var pct = parseFloat(f[32]);
    if (isNaN(p) || isNaN(pct)) return null;
    return {
      name: f[1] || '',
      price: p,
      prevClose: parseFloat(f[4]),
      open: parseFloat(f[5]),
      high: parseFloat(f[33]),
      low: parseFloat(f[34]),
      time: f[30] || '',
      change: parseFloat(f[31]) || 0,
      changePct: pct
    };
  }

  function collectCodes() {
    var set = {};
    var els = document.querySelectorAll('[data-live-code]');
    for (var i = 0; i < els.length; i++) set[code6(els[i].getAttribute('data-live-code'))] = true;
    return Object.keys(set);
  }

  // 通过 <script> 注入拉取（免 CORS），读取返回的全局变量 v_xxx
  function fetchQuotes(codes6) {
    return new Promise(function (resolve) {
      if (!codes6.length) { resolve({}); return; }
      var pref = codes6.map(prefix);
      var s = document.createElement('script');
      s.src = 'https://qt.gtimg.cn/q=' + pref.join(',');
      s.charset = 'gbk';
      var done = false;
      function finish() {
        if (done) return; done = true;
        var out = {};
        pref.forEach(function (p) {
          var raw = window['v_' + p];
          if (raw) { var q = parseOne(raw); if (q) out[code6(p)] = q; }
        });
        try { if (s.parentNode) s.parentNode.removeChild(s); } catch (e) {}
        resolve(out);
      }
      s.onload = finish;
      s.onerror = function () { finish(); };
      setTimeout(finish, 2500); // 兜底：缓存命中时 onload 可能不触发
      document.head.appendChild(s);
    });
  }

  function fmtPct(v) { return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; }
  function fmtPrice(p) { return p.toFixed(p >= 100 ? 2 : p >= 10 ? 3 : 4); }

  function fill(quotes) {
    var els = document.querySelectorAll('[data-live-code]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var q = quotes[code6(el.getAttribute('data-live-code'))];
      if (!q) {
        el.innerHTML = '<span class="live-na" title="该标的无盘中实时行情，以下方净值为准">净值</span>';
        continue;
      }
      var up = q.changePct >= 0;
      el.innerHTML = '<span class="live-price">' + fmtPrice(q.price) + '</span>' +
        '<span class="live-chg ' + (up ? 'live-up' : 'live-down') + '">' + fmtPct(q.changePct) + '</span>';
    }
  }

  function isTradingNow() {
    var d = new Date();
    var day = d.getDay();
    if (day === 0 || day === 6) return false; // 周末
    var hm = d.getHours() * 60 + d.getMinutes();
    var morn = hm >= 9 * 60 + 15 && hm <= 11 * 60 + 30; // 9:15-11:30
    var aft = hm >= 13 * 60 && hm <= 15 * 60;            // 13:00-15:00
    return morn || aft;
  }

  function updateIndicator(err) {
    var ind = document.getElementById('liveIndicator');
    if (!ind) return;
    var n = new Date();
    var hh = ('0' + n.getHours()).slice(-2), mm = ('0' + n.getMinutes()).slice(-2), ss = ('0' + n.getSeconds()).slice(-2);
    if (err) {
      ind.className = 'live-indicator live-err';
      ind.innerHTML = '实时行情获取失败 · ' + hh + ':' + mm + ':' + ss;
    } else {
      var trading = isTradingNow();
      ind.className = 'live-indicator ' + (trading ? 'live-on' : 'live-off');
      ind.innerHTML = (trading ? '● 实时行情' : '○ 休市·最新价') + ' · ' + hh + ':' + mm + ':' + ss +
        (trading ? ' <span class="live-tip">每30秒刷新</span>' : '');
    }
  }

  function refresh() {
    var codes = collectCodes();
    if (!codes.length) { updateIndicator(false); return Promise.resolve(); }
    return fetchQuotes(codes).then(function (quotes) {
      fill(quotes);
      updateIndicator(false);
      return quotes;
    }).catch(function () { updateIndicator(true); });
  }

  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { refresh().then(schedule); }, isTradingNow() ? REFRESH_TRADING : REFRESH_IDLE);
  }

  function start() {
    if (started) { refresh(); return; }
    started = true;
    refresh().then(schedule);
  }

  window.LiveQuote = { start: start, refresh: refresh, isTradingNow: isTradingNow };

  // 自动启动（幂等）：页面加载后开始拉取并定时刷新；各渲染函数在生成表格后也会调用 refresh() 立即填充
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
