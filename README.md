# 科技基金趋势分析

结合全球新闻视角，追踪纳斯达克、新兴市场等核心科技基金的每日涨跌，深度解读波动背后的逻辑。

> ⚠️ 本站为个人研究/学习用途的数据可视化工具，**所有内容不构成任何投资建议**。

## 国内访问地址（纯国内节点，推荐）

- **Gitee Pages**：https://kyrie11feng7.gitee.io/fund-trends/
- 备用镜像（jsDelivr，已验证可直连）：https://cdn.jsdelivr.net/gh/Kyrie11Feng7/fund-trends@main/index.html

## 原始地址

- GitHub Pages：https://kyrie11feng7.github.io/fund-trends/ （国内常被墙，不推荐）

---

## 部署到 Gitee Pages（3 分钟，纯国内节点）

1. 登录 https://gitee.com （无账号先免费注册）
2. 右上角「+」→ **导入仓库** → 来源选 GitHub，填 `https://github.com/Kyrie11Feng7/fund-trends` → 创建
3. 进入仓库 → 顶部「**服务**」→ **Gitee Pages**
4. 部署分支选 `main`、部署目录选 `/` → 点「**启动**」
5. 约 1 分钟后得到国内地址：**https://kyrie11feng7.gitee.io/fund-trends/**

> 站点代码已在 GitHub `main` 分支，导入即生效，无需任何额外配置。

## 自动同步（可选）

若希望每次 push 自动更新 Gitee，配置 GitHub Actions：

1. 在 Gitee 生成私人令牌（**设置 → 私人令牌**，勾选 `projects` 与 `pages`）
2. 在 GitHub 仓库 **Settings → Secrets → Actions** 添加 `GITEE_TOKEN`，值填上面的 Gitee 令牌
3. 本仓库已包含 `.github/workflows/deploy.yml`，之后每次 push 到 main 会自动镜像到 Gitee 并重建 Pages

不加也能用：每次在 Gitee Pages 页面点一次「**更新**」即可。

## 数据来源（诚实标注）

| 数据 | 来源 | 说明 |
|------|------|------|
| 基金每日单位净值与涨跌幅 | 天天基金（东方财富 eastmoney） | 真实历史数据，成立以来至 2026-07-16 |
| 全球指数 / 黄金 / 原油 / 美债收益率 | neodata 真实行情快照 | 数据日期 2026-07-17（美债为 2026-06-30 月末值） |
| 恐惧贪婪指数 / VIX | CNN | 真实 |
| 新闻资讯 | neodata 聚合真实财经报道 | 逐条标注来源、可核实 |
| 指数温度卡的 PE / 远期PE / 历史分位 / 跌幅 | 示例值 | 待接入真实估值数据源 |

## 本地预览

    python3 -m http.server 8090
    # 浏览器打开 http://localhost:8090

## 目录结构

    index.html              站点入口
    css/style.css           样式
    js/                     数据与渲染逻辑（realdata / data / market_snapshot / news_deep / holdings / index_temperature / app）
    .github/workflows/       Gitee 自动同步
