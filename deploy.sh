#!/usr/bin/env bash
# 本机手动把 fund-trends 同步到 Gitee（GitHub Actions 的本地替代方案）
# 用法：./deploy.sh  （需本地已 git clone 且能访问 Gitee）
set -e

REMOTE="https://gitee.com/Kyrie11Feng7/fund-trends.git"

# 避免重复添加远程
git remote remove gitee 2>/dev/null || true
git remote add gitee "$REMOTE"

git push gitee main --force

echo "✅ 已推送到 Gitee。请到 Gitee 仓库 -> 服务 -> Gitee Pages 点「更新」完成部署。"
echo "🌐 国内地址：https://kyrie11feng7.gitee.io/fund-trends/"
