# 手动在 GitHub 网页创建每日更新 Workflow 教程

> 目标：在 `Kyrie11feng7/fund-trends` 仓库里新建 `.github/workflows/daily-update.yml`，让站点实现「每日自动刷新信号」。
> 适用场景：你的 Personal Access Token（PAT）只有 `repo` 权限、没有 `workflow` scope，导致用 API/脚本推 `.github/workflows/` 文件会被 GitHub 拒绝（返回 404）。**网页手动创建不受此限制**——这是 GitHub 唯一允许「无 workflow scope 也能写 workflow」的入口。

---

## 一、前置确认（10 秒）

1. 浏览器打开并登录 GitHub，确认你已登录账号 **Kyrie11Feng7**。
2. 打开仓库：`https://github.com/Kyrie11feng7/fund-trends`
3. 确认页面顶部能看到文件列表里有 `index.html`、`fund_signals.json`、`pipeline.js` 等（说明 v2.0 已在线，正常工作）。

---

## 二、Step by Step（网页操作）

### 步骤 1：进入新建文件入口
在仓库主页（文件列表上方一行工具栏），找到右侧的绿色按钮 **「Add file」**，点击它，在弹出的下拉菜单里选择 **「Create new file」**。

> 位置提示：绿色「Add file」按钮通常在「Go to file」搜索框右边、「<> Code」蓝色按钮左边。

### 步骤 2：填写文件路径（关键！）
页面会跳到一个编辑界面，顶部有一个输入框，placeholder 写着 `Name your file...`。

**在这个框里输入完整路径（一字不差）：**
```
.github/workflows/daily-update.yml
```

> ⚠️ 要点：
> - 路径必须**以 `.` 开头**（`.github` 是隐藏目录）。
> - 输入 `daily-update.yml` 前面的 `/` 时，GitHub 会**自动把 `daily-update.yml` 放进 `workflows` 子目录**，`workflows` 又会自动放进 `.github` 子目录。你不需要手动建三层目录，直接连写即可。
> - 文件名后缀必须是 `.yml`（不是 `.yaml` 也行，但本教程用 `.yml`，和脚本一致）。

### 步骤 3：粘贴文件内容
在下方的大文本框（「Edit new file」区域）里，**清空默认空内容**，把下面这段**完整复制粘贴**进去：

```yaml
name: 每日信号更新

on:
  schedule:
    # 每个交易日收盘后（北京时间约 16:30 / UTC 08:30）触发；周一至周五
    - cron: '30 8 * * 1-5'
  workflow_dispatch: {}

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: 检出仓库
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 设置 Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: 运行数据管线
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node pipeline.js

      - name: 提交更新
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          if [ -n "$(git status --porcelain fund_signals.json)" ]; then
            git add fund_signals.json
            git commit -m "chore: daily signal update $(date +%F)"
            git push
          else
            echo "无变化，跳过提交"
          fi
```

> 粘贴后核对两处：
> - 第 1 行是 `name: 每日信号更新`
> - 最后一行是 `fi`（没有多余空行或截断）

### 步骤 4：填写提交说明
右侧「Commit changes」区域：
- **第一个输入框（标题）**：填 `ci: add daily signal update workflow`
- **第二个输入框（描述，可选）**：可留空，或填 `每日北京时间 16:30 自动跑 pipeline.js 刷新 fund_signals.json`

### 步骤 5：选择提交位置
在「Commit changes」区域下方，有一个单选：
- 默认选中 **「Commit directly to the `main` branch」**（直接提交到 main 分支）——**保持这个默认即可，不要选下面的新建分支（Create a new branch）选项**，否则不会直接生效。

### 步骤 6：点击提交
点击绿色的 **「Commit changes」** 按钮。

页面会自动刷新，文件列表里应该出现 `.github` 文件夹（点进去能看到 `workflows/daily-update.yml`）。

### 步骤 7：验证 Workflow 已创建
1. 在仓库主页顶部一排标签里，点击 **「Actions」** 标签。
2. 左侧栏应该出现一个工作流名叫 **「每日信号更新」**。
3. 点击它，右侧会显示运行记录。刚创建时可能没有运行记录，这是正常的。

---

## 三、手动触发一次测试（推荐做）

确认 workflow 能跑通，不必干等次日：

1. 进入仓库 **「Actions」** 标签 → 点击左侧 **「每日信号更新」**。
2. 右侧右上方有一个 **「Run workflow」** 下拉按钮（右边带小三角），点击它。
3. 在弹出的小面板里，分支选 `main`，点击绿色的 **「Run workflow」**。
4. 页面会出现一条新的运行记录，状态先是黄点（排队/运行中），等 1–2 分钟变成 **绿色对勾 ✅** 即成功。
5. 点进这条记录，查看各步骤日志，确认 `运行数据管线` 和 `提交更新` 都成功。

> 成功后，`fund_signals.json` 的「最近提交」时间会更新，说明自动刷新链路已打通。

---

## 四、❗ 必须知道的一个真相（避免误解）

即使 workflow 跑通，**目前 `fund_signals.json` 的数据也不会真正「变」**——原因：

- `pipeline.js` 里拉取行情的代码是**占位实现**：当拉不到真实数据（比如依赖的外部行情接口在当前环境不通）时，它会**回退到上一版数值**，所以每次跑出来的结果和上次一样。
- 因此现在的状态是：「**每天会自动跑一遍任务，但数据是静态的**」。这能证明自动化链路通了，但还没实现真正的「数据日更」。

要让「每日自动更新」名副其实，需要把 `pipeline.js` 接入**真实净值/行情接口**（如天天基金、东方财富公开接口），完善它的解析逻辑。这一步做完，每次定时任务才会真正滚动出新的信号数据。

同理，`fund_nav.json`（净值曲线）和 `backtest.json`（回测）目前也是 **DEMO 数据**，需要另接真实数据源驱动。

---

## 五、常见问题

| 现象 | 原因 | 解决 |
|---|---|---|
| 粘贴后 GitHub 提示 YAML 格式错误 | 缩进用了 Tab 或混用空格 | 全部用 2 个空格缩进，不要 Tab；直接复制本教程里的代码块可避免 |
| Actions 里看不到「每日信号更新」 | 文件没提交到 main 分支，或路径写错 | 确认路径是 `.github/workflows/daily-update.yml`；确认提交到 main 而非新分支 |
| Run workflow 后失败在 `检出仓库` | 仓库权限问题（极少） | 一般自动通过；若失败可重试 |
| 跑成功了但站点数据没变 | 见上文「真相」一节 | 需完善 pipeline.js 真实数据接入 |
| 想停掉自动更新 | 不需要删文件 | 进 Actions → 该 workflow → 右侧 `...` 菜单 → 「Disable workflow」即可暂停 |

---

## 六、后续可选项

- **接真实数据**：把 `pipeline.js` 的 `fetchTechnical` 改为真实接口解析，每日任务即可真正刷新。
- **扩展更新范围**：若将来 `fund_nav.json` / `backtest.json` 也接了真实数据，把 workflow 里 `git add fund_signals.json` 改为 `git add fund_signals.json fund_nav.json backtest.json` 即可一并提交。
- **改触发时间**：编辑 `cron: '30 8 * * 1-5'`（`分 时 日 月 周`，UTC 时间）。例如想北京时间 20:00 跑，改为 `'0 12 * * 1-5'`（UTC 12:00 = 北京 20:00）。

---

> ⚠️ 本教程由 AI 基于公开操作整理，仅供参考。投资有风险，站点内容不构成任何投资建议。
