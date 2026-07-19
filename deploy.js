#!/usr/bin/env node
/**
 * 部署到 GitHub Pages（通过 GitHub Contents API，无需本地 git）。
 *
 * 前置条件：
 *   1) 仓库已开启 GitHub Pages（Settings → Pages → Source 选 main 分支根目录 或 gh-pages）。
 *   2) 设置环境变量 GH_TOKEN（具备 repo 写权限的 Personal Access Token）。
 *
 * 运行：
 *   GH_TOKEN=xxx node deploy.js
 *   # 或自定义仓库/分支：
 *   REPO=owner/fund-trends BRANCH=main GH_TOKEN=xxx node deploy.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO = process.env.REPO || 'Kyrie11feng7/fund-trends';
const BRANCH = process.env.BRANCH || 'main';
const TOKEN = process.env.GH_TOKEN;
const ROOT = __dirname;

// 需要部署的文件（站点静态产物 + 数据 + 管线脚本）
const FILES = [
  'index.html',
  'fund_signals.json',
  'fund_nav.json',
  'backtest.json',
  'pipeline.js',
  '.github/workflows/daily-update.yml'
];

if (!TOKEN) {
  console.error('❌ 缺少环境变量 GH_TOKEN。请先生成具备 repo 权限的 Token 并 export GH_TOKEN=xxx');
  process.exit(1);
}

function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: urlPath,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'fund-trends-deploy',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(raw); } catch {}
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
        else reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function base64Encode(buf) {
  return Buffer.from(buf).toString('base64');
}

async function deployFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) { console.warn(`⚠️ 跳过不存在的文件：${relPath}`); return; }
  const content = base64Encode(fs.readFileSync(abs));
  const apiPath = `/repos/${REPO}/contents/${relPath}`;
  let sha;
  try {
    const existing = await apiRequest('GET', `${apiPath}?ref=${BRANCH}`);
    sha = existing.sha;
  } catch (e) { /* 文件不存在，创建 */ }

  await apiRequest('PUT', apiPath, {
    message: `deploy: update ${relPath}`,
    content,
    branch: BRANCH,
    ...(sha ? { sha } : {})
  });
  console.log(`✅ 已部署 ${relPath}`);
}

(async () => {
  console.log(`🚀 部署到 ${REPO}@${BRANCH}`);
  for (const f of FILES) {
    try { await deployFile(f); }
    catch (e) { console.error(`❌ 部署失败 ${f}: ${e.message}`); }
  }
  console.log('🎉 部署完成。GitHub Pages 通常 1–2 分钟内生效。');
  console.log(`🔗 访问：https://${REPO.split('/')[0]}.github.io/${REPO.split('/')[1]}/`);
})();
