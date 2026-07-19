// 生成静态 rss.xml（P2-4）：从 js/news_deep.js 读取真实资讯并输出 RSS 2.0
// 运行：node gen_rss.js
const fs = require('fs');
const path = require('path');

// 部署目标（CloudStudio 幂等镜像，国内可访问）
const SITE = 'https://82663f8f67174322b6f93f4690d46afc.app.codebuddy.work';

const src = fs.readFileSync(path.join(__dirname, 'js/news_deep.js'), 'utf8');
const arrSrc = src.replace(/^[\s\S]*?window\.NEWS_DEEP\s*=\s*/, '').replace(/;\s*$/, '');
const items = eval('(' + arrSrc + ')');

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[c]));
}
function pubDate(d, t) {
  if (!d) return '';
  const dt = new Date(d + 'T' + (t || '00:00') + ':00');
  return isNaN(dt) ? '' : dt.toUTCString();
}

const body = items.map((it) => {
  const link = it.url ? it.url : SITE + '/#news';
  const desc = (it.summary || '').replace(/\n/g, ' ').slice(0, 400);
  return `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(it.date + '|' + it.title)}</guid>
      <pubDate>${esc(pubDate(it.date, it.time))}</pubDate>
      <category>${esc(it.category)}</category>
      <description>${esc(desc)}</description>
    </item>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>fund-trends · 科技基金趋势每日深度解读</title>
    <link>${SITE}/</link>
    <description>聚合真实财经资讯，每条含深度正文与「所以呢·市场含义」解读，并映射到相关主题基金。来源逐条标注、可核实，不构成投资建议。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>fund-trends static RSS generator</generator>
${body}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(__dirname, 'rss.xml'), xml);
console.log('[rss] wrote rss.xml with', items.length, 'items');
