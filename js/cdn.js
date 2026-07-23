/* ============================================
 * CDN 数据源加载器
 * ------------------------------------------------------------
 * 背景：站点为纯静态托管（GitHub Pages / CloudStudio 镜像），但每日
 * 更新的数据（净值/信号/费率/温度/新闻）由 GitHub Actions 提交到
 * main 分支。为了让「任意静态入口」打开时都能自动看到最新数据，
 * 这里把数据读取源从「站点同目录相对路径」改为「jsDelivr CDN 拉取
 * GitHub main 分支」，并附带多边缘兜底链。
 *
 * 多边缘兜底：cdn -> fastly -> gcore（均为 jsDelivr 边缘，国内可用性高）
 *            -> raw.githubusercontent.com（海外/代理兜底）
 * ============================================ */
(function () {
  'use strict';

  var BASES = [
    'https://cdn.jsdelivr.net/gh/Kyrie11Feng7/fund-trends@main',
    'https://fastly.jsdelivr.net/gh/Kyrie11Feng7/fund-trends@main',
    'https://gcore.jsdelivr.net/gh/Kyrie11Feng7/fund-trends@main',
    'https://raw.githubusercontent.com/Kyrie11Feng7/fund-trends/main'
  ];

  /* 依次尝试各 CDN 边缘，成功返回一个解析后的 JSON */
  function loadJSON(path) {
    return new Promise(function (resolve, reject) {
      var i = 0;
      function next() {
        if (i >= BASES.length) {
          return reject(new Error('CDN 全部不可用: ' + path));
        }
        var url = BASES[i] + '/' + path + '?t=' + Date.now();
        fetch(url, { cache: 'no-cache' })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          })
          .then(resolve)
          .catch(function (e) {
            i++;
            if (i < BASES.length) next();
            else reject(e);
          });
      }
      next();
    });
  }

  /* 脚本型数据（realdata / news）走 CDN，带同样兜底链 */
  function loadScript(path) {
    return new Promise(function (resolve, reject) {
      var i = 0;
      function next() {
        if (i >= BASES.length) return reject(new Error('script CDN 全部不可用: ' + path));
        var s = document.createElement('script');
        s.src = BASES[i] + '/' + path + '?t=' + Date.now();
        s.onload = resolve;
        s.onerror = function () { i++; next(); };
        document.head.appendChild(s);
      }
      next();
    });
  }

  /* 生成带兜底链的 <script> 标签（供 index.html document.write 同步写入） */
  function dataScriptTag(rel) {
    var b = BASES;
    var ts = Date.now();
    var tag = '<script src="' + b[0] + '/' + rel + '?t=' + ts + '"';
    for (var i = 1; i < b.length; i++) {
      tag += ' onerror="this.onerror=null;this.src=\'' + b[i] + '/' + rel + '?t=' + ts + '\'"';
    }
    tag += '><\/script>';
    return tag;
  }

  window.CDN = {
    loadJSON: loadJSON,
    loadScript: loadScript,
    dataScriptTag: dataScriptTag,
    BASES: BASES
  };
})();
