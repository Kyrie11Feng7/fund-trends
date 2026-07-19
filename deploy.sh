#!/usr/bin/env bash
# 部署脚本：将改进版科技基金趋势分析站点推送到 GitHub Pages
#
# 用法：
#   1. 生成 Personal Access Token（repo 权限）：https://github.com/settings/tokens
#   2. 设置环境变量后运行：
#        export GH_TOKEN=ghp_xxx
#        ./deploy.sh
#
# 也可自定义仓库与分支：
#   REPO=owner/fund-trends BRANCH=main ./deploy.sh

set -e
cd "$(dirname "$0")"

if [ -z "$GH_TOKEN" ]; then
  echo "❌ 请先设置 GH_TOKEN： export GH_TOKEN=你的Token"
  exit 1
fi

echo "📦 运行每日数据管线（生成最新 fund_signals.json）..."
node pipeline.js || echo "（管线拉取失败则沿用已有数据，继续部署）"

echo "🚀 通过 GitHub Contents API 部署..."
node deploy.js

echo "✅ 完成。访问 https://${REPO_OWNER:-Kyrie11feng7}.github.io/fund-trends/"
