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
    chartRange: 30,
    compareMode: false,
    comparedFunds: new Set([0]),
    newsCategory: "all",
    mainChart: null,
    barChart: null,
    sparkCharts: [],
  };

  // ============ DOM Ready ============
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    renderIndices();
    renderSentiment();
    renderFundCards();
    renderFundSelector();
    renderMainChart();
    renderBarChart();
    renderDailyTable();
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
          <span class="fund-chip-dot" style="background: ${colors[i]}"></span>
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

    // 获取日期标签（基于第一个基金）
    const firstFund = FUNDS[indices[0]];
    const data = firstFund.data.slice(-state.chartRange);
    const labels = data.map((d) => d.dateCN);

    const datasets = indices.map((fundIdx, i) => {
      const fund = FUNDS[fundIdx];
      const fundData = fund.data.slice(-state.chartRange);
      const color = colors[fundIdx];

      // 归一化净值（对比模式下以起点为100）
      const baseNav = fundData[0].nav;
      const navValues = state.compareMode
        ? fundData.map((d) => ((d.nav / baseNav) * 100).toFixed(2))
        : fundData.map((d) => d.nav);

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

    state.mainChart.data = getChartData();
    state.mainChart.options = getChartOptions();
    state.mainChart.update("active");

    updateChartInfo();
    updateBarChart();
    renderDailyTable();
    updateBarAndTableVisibility();
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
    const data = fund.data.slice(-state.chartRange);
    const labels = data.map((d) => d.dateCN);
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
    state.barChart.data = getBarChartData();
    state.barChart.options = getBarChartOptions();
    state.barChart.update("active");
  }

  function updateBarAndTableVisibility() {
    const barSection = document.getElementById("barChartSection");
    const tableSection = document.getElementById("dailyTableSection");

    if (state.compareMode) {
      barSection?.classList.add("hidden");
      tableSection?.classList.add("hidden");
    } else {
      barSection?.classList.remove("hidden");
      tableSection?.classList.remove("hidden");
    }
  }

  // ============ 每日明细数据表 ============
  function renderDailyTable() {
    const wrap = document.getElementById("dailyTableWrap");
    if (!wrap) return;

    const fund = FUNDS[state.selectedFundIndex];
    const data = fund.data.slice(-state.chartRange);

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
          <span class="chart-info-label">30日收益</span>
          <span class="chart-info-value ${periodClass}">
            ${fund.periodReturn >= 0 ? "+" : ""}${fund.periodReturn}%
          </span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">区间最高</span>
          <span class="chart-info-value">${fund.maxNav.toFixed(4)}</span>
        </div>
        <div class="chart-info-item">
          <span class="chart-info-label">区间最低</span>
          <span class="chart-info-value">${fund.minNav.toFixed(4)}</span>
        </div>
        <div class="chart-info-item" style="max-width: 300px">
          <span class="chart-info-label">基金简介</span>
          <span style="font-size: 12px; color: var(--text-secondary); line-height: 1.5">${fund.description}</span>
        </div>
      `;
    }
  }

  // ============ 时间范围按钮 ============
  function initTimeframeButtons() {
    const btns = document.getElementById("timeframeBtns");
    if (!btns) return;

    btns.querySelectorAll(".tf-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.querySelectorAll(".tf-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.chartRange = parseInt(btn.dataset.range);
        updateChart();
      });
    });
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

    if (filtered.length === 0) {
      timeline.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:40px">暂无该类别新闻</p>`;
      return;
    }

    timeline.innerHTML = filtered
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
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
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
