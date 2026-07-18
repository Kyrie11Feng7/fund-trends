/* ============================================================
 * correlation.js — P1-5 基金收益相关系数热力图
 * 基于 fund_nav.json 历史净值日收益计算两两相关系数；>0.8 高相关对高亮
 * 配色：绿(低/负相关) → 红(高正相关)；>0.8 加红框提示"买多只≈买一只"
 * ============================================================ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  function colorFor(r) {
    // r in [-1,1]；负向偏绿，正向偏红
    if (r == null) return '#2a2f45';
    var t = (r + 1) / 2; // 0..1
    var red = Math.round(40 + t * 200);
    var green = Math.round(180 - t * 150);
    return 'rgb(' + red + ',' + Math.max(40, green) + ',90)';
  }

  function init() {
    var host = $('correlationBody'); if (!host) return;
    var A = window.FundAnalytics; if (!A) return;
    var list = A.list;
    var n = list.length;
    var names = list.map(function (m) { return m.name.length > 6 ? m.name.slice(0, 6) : m.name; });

    // 计算矩阵
    var M = [];
    var pairs = [];
    for (var i = 0; i < n; i++) {
      M[i] = [];
      for (var j = 0; j < n; j++) {
        var r = (i === j) ? 1 : A.corr(list[i], list[j]);
        M[i][j] = r;
        if (i < j && r != null) pairs.push({ a: i, b: j, r: r });
      }
    }
    pairs.sort(function (x, y) { return y.r - x.r; });
    var high = pairs.filter(function (p) { return p.r > 0.8; });

    var html = '<div class="corr-wrap">';
    html += '<div class="corr-scroll"><table class="corr-table"><thead><tr><th></th>' +
      list.map(function (m, i) { return '<th title="' + m.name + '">' + names[i] + '</th>'; }).join('') + '</tr></thead><tbody>';
    for (var i = 0; i < n; i++) {
      html += '<tr><th title="' + list[i].name + '">' + names[i] + '</th>';
      for (var j = 0; j < n; j++) {
        var r = M[i][j];
        var bg = colorFor(r);
        var hi = (i !== j && r != null && r > 0.8) ? ' class="corr-hi"' : '';
        var txt = r == null ? '·' : r.toFixed(2);
        html += '<td' + hi + ' style="background:' + bg + '" title="' + list[i].name + ' × ' + list[j].name + ' = ' + txt + '">' + txt + '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table></div>';

    html += '<div class="corr-legend">相关系数：<span class="corr-swatch" style="background:' + colorFor(-0.8) + '"></span>负相关 ' +
      '<span class="corr-swatch" style="background:' + colorFor(0) + '"></span>0 ' +
      '<span class="corr-swatch" style="background:' + colorFor(0.95) + '"></span>强正相关（>0.8）</div>';

    html += '<div class="corr-note">共 ' + high.length + ' 对相关系数 &gt; 0.8（高度同向波动）。<b>红框</b>标记的对：买入多只 ≈ 买入一只，分散效果有限，组合配置时应注意降低重复暴露。</div>';
    if (high.length) {
      html += '<div class="corr-high"><table class="risk-table"><thead><tr><th>基金 A</th><th>基金 B</th><th class="num">相关系数</th><th>提示</th></tr></thead><tbody>' +
        high.slice(0, 12).map(function (p) {
          return '<tr><td>' + list[p.a].name + '</td><td>' + list[p.b].name + '</td>' +
            '<td class="num" style="color:#ff8f40">' + p.r.toFixed(2) + '</td>' +
            '<td>高相关，分散有限</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    html += '</div>';
    host.innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (window.FundAnalytics) window.FundAnalytics.ready().then(init);
    else window.addEventListener('fundAnalyticsReady', init);
  });
  window.__initCorrelation = init;
})();
