/* ============================================================
 * search.js — P2-1 全局搜索
 * 导航栏搜索框：输入基金代码/名称/关键词 -> 实时过滤基金卡片；回车定位首个匹配并高亮
 * 支持匹配 NEWS_EVENTS 标题/标签 -> 跳转每日解读
 * ============================================================ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  function init() {
    var nav = document.querySelector('.nav-container'); if (!nav || $('globalSearch')) return;

    var box = document.createElement('div');
    box.className = 'nav-search';
    box.innerHTML = '<input id="globalSearch" type="search" placeholder="搜索基金代码/名称/关键词…" aria-label="搜索" />' +
      '<div class="search-results" id="searchResults" hidden></div>';
    var toggle = nav.querySelector('.nav-toggle');
    nav.insertBefore(box, toggle);

    var input = $('globalSearch');
    var results = $('searchResults');

    function norm(s) { return (s || '').toString().toLowerCase(); }

    function matches(fund, q) {
      var hay = [fund.code, fund.name, fund.enName, fund.type, fund.manager, fund.trackIndex, fund.description].map(norm).join(' ');
      return hay.indexOf(q) >= 0;
    }

    function doFilter(q) {
      var cards = Array.prototype.slice.call(document.querySelectorAll('#fundGrid .fund-card'));
      var any = false;
      cards.forEach(function (card) {
        var f = window.FUNDS[parseInt(card.dataset.index)];
        var hit = f && matches(f, q);
        card.style.display = hit ? '' : 'none';
        if (hit) any = true;
      });
      return any;
    }

    function buildResults(q) {
      var out = [];
      window.FUNDS.forEach(function (f, i) {
        if (matches(f, q)) out.push({ type: 'fund', i: i, name: f.name, code: f.code });
      });
      // 资讯关键词
      (window.NEWS_EVENTS || []).forEach(function (n, i) {
        var hay = norm(n.title + ' ' + (n.tags || []).join(' ') + ' ' + n.category);
        if (hay.indexOf(q) >= 0) out.push({ type: 'news', i: i, name: n.title, code: n.category });
      });
      return out.slice(0, 8);
    }

    input.addEventListener('input', function () {
      var q = norm(input.value.trim());
      if (!q) { results.hidden = true; doFilter(''); return; }
      doFilter(q);
      var list = buildResults(q);
      if (list.length) {
        results.hidden = false;
        results.innerHTML = list.map(function (r) {
          return '<div class="sr-item" data-type="' + r.type + '" data-i="' + r.i + '">' +
            '<span class="sr-tag">' + (r.type === 'fund' ? '基金' : '资讯') + '</span>' +
            '<span class="sr-name">' + r.name + '</span>' +
            '<span class="sr-code">' + r.code + '</span></div>';
        }).join('');
      } else { results.hidden = true; }
    });

    results.addEventListener('click', function (e) {
      var it = e.target.closest('.sr-item'); if (!it) return;
      var q = norm(input.value.trim());
      if (it.dataset.type === 'fund') {
        var idx = parseInt(it.dataset.i);
        var card = document.querySelector('#fundGrid .fund-card[data-index="' + idx + '"]');
        if (card) {
          card.style.display = '';
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
        }
      } else {
        document.getElementById('news').scrollIntoView({ behavior: 'smooth' });
      }
      results.hidden = true;
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = norm(input.value.trim());
        if (!q) return;
        var cards = Array.prototype.slice.call(document.querySelectorAll('#fundGrid .fund-card')).filter(function (c) {
          var f = window.FUNDS[parseInt(c.dataset.index)]; return f && matches(f, q);
        });
        if (cards.length) {
          var card = cards[0];
          card.style.display = '';
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
        } else {
          // 尝试资讯
          var n = (window.NEWS_EVENTS || []).findIndex(function (ev) {
            return norm(ev.title + ' ' + (ev.tags || []).join(' ')).indexOf(q) >= 0;
          });
          if (n >= 0) document.getElementById('news').scrollIntoView({ behavior: 'smooth' });
        }
        results.hidden = true;
      } else if (e.key === 'Escape') { results.hidden = true; input.blur(); }
    });

    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) results.hidden = true;
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.__initSearch = init;
})();
