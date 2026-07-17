/* ============ 指数温度卡片数据（配合图片中的信息图形式）============
 * 说明：指数点位与涨跌幅由 app.js 在渲染时从 MARKET_SNAPSHOT 动态回填；
 *       VIX 从 MARKET_SENTIMENT 回填；
 *       PE、远期PE、历史分位、跌幅参考值为示例数据，已明确标注，待接入真实估值数据源。
 */
window.INDEX_TEMPERATURE = {
  date: "2026-07-17",
  source: "指数点位/涨跌来自 neodata 真实行情；VIX 来自 CNN；PE、远期PE、历史分位、跌幅参考值为示例数据，待接入真实估值数据源",
  items: [
    {
      key: "vix",
      title: "VIX 恐慌指数",
      subtitle: "反映美股未来30天市场恐慌 / 贪婪程度",
      value: null,
      change: null,
      valueSource: "CNN",
      updateTime: "2026-07-18",
      type: "vix",
      scale: [
        { max: 15, label: "<15", text: "平静乐观", emoji: "😌", color: "#00d68f" },
        { max: 20, label: "15-20", text: "中性", emoji: "😐", color: "#c7d64e" },
        { max: 30, label: ">20", text: "开始紧张", emoji: "😟", color: "#ffc839" },
        { max: 40, label: ">30", text: "剧烈波动", emoji: "😰", color: "#ff8c42" },
        { max: 60, label: ">40", text: "罕见恐慌", emoji: "😱", color: "#ff5252" },
        { max: Infinity, label: ">60", text: "吓到腿软", emoji: "😵", color: "#c91d1d" }
      ],
      explain: "VIX 越高：市场越恐慌；VIX 越低：市场越乐观（越谨慎自满）。",
      historyNote: "历史极端：2008 收盘 80.86 / 2020 收盘 82.69"
    },
    {
      key: "ndx",
      title: "纳斯达克100",
      subtitle: "指数温度",
      pe: 37.17,
      forwardPe: 22.92,
      pePercentile10Y: 50,
      value: null,
      change: null,
      valueSource: "neodata",
      updateTime: "2026-07-17",
      type: "index",
      percentiles: { "1y": 61, "5y": 80, "10y": 82 },
      drawdown: { current: -3.36, status: "震荡突破中", last: -12.70, lastRange: "26.1-26.3" },
      note: "PE、远期PE、历史分位、跌幅参考值为示例数据，待接入真实估值数据源"
    },
    {
      key: "spx",
      title: "标普500",
      subtitle: "指数温度",
      pe: 28.64,
      forwardPe: 21.09,
      pePercentile10Y: 65.8,
      value: null,
      change: null,
      valueSource: "neodata",
      updateTime: "2026-07-17",
      type: "index",
      percentiles: { "1y": 29, "5y": 80, "10y": 80 },
      drawdown: { current: -1.01, status: "震荡突破中", last: -9.80, lastRange: "26.1-26.3" },
      note: "PE、远期PE、历史分位、跌幅参考值为示例数据，待接入真实估值数据源"
    }
  ]
};
