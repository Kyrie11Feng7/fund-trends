/**
 * 科技基金趋势分析 - 应用逻辑
 * 负责渲染：全球指数、基金卡片、趋势图表、新闻时间线
 * 以及所有交互逻辑
 */

(function () {
  "use strict";

  // ============ 全局状态 ============
  const state = {
    selectedFundIndex: 0,
    windowKey: "1y", // 时间区间：since/5y/3y/1y/6m/3m/1m
    compareMode: false,
    comparedFunds: new Set([0]),
    newsCategory: "all",
    mainChart: null,
    barChart: null,
    sparkCharts: [],
  };

  // ============ 时间区间配置（成立以来 / 5年 / 3年 / 1年 / 半年 / 3月 / 1月）============
  const TIME_WINDOWS = [
    { key: "since", label: "成立以来", months: null },
    { key: "5y", label: "近5年", months: 60 },
    { key: "3y", label: "近3年", months: 36 },
    { key: "1y", label: "近1年", months: 12 },
    { key: "6m", label: "近半年", months: 6 },
    { key: "3m", label: "近3月", months: 3 },
    { key: "1m", label: "近1月", months: 1 },
  ];

  function parseDate(s) {
    const p = String(s).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function addMonths(date, n) {
    return new Date(date.getFullYear(), date.getMonth() + n, date.getDate());
  }
  function getWindowDef(key) {
    return TIME_WINDOWS.find((x) => x.key === key) || TIME_WINDOWS[3];
  }
  function isLongWindow(key) {
    const w = getWindowDef(key);
    return w.months === null || w.months >= 6;
  }
  // 按所选区间切片完整净值序列（成立以来会尊重基金成立日）
  function getWindowSlice(fund, key) {
    const data = fund.data;
    if (!data || data.length === 0) return [];
    const last = data[data.length - 1];
    const lastDate = parseDate(last.date);
    const w = getWindowDef(key);
    let startIdx = 0;
    if (w.months !== null) {
      const start = addMonths(lastDate, -w.months);
      let i = 0;
      while (i < data.length && parseDate(data[i].date) < start) i++;
      startIdx = i;
    }
    if (key === "since" && fund.inception) {
      const inc = parseDate(fund.inception);
      let i = 0;
      while (i < data.length && parseDate(data[i].date) < inc) i++;
      startIdx = Math.max(startIdx, i);
    }
    return data.slice(startIdx);
  }
  // 区间指标：区间收益、最大回撤、年化波动、区间最高/最低（均基于复权净值 acc，已还原拆分/分红）
  function computeMetrics(slice) {
    if (!slice || slice.length === 0) return null;
    const val = (d) => (d.acc != null ? d.acc : d.nav);
    const first = slice[0];
    const last = slice[slice.length - 1];
    const cumReturn = ((val(last) - val(first)) / val(first)) * 100;
    let peak = val(first);
    let maxDD = 0;
    for (const d of slice) {
      const v = val(d);
      if (v > peak) peak = v;
      const dd = (peak - v) / peak * 100;
      if (dd > maxDD) maxDD = dd;
    }
    const changes = slice.map((d) => d.change || 0);
    const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
    const variance = changes.reduce((a, b) => a + (b - mean) * (b - mean), 0) / changes.length;
    const vol = Math.sqrt(variance) * Math.sqrt(252);
    const maxNav = Math.max.apply(null, slice.map((d) => val(d)));
    const minNav = Math.min.apply(null, slice.map((d) => val(d)));
    return {
      cumReturn: cumReturn,
      maxDD: maxDD,
      vol: vol,
      maxNav: maxNav,
      minNav: minNav,
      startDate: first.date,
      endDate: last.date,
      count: slice.length,
    };
  }
  // 区间是否因基金成立不足而被截断（显示成立至今）
  function isCappedWindow(fund, key) {
    const w = getWindowDef(key);
    if (key === "since" || w.months === null) return false;
    const lastDate = parseDate(fund.latestDate || fund.data[fund.data.length - 1].date);
    const start = addMonths(lastDate, -w.months);
    return parseDate(fund.data[0].date) > start;
  }
  function tickLabel(d, key) {
    return key === "1m" || key === "3m" ? d.dateCN : d.date;
  }

  // ============ DOM Ready ============
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    renderIndices();
    renderSentiment();
    renderSentimentDetail();
    renderFundCards();
    renderFundSelector();
    renderMainChart();
    renderBarChart();
    renderDailyTable();
    renderWindowSummary();
    updateBarAndTableVisibility();
    renderNewsTimeline();
    initNav();
    initBackToTop();
    initTimeframeButtons();
    initCompareToggle();
    initNewsFilters();
  }

  // ============ 渲染全球指数 ============
  function renderIndices() {
    const grid = document.getElementById("indicesGrid");
    if (!grid) return;

    grid.innerHTML = GLOBAL_INDICES.map((idx) => {
      const isUp = idx.change >= 0;
      return `
        <div class="index-card">
          <div class="index-name">${idx.name}</div>
          <div class="index-value">${idx.value}</div>
          <div class="index-change ${isUp ? "text-up" : "text-down"}">
            ${isUp ? "▲" : "▼"} ${Math.abs(idx.change).toFixed(2)}%
          </div>
        </div>
      `;
    }).join("");
  }

  // ============ 渲染市场情绪 ============
  function renderSentiment() {
    const bar = document.getElementById("sentimentBar");
    if (!bar) return;

    const s = MARKET_SENTIMENT;
    const sentimentColor =
      s.fearGreedIndex >= 70
        ? "text-up"
        : s.fearGreedIndex >= 40
        ? "text-down"
        : "text-down";

    bar.innerHTML = `
      <div class="sentiment-item">
        <span class="sentiment-label">恐惧贪婪指数</span>
        <span class="sentiment-value ${sentimentColor}">${s.fearGreedIndex}</span>
        <span class="sentiment-tag ${s.fearGreedIndex >= 50 ? "bg-up" : "bg-down"}">${s.sentimentLabel}</span>
      </div>
      <div class="sentiment-item">
        <span class="sentiment-label">VIX 恐慌指数</span>
        <span class="sentiment-value">${s.vix}</span>
        <span class="sentiment-tag bg-up">${s.vixLabel}</span>
      </div>
      <div class="sentiment-item">
        <span class="sentiment-label">10年美债收益率</span>
        <span class="sentiment-value">${s.tenYearYield}</span>
      </div>
      <div class="sentiment-item">
        <span class="sentiment-label">美元指数</span>
        <span class="sentiment-value">${s.dollarIndex}</span>
      </div>
      <div class="sentiment-item">
        <span class="sentiment-label">黄金</span>
        <span class="sentiment-value">${s.goldPrice}</span>
      </div>
      <div class="sentiment-item">
        <span class="sentiment-label">原油</span>
        <span class="sentiment-value">${s.oilPrice}</span>
      </div>
    `;
  }

  // ============ 渲染市场情绪详解（数值注入） ============
  function renderSentimentDetail() {
    const s = window.MARKET_SENTIMENT;
    if (!s) return;

    setText("sentDataDate", s.dataDate || "—");
    setText("sentDataSource", s.dataSource || "");

    const fg = Number(s.fearGreedIndex);
    setText("fgValue", fg);
    setTag("fgTag", s.sentimentLabel || fgLabel(fg), fgTagColor(fg));
    setText("fgDesc", fgDescText(fg));
    const fgPtr = document.getElementById("fgPointer");
    if (fgPtr) fgPtr.style.left = clampPct(fg, 0, 100) + "%";

    const vx = Number(s.vix);
    setText("vixValue", vx.toFixed(2));
    setTag("vixTag", s.vixLabel || vixLabel(vx), vixTagColor(vx));
    setText("vixDesc", vixDescText(vx));
    const vxPtr = document.getElementById("vixPointer");
    if (vxPtr) vxPtr.style.left = clampPct((vx / 40) * 100, 0, 100) + "%";
  }

  function setTag(id, text, colorClass) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = "sent-gauge-tag " + colorClass;
  }
  function fgTagColor(v) {
    if (v < 25) return "tag-red";
    if (v < 50) return "tag-orange";
    if (v === 50) return "tag-neutral";
    if (v < 75) return "tag-green-soft";
    return "tag-green";
  }
  function vixTagColor(v) {
    if (v < 15) return "tag-green";
    if (v < 20) return "tag-neutral";
    if (v < 30) return "tag-orange";
    if (v < 40) return "tag-red";
    return "tag-red-deep";
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function clampPct(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  function fgLabel(v) {
    if (v < 25) return "极度恐惧";
    if (v < 50) return "恐惧";
    if (v === 50) return "中性";
    if (v < 75) return "贪婪";
    return "极度贪婪";
  }
  function vixLabel(v) {
    if (v < 15) return "低波动·平静";
    if (v < 20) return "正常波动";
    if (v < 30) return "波动上升";
    if (v < 40) return "高度恐慌";
    return "极端恐慌";
  }
  function fgDescText(v) {
    if (v < 25) return "极度恐惧：市场抛售情绪浓厚，常对应非理性低估，逆向投资者关注布局机会。";
    if (v < 50) return "恐惧：投资者避险情绪偏浓，但未见极端恐慌，需结合估值与基本面判断。";
    if (v === 50) return "中性：多空均衡，市场无明显情绪偏向。";
    if (v < 75) return "贪婪：风险偏好上升、追涨情绪升温，需警惕估值过热。";
    return "极度贪婪：市场过度乐观，历史经验提示回撤风险升高。";
  }
  function vixDescText(v) {
    if (v < 15) return "低波动：市场平静甚至自满，保护性期权成本低，但『自满』本身也是风险信号。";
    if (v < 20) return "正常波动：市场情绪平稳，趋势运行健康。";
    if (v < 30) return "波动上升：不确定性增加，关注潜在风险事件。";
    if (v < 40) return "高度恐慌：系统性担忧升温，股指通常承压。";
    return "极端恐慌：危机模式，历史上往往是极端情绪释放的末端。";
  }

  // ============ 渲染基金卡片 ============
  function renderFundCards() {
    const grid = document.getElementById("fundGrid");
    if (!grid) return;

    grid.innerHTML = FUNDS.map((fund, i) => {
      const isUp = fund.latestChange >= 0;
      const periodClass = fund.periodReturn >= 0 ? "up" : "down";

      return `
        <div class="fund-card ${isUp ? "" : "down"} fade-in" data-index="${i}" style="animation-delay: ${i * 0.08}s">
          <div class="fund-card-header">
            <div class="fund-card-info">
              <h3>${fund.name}</h3>
              <div class="fund-card-code">${fund.code} · ${fund.enName}</div>
            </div>
            <span class="fund-type-badge">${fund.type}</span>
          </div>
          <div class="fund-card-stats">
            <span class="fund-nav">${fund.latestNav.toFixed(4)}</span>
            <span class="fund-change ${isUp ? "up" : "down"}">
              ${isUp ? "▲" : "▼"} ${Math.abs(fund.latestChange).toFixed(2)}%
            </span>
          </div>
          <canvas class="fund-sparkline" id="spark-${i}"></canvas>
          <div class="fund-card-footer">
            <span class="fund-period">
              30日收益 <strong class="${periodClass}">${fund.periodReturn >= 0 ? "+" : ""}${fund.periodReturn}%</strong>
            </span>
            <span class="fund-manager">${fund.manager}</span>
          </div>
        </div>
      `;
    }).join("");

    // 绘制 sparkline
    FUNDS.forEach((fund, i) => {
      drawSparkline(`spark-${i}`, fund.data);
    });

    // 卡片点击 -> 跳转到图表
    grid.querySelectorAll(".fund-card").forEach((card) => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.dataset.index);
        state.selectedFundIndex = idx;
        state.comparedFunds = new Set([idx]);
        state.compareMode = false;
        updateFundSelector();
        updateChart();
        document.getElementById("chart").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // ============ 绘制 Sparkline ============
  function drawSparkline(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = 4;
    const navs = data.map((d) => d.nav);
    const min = Math.min(...navs);
    const max = Math.max(...navs);
    const range = max - min || 1;

    const isUp = navs[navs.length - 1] >= navs[0];
    const color = isUp ? "#00d68f" : "#ff5252";

    // 渐变填充
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isUp ? "rgba(0,214,143,0.2)" : "rgba(255,82,82,0.2)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    // 路径
    const points = navs.map((nav, i) => {
      const x = padding + (i / (navs.length - 1)) * (w - padding * 2);
      const y = h - padding - ((nav - min) / range) * (h - padding * 2);
      return { x, y };
    });

    // 填充区域
    ctx.beginPath();
    ctx.moveTo(points[0].x, h);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 线条
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // 末端圆点
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  // ============ 基金选择器 ============
  function renderFundSelector() {
    const selector = document.getElementById("fundSelector");
    if (!selector) return;

    const colors = [
      "#00d68f",
      "#448aff",
      "#a855f7",
      "#ffc839",
      "#ff8a65",
      "#26c6da",
    ];

    selector.innerHTML = FUNDS.map((fund, i) => {
      return `
          <button class="fund-chip ${i === state.selectedFundIndex ? "active" : ""}" data-index="${i}">
          <span class="fund-chip-dot" style="background: ${colors[i % colors.length]}"></span>
          ${fund.name}
        </button>
      `;
    }).join("");

    selector.querySelectorAll(".fund-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const idx = parseInt(chip.dataset.index);

        if (state.compareMode) {
          // 对比模式：切换选中
          if (state.comparedFunds.has(idx)) {
            if (state.comparedFunds.size > 1) {
              state.comparedFunds.delete(idx);
            }
          } else {
            state.comparedFunds.add(idx);
          }
        } else {
          state.selectedFundIndex = idx;
          state.comparedFunds = new Set([idx]);
        }

        updateFundSelector();
        updateChart();
      });
    });
  }

  function updateFundSelector() {
    const selector = document.getElementById("fundSelector");
    if (!selector) return;

    selector.querySelectorAll(".fund-chip").forEach((chip) => {
      const idx = parseInt(chip.dataset.index);
      if (state.compareMode) {
        chip.classList.toggle("active", state.comparedFunds.has(idx));
      } else {
        chip.classList.toggle("active", idx === state.selectedFundIndex);
      }
    });
  }

  // ============ 主图表 ============
  function renderMainChart() {
    const canvas = document.getElementById("mainChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    state.mainChart = new Chart(ctx, {
      type: "line",
      data: getChartData(),
      options: getChartOptions(),
    });

    updateChartInfo();
  }

  function getChartData() {
    const colors = [
      "#00d68f",
      "#448aff",
      "#a855f7",
      "#ffc839",
      "#ff8a65",
      "#26c6da",
    ];

    const indices = state.compareMode
      ? Array.from(state.comparedFunds)
      : [state.selectedFundIndex];

    // 获取日期标签（基于第一个基金，按所选区间切片）
    const firstFund = FUNDS[indices[0]];
    const data = getWindowSlice(firstFund, state.windowKey);
    const labels = data.map((d) => tickLabel(d, state.windowKey));

    const datasets = indices.map((fundIdx, i) => {
      const fund = FUNDS[fundIdx];
      const fundData = getWindowSlice(fund, state.windowKey);
      const color = colors[fundIdx % colors.length];

      // 归一化净值（对比模式下以起点为100）；趋势线用复权净值 acc，真实反映收益与回撤
      const baseNav = fundData[0].acc != null ? fundData[0].acc : fundData[0].nav;
      const navValues = state.compareMode
        ? fundData.map((d) => (((d.acc != null ? d.acc : d.nav) / baseNav) * 100).toFixed(2))
        : fundData.map((d) => (d.acc != null ? d.acc : d.nav));

      // 创建渐变
      const canvas = document.getElementById("mainChart");
      const ctx2 = canvas.getContext("2d");
      const gradient = ctx2.createLinearGradient(0, 0, 0, 420);
      const rgbaColor = hexToRgba(color, 0.15);
      gradient.addColorStop(0, rgbaColor);
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      return {
        label: fund.name,
        data: navValues,
        borderColor: color,
        backgroundColor: i === 0 ? gradient : "transparent",
        borderWidth: 2,
        fill: !state.compareMode || i === 0,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      };
    });

    return { labels, datasets };
  }

  function getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: state.compareMode,
          position: "top",
          labels: {
            color: "#8b8fa3",
            font: { size: 13, family: "Inter" },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: "rgba(19, 24, 37, 0.95)",
          titleColor: "#e0e3eb",
          bodyColor: "#8b8fa3",
          borderColor: "#1e2535",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 13, weight: "bold", family: "Inter" },
          bodyFont: { size: 13, family: "JetBrains Mono" },
          displayColors: true,
          boxPadding: 4,
          callbacks: {
            label: function (ctx) {
              const value = ctx.parsed.y;
              if (state.compareMode) {
                return `${ctx.dataset.label}: ${value}`;
              }
              return `${ctx.dataset.label}: ${parseFloat(value).toFixed(4)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(30, 37, 53, 0.5)",
            drawBorder: false,
          },
          ticks: {
            color: "#5a5e72",
            font: { size: 11, family: "Inter" },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          grid: {
            color: "rgba(30, 37, 53, 0.5)",
            drawBorder: false,
          },
          ticks: {
            color: "#5a5e72",
            font: { size: 12, family: "JetBrains Mono" },
            callback: function (value) {
              if (state.compareMode) {
                return value.toFixed(0);
              }
              return value.toFixed(3);
            },
          },
        },
      },
      animation: {
        duration: 600,
        easing: "easeOutQuart",
      },
    };
  }

  function updateChart() {
    if (!state.mainChart) return;

    // 仅更新数据 + 图例显示状态，避免整体替换 options 触发整图重绘/重排版
    const cd = getChartData();
    state.mainChart.data.labels = cd.labels;
    state.mainChart.data.datasets = cd.datasets;
    state.mainChart.options.plugins.legend.display = state.compareMode;
    state.mainChart.update("none"); // 切换时禁用动画，瞬间完成

    const cap = document.getElementById("chartCaption");
    if (cap) {
      cap.textContent = state.compareMode
        ? "对比模式：各基金净值以区间起点 = 100 归一化，便于横向比较相对表现。"
        : "趋势线为累计净值（复权），已还原份额拆分与分红，真实反映区间收益与最大回撤；下方「每日明细」展示单位净值。";
    }

    updateChartInfo();
    updateBarChart();
    // 每日明细表 / 持仓 / 归因 DOM 较重，推迟到下一帧渲染，保证图表/柱形图切换即时可见
    requestAnimationFrame(() => {
      renderDailyTable();
      renderWindowSummary();
      updateBarAndTableVisibility();
      renderHoldings();
      renderAttribution();
    });
  }

  // ============ 每日涨跌柱状图 ============
  function renderBarChart() {
    const canvas = document.getElementById("barChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    state.barChart = new Chart(ctx, {
      type: "bar",
      data: getBarChartData(),
      options: getBarChartOptions(),
    });
  }

  function getBarChartData() {
    const fund = FUNDS[state.selectedFundIndex];
    let data = getWindowSlice(fund, state.windowKey);
    // 柱状图最多保留最近 120 根，避免长区间卡顿（长区间时柱状图本身会隐藏）
    if (data.length > 120) data = data.slice(-120);
    const labels = data.map((d) => tickLabel(d, state.windowKey));
    const changes = data.map((d) => d.change);

    // 颜色：涨绿跌红
    const bgColors = changes.map((c) =>
      c >= 0 ? "rgba(0, 214, 143, 0.7)" : "rgba(255, 82, 82, 0.7)"
    );
    const hoverColors = changes.map((c) =>
      c >= 0 ? "rgba(0, 214, 143, 1)" : "rgba(255, 82, 82, 1)"
    );

    return {
      labels,
      datasets: [
        {
          label: `${fund.name} 每日涨跌幅 (%)`,
          data: changes,
          backgroundColor: bgColors,
          hoverBackgroundColor: hoverColors,
          borderRadius: 3,
          borderSkipped: false,
        },
      ],
    };
  }

  function getBarChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(19, 24, 37, 0.95)",
          titleColor: "#e0e3eb",
          bodyColor: "#8b8fa3",
          borderColor: "#1e2535",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 13, weight: "bold", family: "Inter" },
          bodyFont: { size: 13, family: "JetBrains Mono" },
          callbacks: {
            label: function (ctx) {
              const val = ctx.parsed.y;
              const sign = val >= 0 ? "+" : "";
              return `涨跌幅: ${sign}${val.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(30, 37, 53, 0.5)",
            drawBorder: false,
          },
          ticks: {
            color: "#5a5e72",
            font: { size: 10, family: "Inter" },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 15,
          },
        },
        y: {
          grid: {
            color: "rgba(30, 37, 53, 0.5)",
            drawBorder: false,
          },
          ticks: {
            color: "#5a5e72",
            font: { size: 12, family: "JetBrains Mono" },
            callback: function (value) {
              return value.toFixed(2) + "%";
            },
          },
        },
      },
      animation: {
        duration: 400,
        easing: "easeOutQuart",
      },
    };
  }

  function updateBarChart() {
    if (!state.barChart) return;
    // 长区间不绘制每日涨跌柱状图（避免超长序列卡顿，且该类区间以净值走势为主）
    if (isLongWindow(state.windowKey)) return;
    // 仅更新数据，禁用更新动画，保证切换基金时柱形图即时刷新
    const bd = getBarChartData();
    state.barChart.data.labels = bd.labels;
    state.barChart.data.datasets = bd.datasets;
    state.barChart.update("none");
  }

  function updateBarAndTableVisibility() {
    const barSection = document.getElementById("barChartSection");
    const tableSection = document.getElementById("dailyTableSection");
    const analysisExtra = document.getElementById("analysisExtra");
    const summarySection = document.getElementById("windowSummarySection");

    if (state.compareMode) {
      barSection?.classList.add("hidden");
      tableSection?.classList.add("hidden");
      analysisExtra?.classList.add("hidden");
      summarySection?.classList.add("hidden");
    } else {
      analysisExtra?.classList.remove("hidden");
      summarySection?.classList.remove("hidden");
      tableSection?.classList.remove("hidden");
      // 长区间不显示每日涨跌柱状图（以净值走势为主）
      if (isLongWindow(state.windowKey)) {
        barSection?.classList.add("hidden");
      } else {
        barSection?.classList.remove("hidden");
      }
    }
  }

  // ============ 持仓结构 ============
  function renderHoldings() {
    const listEl = document.getElementById("holdingsList");
    const asOfEl = document.getElementById("holdingsAsOf");
    if (!listEl) return;

    const fund = FUNDS[state.selectedFundIndex];
    const h = (window.FUND_HOLDINGS && window.FUND_HOLDINGS[fund.code]) || null;

    if (!h || !h.stocks || h.stocks.length === 0) {
      if (asOfEl) asOfEl.textContent = "";
      listEl.innerHTML = `<p class="analysis-empty">该基金为指数型ETF，持仓为跟踪指数全部成分股，前十大持仓未单独披露；净值变动请参考上方指数与净值走势。</p>`;
      return;
    }

    if (asOfEl) asOfEl.textContent = `(截至 ${h.asOf})`;
    const maxW = Math.max(...h.stocks.map((s) => s.weight));
    listEl.innerHTML = h.stocks
      .map((s) => {
        const isOverseas = s.market > 1;
        const tag = isOverseas
          ? s.market === 105 || s.market === 106
            ? "美股"
            : "海外"
          : s.market === 0
          ? "沪"
          : "深";
        const barW = Math.max(2, (s.weight / maxW) * 100);
        return `
          <div class="holding-row">
            <div class="holding-top">
              <span class="holding-name">${s.name}</span>
              <span class="holding-tag ${isOverseas ? "tag-overseas" : "tag-ashare"}">${tag}</span>
              <span class="holding-weight">${s.weight.toFixed(2)}%</span>
            </div>
            <div class="holding-bar"><div class="holding-bar-fill" style="width:${barW}%"></div></div>
          </div>`;
      })
      .join("");
  }

  // ============ 涨跌归因 ============
  function driverItem(d, isUp) {
    const sign = d.change >= 0 ? "+" : "";
    const csign = d.contrib >= 0 ? "+" : "";
    return `
      <div class="driver-item ${isUp ? "up" : "down"}">
        <span class="driver-name">${d.name}</span>
        <span class="driver-detail">权重 ${d.weight.toFixed(2)}% · 个股 ${sign}${d.change.toFixed(2)}%</span>
        <span class="driver-contrib">贡献 ${csign}${d.contrib.toFixed(2)}pp</span>
      </div>`;
  }

  function renderAttribution() {
    const body = document.getElementById("attributionBody");
    if (!body) return;

    const fund = FUNDS[state.selectedFundIndex];
    const h = (window.FUND_HOLDINGS && window.FUND_HOLDINGS[fund.code]) || null;

    if (!h || !h.attribution || !h.attribution.available) {
      const note =
        h && h.attribution ? h.attribution.note : "该基金前十大持仓未披露，暂无法做涨跌归因。";
      body.innerHTML = `<p class="analysis-empty">${note}</p>`;
      return;
    }

    const a = h.attribution;
    const upHtml = a.up.length
      ? a.up.map((d) => driverItem(d, true)).join("")
      : `<div class="attr-empty">当日无显著上涨持仓</div>`;
    const downHtml = a.down.length
      ? a.down.map((d) => driverItem(d, false)).join("")
      : `<div class="attr-empty">当日无显著下跌持仓</div>`;

    body.innerHTML = `
      <div class="attr-col">
        <div class="attr-col-title up">▲ 上涨主因</div>
        ${upHtml}
      </div>
      <div class="attr-col">
        <div class="attr-col-title down">▼ 下跌主因</div>
        ${downHtml}
      </div>
      <p class="attr-note">说明：基金净值日与个股交易日可能相差 1 个交易日，本归因基于最新披露持仓与对应个股最近交易日真实涨跌幅，属近似解释，非精确复算。</p>
    `;
  }

  // ============ 每日明细数据表 ============
  function renderDailyTable() {
    const wrap = document.getElementById("dailyTableWrap");
    if (!wrap) return;

    const fund = FUNDS[state.selectedFundIndex];
    const full = getWindowSlice(fund, state.windowKey);
    // 明细表过长时仅展示最近 150 条，避免超长区间渲染卡顿
    const truncated = full.length > 150;
    const data = truncated ? full.slice(-150) : full;

    // 最大涨跌幅（用于柱状图缩放）
    const maxAbsChange = Math.max(...data.map((d) => Math.abs(d.change)), 0.01);

    // 检查该日期是否有新闻事件
    const newsMap = {};
    NEWS_EVENTS.forEach((news) => {
      newsMap[news.date] = news;
    });

    wrap.innerHTML = `
      <table class="daily-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>净值</th>
            <th>涨跌幅</th>
            <th>涨跌幅度</th>
            <th>新闻</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map((d) => {
              const isUp = d.change >= 0;
              const barWidth = (Math.abs(d.change) / maxAbsChange) * 48;
              const news = newsMap[d.date];
              const hasNews = !!news;

              return `
                <tr class="${hasNews ? "row-highlight" : ""}">
                  <td class="col-date">${d.dateCN}</td>
                  <td class="col-nav">${d.nav.toFixed(4)}</td>
                  <td class="col-change ${isUp ? "up" : "down"}">
                    ${isUp ? "+" : ""}${d.change.toFixed(2)}%
                  </td>
                  <td class="col-bar">
                    <div class="change-bar">
                      <div class="change-bar-center"></div>
                      <div class="change-bar-fill ${isUp ? "up" : "down"}" style="width: ${barWidth}%"></div>
                    </div>
                  </td>
                  <td class="col-news-icon">
                    ${hasNews ? `<span class="news-dot ${news.sentiment}" title="${news.title}"></span>` : ""}
                  </td>
                </tr>
              `;
            })
            .reverse()
            .join("")}
        </tbody>
      </table>
      ${truncated ? `<p class="table-note">区间过长，明细表仅展示最近 150 条；完整区间收益与最大回撤见上方「区间表现汇总」。</p>` : ""}
    `;
  }

  function updateChartInfo() {
    const infoEl = document.getElementById("chartInfo");
    if (!infoEl) return;

    const indices = state.compareMode
      ? Array.from(state.comparedFunds)
      : [state.selectedFundIndex];

    if (state.compareMode) {
      infoEl.innerHTML = `
        <div class="chart-info-item">
          <span class="chart-info-label">对比模式</span>
          <span class="chart-info-value" style="color: var(--color-accent)">${indices.length} 只基金</span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">基准</span>
          <span class="chart-info-value" style="font-size: 14px">起点 = 100</span>
        </div>
      `;
    } else {
      const fund = FUNDS[state.selectedFundIndex];
      const isUp = fund.latestChange >= 0;
      const periodClass = fund.periodReturn >= 0 ? "text-up" : "text-down";
      const w = getWindowDef(state.windowKey);
      const m = computeMetrics(getWindowSlice(fund, state.windowKey)) || {};
      const capped = isCappedWindow(fund, state.windowKey);
      const retClass = (m.cumReturn || 0) >= 0 ? "text-up" : "text-down";

      infoEl.innerHTML = `
        <div class="chart-info-item">
          <span class="chart-info-label">${fund.name} (${fund.code})</span>
          <span class="chart-info-value">${fund.latestNav.toFixed(4)}</span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">当日涨跌</span>
          <span class="chart-info-value ${isUp ? "text-up" : "text-down"}">
            ${isUp ? "+" : ""}${fund.latestChange}%
          </span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">${w.label}收益</span>
          <span class="chart-info-value ${retClass}">
            ${(m.cumReturn || 0) >= 0 ? "+" : ""}${m.cumReturn != null ? m.cumReturn.toFixed(2) : "--"}%
          </span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">${w.label}最大回撤</span>
          <span class="chart-info-value text-down">
            -${m.maxDD != null ? m.maxDD.toFixed(2) : "--"}%
          </span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">区间年化波动</span>
          <span class="chart-info-value">${m.vol != null ? m.vol.toFixed(2) : "--"}%</span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">区间最高 / 最低</span>
          <span class="chart-info-value">${m.maxNav != null ? m.maxNav.toFixed(4) : "--"} / ${m.minNav != null ? m.minNav.toFixed(4) : "--"}</span>
        </div>
        <div class="chart-info-item" style="max-width: 300px">
          <span class="chart-info-label">区间日期${capped ? "（成立不足，显示至今）" : ""}</span>
          <span style="font-size: 12px; color: var(--text-secondary)">${m.startDate || "--"} ~ ${m.endDate || "--"}（${m.count || 0} 个交易日）</span>
        </div>
        <div class="chart-info-item" style="max-width: 300px">
          <span class="chart-info-label">基金简介</span>
          <span style="font-size: 12px; color: var(--text-secondary); line-height: 1.5">${fund.description}</span>
        </div>
      `;
    }
  }

  // ============ 时间区间按钮 ============
  function applyWindow(key) {
    state.windowKey = key;
    // 同步顶部区间按钮高亮
    const btns = document.getElementById("timeframeBtns");
    if (btns) {
      btns.querySelectorAll(".tf-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.key === key);
      });
    }
    // 同步汇总表高亮
    const ws = document.getElementById("windowSummary");
    if (ws) {
      ws.querySelectorAll("tr[data-key]").forEach((tr) => {
        tr.classList.toggle("ws-active", tr.dataset.key === key);
      });
    }
    updateChart();
  }

  function initTimeframeButtons() {
    const btns = document.getElementById("timeframeBtns");
    if (!btns) return;

    btns.querySelectorAll(".tf-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyWindow(btn.dataset.key);
      });
    });

    // 汇总表行点击切换区间
    const ws = document.getElementById("windowSummary");
    if (ws) {
      ws.addEventListener("click", (e) => {
        const tr = e.target.closest("tr[data-key]");
        if (tr) applyWindow(tr.dataset.key);
      });
    }
  }

  // ============ 区间表现汇总（7 个区间：区间收益 + 最大回撤）============
  function renderWindowSummary() {
    const body = document.getElementById("windowSummary");
    if (!body) return;
    const fund = FUNDS[state.selectedFundIndex];

    let html =
      '<table class="window-summary-table"><thead><tr>' +
      "<th>区间</th><th>区间收益</th><th>最大回撤</th><th>年化波动</th><th>区间日期</th>" +
      '</tr></thead><tbody>';

    TIME_WINDOWS.forEach((w) => {
      const slice = getWindowSlice(fund, w.key);
      const m = computeMetrics(slice);
      if (!m) return;
      const retClass = m.cumReturn >= 0 ? "text-up" : "text-down";
      const capped = isCappedWindow(fund, w.key);
      const label = w.label + (capped ? " *" : "");
      html +=
        `<tr data-key="${w.key}" class="${w.key === state.windowKey ? "ws-active" : ""}">` +
        `<td class="ws-label">${label}</td>` +
        `<td class="${retClass}">${m.cumReturn >= 0 ? "+" : ""}${m.cumReturn.toFixed(2)}%</td>` +
        `<td class="text-down">-${m.maxDD.toFixed(2)}%</td>` +
        `<td>${m.vol.toFixed(2)}%</td>` +
        `<td class="ws-date">${m.startDate} ~ ${m.endDate}</td>` +
        "</tr>";
    });
    html += "</tbody></table>";
    html +=
      '<p class="ws-note">* 基金成立时间不足该区间，已显示成立至今数据。最大回撤 = 区间内净值从历史高点回落的最大幅度；年化波动 = 日收益标准差 × √252。数据来源：天天基金真实净值。</p>';
    body.innerHTML = html;
  }

  // ============ 对比模式 ============
  function initCompareToggle() {
    const toggle = document.getElementById("compareToggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      state.compareMode = !state.compareMode;
      toggle.classList.toggle("active", state.compareMode);

      if (state.compareMode) {
        // 默认选前两只
        if (state.comparedFunds.size < 2) {
          state.comparedFunds = new Set([0, 1]);
        }
      } else {
        state.comparedFunds = new Set([state.selectedFundIndex]);
      }

      updateFundSelector();
      updateChart();
    });
  }

  // ============ 新闻时间线 ============
  function renderNewsTimeline() {
    const timeline = document.getElementById("newsTimeline");
    if (!timeline) return;

    const filtered =
      state.newsCategory === "all"
        ? NEWS_EVENTS
        : NEWS_EVENTS.filter((n) => n.category === state.newsCategory);

    // 按日期降序排列：最新新闻（日期最大）置顶
    const sorted = filtered
      .slice()
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

    if (sorted.length === 0) {
      timeline.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:40px">暂无该类别新闻</p>`;
      return;
    }

    timeline.innerHTML = sorted
      .map((news, i) => {
        const impactDots = [1, 2, 3]
          .map((n) =>
            `<span class="impact-dot ${n <= (news.impactLevel === "high" ? 3 : news.impactLevel === "medium" ? 2 : 1) ? "active" : ""}"></span>`
          )
          .join("");

        const fundBadges = news.affectedFunds
          .map((code) => {
            const fund = FUNDS.find((f) => f.code === code);
            return fund ? `<span class="affected-fund">${fund.name}</span>` : "";
          })
          .join("");

        return `
          <div class="news-card sentiment-${news.sentiment} fade-in" style="animation-delay: ${i * 0.05}s">
            <div class="news-card-inner">
              <div class="news-card-header">
                <span class="news-date">${news.dateCN}</span>
                <span class="news-category ${news.category}">${news.category}</span>
                <span class="news-sentiment-badge ${news.sentiment}">
                  ${news.sentiment === "positive" ? "利多" : news.sentiment === "negative" ? "利空" : "中性"}
                </span>
              </div>
              <h3 class="news-title">${news.title}</h3>
              <p class="news-impact">${news.impact}</p>
              <div class="news-source">📌 可核实来源：${news.source || "公开宏观数据库"}</div>
              <div class="news-footer">
                <div class="news-tags">
                  ${news.tags.map((t) => `<span class="news-tag">#${t}</span>`).join("")}
                </div>
                <div class="news-affected">
                  <span class="impact-level-bar" title="影响等级">${impactDots}</span>
                  ${fundBadges}
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ============ 新闻筛选 ============
  function initNewsFilters() {
    const filters = document.getElementById("newsFilters");
    if (!filters) return;

    filters.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.newsCategory = btn.dataset.category;
        renderNewsTimeline();
      });
    });
  }

  // ============ 导航交互 ============
  function initNav() {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    // 平滑滚动
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // 滚动监听 - 高亮当前section
    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });

      links.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });

    // 移动端菜单
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (toggle) {
      toggle.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");
      });
    }
  }

  // ============ 返回顶部 ============
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============ 工具函数 ============
  function hexToRgba(hex, alpha) {
    if (typeof hex !== "string" || hex.length < 7) {
      return `rgba(0, 214, 143, ${alpha})`;
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) {
      return `rgba(0, 214, 143, ${alpha})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // 窗口大小变化时重绘 sparklines
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      FUNDS.forEach((fund, i) => {
        drawSparkline(`spark-${i}`, fund.data);
      });
    }, 200);
  });
})();
