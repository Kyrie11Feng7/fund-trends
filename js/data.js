/**
 * 基金趋势分析网站 - 数据层
 * 包含：基金NAV数据、世界新闻事件分析、全球指数概览
 * 数据为基于真实市场走势特征的模拟数据，仅供演示
 */

// ============ 工具函数 ============

/**
 * 种子伪随机数生成器 (LCG算法)
 * 确保每次加载生成相同的数据
 */
function createRNG(seed) {
  let s = seed;
  return function () {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * 获取指定数量的交易日（跳过周末）
 */
function getTradingDays(startDateStr, count) {
  const days = [];
  const d = new Date(startDateStr);
  while (days.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 格式化日期为中文短格式 MM月DD日
 */
function formatDateCN(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}月${day}日`;
}

/**
 * 生成基金NAV数据
 * @param {Object} config - 配置参数
 * @param {number} config.startNav - 起始净值
 * @param {number} config.days - 交易日天数
 * @param {number} config.volatility - 日波动率
 * @param {number} config.trendBias - 趋势偏移（正=上涨趋势）
 * @param {number} config.seed - 随机种子
 * @param {Array} config.events - 事件冲击列表 [{date, shock}]
 * @param {number} config.eventFactor - 事件冲击系数（1=完全跟随，0=不跟随）
 */
function generateFundData(config) {
  const { startNav, days, volatility, trendBias, seed, events, eventFactor = 1 } = config;
  const rng = createRNG(seed);
  const tradingDays = getTradingDays("2026-06-03", days);

  let nav = startNav;
  return tradingDays.map((date, i) => {
    let dailyChange = (rng() - 0.5 + trendBias) * volatility;

    // 应用事件冲击
    const dateStr = formatDate(date);
    if (events) {
      const event = events.find((e) => e.date === dateStr);
      if (event) {
        dailyChange += event.shock * eventFactor;
      }
    }

    nav = nav * (1 + dailyChange);

    return {
      date: dateStr,
      dateCN: formatDateCN(date),
      nav: parseFloat(nav.toFixed(4)),
      change: parseFloat((dailyChange * 100).toFixed(2)),
    };
  });
}

// ============ 事件冲击定义 ============
// 日期 -> 对科技基金的冲击（正数=利好，负数=利空）

const MARKET_EVENTS_SHOCKS = [
  { date: "2026-06-04", shock: 0.018, label: "美联储维持利率不变" },
  { date: "2026-06-06", shock: 0.025, label: "英伟达市值破3万亿" },
  { date: "2026-06-09", shock: -0.015, label: "非农数据强劲" },
  { date: "2026-06-12", shock: 0.020, label: "CPI低于预期" },
  { date: "2026-06-16", shock: 0.012, label: "欧央行降息25bp" },
  { date: "2026-06-18", shock: 0.030, label: "黄仁勋发布Blackwell芯片" },
  { date: "2026-06-20", shock: -0.022, label: "中东地缘冲突升级" },
  { date: "2026-06-24", shock: 0.015, label: "苹果发布Apple Intelligence" },
  { date: "2026-06-26", shock: -0.028, label: "美国收紧芯片出口管制" },
  { date: "2026-07-02", shock: -0.018, label: "ISM制造业PMI低于荣枯线" },
  { date: "2026-07-07", shock: 0.022, label: "非农不及预期，降息预期重燃" },
  { date: "2026-07-09", shock: 0.010, label: "科技股财报季开启" },
  { date: "2026-07-11", shock: 0.028, label: "6月CPI超预期回落" },
  { date: "2026-07-15", shock: -0.020, label: "全球避险情绪升温" },
];

// 基金类型分组与事件敏感度系数
const EVENT_FACTOR = {
  nasdaq100: 1.0,      // 纯纳斯达克100，完全跟随
  usTech: 0.95,        // 美股科技主题
  globalTech: 0.75,    // 全球科技配置
  emergingMarket: 0.7,  // 新兴市场
  chinaTech: 0.6,      // 中国科技/半导体
  newEnergy: 0.55,     // 新能源车
  asiaPacific: 0.65,   // 亚太/亚洲机会
  mixed: 0.5,          // 混合配置
};

// 生成带敏感度的事件冲击列表
function getEvents(type) {
  const factor = EVENT_FACTOR[type] || 0.7;
  return MARKET_EVENTS_SHOCKS.map((e) => ({ ...e, shock: e.shock * factor }));
}

// ============ 基金数据 ============

const FUNDS = [
  {
    code: "513100",
    name: "纳斯达克100 ETF",
    enName: "NASDAQ-100 ETF",
    type: "指数型",
    manager: "国泰基金",
    trackIndex: "纳斯达克100指数",
    inception: "2013-04-25",
    description:
      "紧密跟踪纳斯达克100指数，涵盖苹果、微软、英伟达、亚马逊、Meta等全球顶尖科技巨头，是投资美国科技行业的核心标的。",
    data: generateFundData({
      startNav: 1.6520,
      days: 30,
      volatility: 0.015,
      trendBias: 0.025,
      seed: 42,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 1.0,
    }),
  },
  {
    code: "241002",
    name: "华宝纳斯达克精选",
    enName: "HWABAO NASDAQ Select",
    type: "QDII股票型",
    manager: "华宝基金",
    trackIndex: "纳斯达克100指数",
    inception: "2020-03-20",
    description:
      "华宝基金旗下纳斯达克100主题基金，聚焦美股科技龙头，重仓人工智能、云计算、半导体等前沿科技领域。",
    data: generateFundData({
      startNav: 1.4280,
      days: 30,
      volatility: 0.015,
      trendBias: 0.024,
      seed: 101,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.95,
    }),
  },
  {
    code: "006555",
    name: "浦银安盛全球智能科技",
    enName: "PSBC-SPDB Global Smart Tech",
    type: "QDII股票型",
    manager: "浦银安盛基金",
    trackIndex: "MSCI全球信息科技指数",
    inception: "2018-07-19",
    description:
      "全球智能科技主题基金，重点配置人工智能、机器人、自动驾驶、半导体设备等全球科技产业链核心环节。",
    data: generateFundData({
      startNav: 1.7350,
      days: 30,
      volatility: 0.017,
      trendBias: 0.020,
      seed: 102,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.85,
    }),
  },
  {
    code: "270028",
    name: "广发全球精选股票",
    enName: "GF Global Select",
    type: "股票型",
    manager: "广发基金",
    trackIndex: "MSCI全球指数",
    inception: "2010-08-18",
    description:
      "全球配置型基金，跨市场投资美股科技、欧洲奢侈品、日本制造业及新兴市场消费，分散单一市场风险。",
    data: generateFundData({
      startNav: 2.1450,
      days: 30,
      volatility: 0.011,
      trendBias: 0.020,
      seed: 314,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.5,
    }),
  },
  {
    code: "006542",
    name: "嘉实全球产业升级",
    enName: "Harvest Global Industry Upgrade",
    type: "QDII股票型",
    manager: "嘉实基金",
    trackIndex: "MSCI全球指数",
    inception: "2018-11-02",
    description:
      "聚焦全球产业升级主题，重点配置新能源、半导体、工业自动化、数字化服务等领域的全球龙头公司。",
    data: generateFundData({
      startNav: 1.5620,
      days: 30,
      volatility: 0.014,
      trendBias: 0.018,
      seed: 103,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.6,
    }),
  },
  {
    code: "000043",
    name: "嘉实美国成长",
    enName: "Harvest US Growth",
    type: "QDII股票型",
    manager: "嘉实基金",
    trackIndex: "罗素1000成长指数",
    inception: "2013-06-14",
    description:
      "主要投资于美国大盘成长型股票，重点配置科技、医疗、消费服务等成长性行业，代表美国新经济成长方向。",
    data: generateFundData({
      startNav: 2.3840,
      days: 30,
      volatility: 0.014,
      trendBias: 0.022,
      seed: 104,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.9,
    }),
  },
  {
    code: "161128",
    name: "易方达标普信息科技",
    enName: "E Fund S&P Info Tech",
    type: "指数型",
    manager: "易方达基金",
    trackIndex: "标普500信息技术指数",
    inception: "2016-12-03",
    description:
      "紧密跟踪标普500信息技术指数，涵盖苹果、微软、英伟达、博通等美国信息技术板块核心公司，科技纯度极高。",
    data: generateFundData({
      startNav: 1.9560,
      days: 30,
      volatility: 0.015,
      trendBias: 0.026,
      seed: 105,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.95,
    }),
  },
  {
    code: "161130",
    name: "易方达纳斯达克100",
    enName: "E Fund NASDAQ-100",
    type: "指数型",
    manager: "易方达基金",
    trackIndex: "纳斯达克100指数",
    inception: "2016-11-23",
    description:
      "易方达旗下纳斯达克100指数基金，LOF结构支持场内交易，费率较低，适合长期定投美国科技板块。",
    data: generateFundData({
      startNav: 1.8730,
      days: 30,
      volatility: 0.014,
      trendBias: 0.024,
      seed: 256,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 1.0,
    }),
  },
  {
    code: "012049",
    name: "易方达全球成长精选",
    enName: "E Fund Global Growth Select",
    type: "QDII股票型",
    manager: "易方达基金",
    trackIndex: "MSCI全球成长指数",
    inception: "2021-04-28",
    description:
      "全球成长风格基金，精选全球范围内具有长期成长潜力的优质公司，重点配置美股科技、医药及新兴市场消费。",
    data: generateFundData({
      startNav: 1.2680,
      days: 30,
      volatility: 0.015,
      trendBias: 0.019,
      seed: 106,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.75,
    }),
  },
  {
    code: "006373",
    name: "国富全球科技",
    enName: "Franklin Templeton Global Tech",
    type: "QDII股票型",
    manager: "国海富兰克林基金",
    trackIndex: "MSCI全球信息科技指数",
    inception: "2018-09-05",
    description:
      "专注全球科技板块投资，覆盖美国软件、半导体、互联网及亚洲电子制造产业链，强调科技龙头的长期成长。",
    data: generateFundData({
      startNav: 1.6450,
      days: 30,
      volatility: 0.016,
      trendBias: 0.021,
      seed: 107,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.85,
    }),
  },
  {
    code: "165601",
    name: "建信新兴市场混合",
    enName: "Jianxin Emerging Market",
    type: "混合型",
    manager: "建信基金",
    trackIndex: "MSCI新兴市场指数",
    inception: "2011-08-02",
    description:
      "聚焦新兴市场科技与消费龙头，重点配置中国台湾半导体、韩国电子、印度IT服务及东南亚互联网企业。",
    data: generateFundData({
      startNav: 1.2850,
      days: 30,
      volatility: 0.013,
      trendBias: 0.018,
      seed: 137,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.7,
    }),
  },
  {
    code: "001668",
    name: "汇添富全球移动互联",
    enName: "China Universal Global Mobile Internet",
    type: "QDII股票型",
    manager: "汇添富基金",
    trackIndex: "中证海外中国互联网指数",
    inception: "2015-12-27",
    description:
      "全球移动互联网主题基金，重点配置中美互联网、平台经济、移动支付、云计算等数字经济核心资产。",
    data: generateFundData({
      startNav: 1.5120,
      days: 30,
      volatility: 0.018,
      trendBias: 0.017,
      seed: 108,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.7,
    }),
  },
  {
    code: "012198",
    name: "华夏全球科技先锋",
    enName: "ChinaAMC Global Tech Pioneer",
    type: "QDII股票型",
    manager: "华夏基金",
    trackIndex: "MSCI全球信息科技指数",
    inception: "2021-03-15",
    description:
      "聚焦全球科技产业先锋企业，重点布局人工智能、半导体、云计算、新能源科技等前沿赛道，兼顾中美欧科技龙头。",
    data: generateFundData({
      startNav: 1.0980,
      days: 30,
      volatility: 0.017,
      trendBias: 0.019,
      seed: 109,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.85,
    }),
  },
  {
    code: "002396",
    name: "华夏移动互联",
    enName: "ChinaAMC Mobile Internet",
    type: "股票型",
    manager: "华夏基金",
    trackIndex: "中证TMT产业主题指数",
    inception: "2016-01-27",
    description:
      "A股移动互联网主题基金，重点配置通信、电子、计算机、传媒等TMT板块，聚焦中国数字经济产业链。",
    data: generateFundData({
      startNav: 1.7340,
      days: 30,
      volatility: 0.019,
      trendBias: 0.014,
      seed: 110,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.55,
    }),
  },
  {
    code: "015820",
    name: "银华海外数字经济",
    enName: "YinHua Overseas Digital Economy",
    type: "QDII股票型",
    manager: "银华基金",
    trackIndex: "MSCI全球信息科技指数",
    inception: "2022-05-12",
    description:
      "海外数字经济主题基金，重点配置美股科技巨头及全球数字基础设施、平台经济、人工智能应用产业链。",
    data: generateFundData({
      startNav: 0.9820,
      days: 30,
      volatility: 0.017,
      trendBias: 0.018,
      seed: 111,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.85,
    }),
  },
  {
    code: "501008",
    name: "长城全球新能源车",
    enName: "Great Wall Global NEV",
    type: "QDII股票型",
    manager: "长城基金",
    trackIndex: "MSCI全球新能源车指数",
    inception: "2019-08-21",
    description:
      "全球新能源汽车产业链主题基金，覆盖整车制造、动力电池、电机电控、上游锂矿等新能源车全产业链。",
    data: generateFundData({
      startNav: 1.1250,
      days: 30,
      volatility: 0.020,
      trendBias: 0.012,
      seed: 112,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.55,
    }),
  },
  {
    code: "016660",
    name: "华宝海外新能源汽车",
    enName: "HWABAO Overseas NEV",
    type: "QDII股票型",
    manager: "华宝基金",
    trackIndex: "MSCI全球新能源车指数",
    inception: "2022-09-14",
    description:
      "海外新能源汽车主题基金，重点配置特斯拉、比亚迪、蔚来、小鹏、理想等全球新能源整车及零部件龙头。",
    data: generateFundData({
      startNav: 0.8450,
      days: 30,
      volatility: 0.021,
      trendBias: 0.011,
      seed: 113,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.55,
    }),
  },
  {
    code: "017145",
    name: "华宝海外科技",
    enName: "HWABAO Overseas Tech",
    type: "QDII股票型",
    manager: "华宝基金",
    trackIndex: "纳斯达克100指数",
    inception: "2022-11-08",
    description:
      "海外科技主题基金，重点配置美股科技龙头及全球创新型企业，聚焦人工智能、半导体、云计算等硬科技方向。",
    data: generateFundData({
      startNav: 0.9120,
      days: 30,
      volatility: 0.016,
      trendBias: 0.020,
      seed: 114,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.9,
    }),
  },
  {
    code: "008162",
    name: "华宝致远混合",
    enName: "HWABAO Zhiyuan Mixed",
    type: "混合型",
    manager: "华宝基金",
    trackIndex: "沪深300指数",
    inception: "2019-09-16",
    description:
      "平衡配置型混合基金，股债动态调整，权益部分重点配置科技成长、高端制造及消费服务领域的优质企业。",
    data: generateFundData({
      startNav: 1.3560,
      days: 30,
      volatility: 0.012,
      trendBias: 0.015,
      seed: 115,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.45,
    }),
  },
  {
    code: "017093",
    name: "景顺长城纳斯达克科技",
    enName: "Invesco Great Wall NASDAQ Tech",
    type: "指数型",
    manager: "景顺长城基金",
    trackIndex: "纳斯达克科技市值加权指数",
    inception: "2023-01-17",
    description:
      "跟踪纳斯达克科技市值加权指数，成份股为纳斯达克100中的科技类公司，科技纯度高于普通纳斯达克100指数。",
    data: generateFundData({
      startNav: 1.0880,
      days: 30,
      volatility: 0.016,
      trendBias: 0.025,
      seed: 116,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.95,
    }),
  },
  {
    code: "012026",
    name: "天弘全球高端制造",
    enName: "Tianhong Global High-End Manufacturing",
    type: "QDII股票型",
    manager: "天弘基金",
    trackIndex: "MSCI全球工业指数",
    inception: "2021-06-08",
    description:
      "全球高端制造主题基金，重点配置工业自动化、航空航天、精密仪器、半导体设备、机器人等先进制造领域。",
    data: generateFundData({
      startNav: 1.0230,
      days: 30,
      volatility: 0.018,
      trendBias: 0.013,
      seed: 117,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.5,
    }),
  },
  {
    code: "006751",
    name: "富国全球科技互联网",
    enName: "Fullgoal Global Tech Internet",
    type: "QDII股票型",
    manager: "富国基金",
    trackIndex: "中证海外中国互联网指数",
    inception: "2018-12-25",
    description:
      "全球科技互联网主题基金，重点配置中美互联网巨头、云计算平台、电商、游戏及社交媒体等数字资产。",
    data: generateFundData({
      startNav: 1.4620,
      days: 30,
      volatility: 0.019,
      trendBias: 0.016,
      seed: 118,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.7,
    }),
  },
  {
    code: "457001",
    name: "国富亚洲机会",
    enName: "Franklin Templeton Asia Opportunities",
    type: "QDII股票型",
    manager: "国海富兰克林基金",
    trackIndex: "MSCI亚太除日本指数",
    inception: "2012-02-28",
    description:
      "亚洲（除日本）投资机会基金，重点配置中国、印度、韩国、东南亚等亚洲市场的科技与消费龙头企业。",
    data: generateFundData({
      startNav: 1.1780,
      days: 30,
      volatility: 0.014,
      trendBias: 0.016,
      seed: 119,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.65,
    }),
  },
  // A股科创类基金（原华夏科技创新、富国科技创新已替换为更聚焦的21只图片基金，
  // 为保持多样性，保留两只作为A股科技补充）
  {
    code: "007349",
    name: "华夏科技创新A",
    enName: "ChinaAMC Tech Innovation A",
    type: "股票型",
    manager: "华夏基金",
    trackIndex: "中证科技创新指数",
    inception: "2019-06-11",
    description:
      "聚焦A股科创板及创业板科技创新企业，重仓半导体、人工智能、新能源、生物医药等硬科技赛道。",
    data: generateFundData({
      startNav: 1.6420,
      days: 30,
      volatility: 0.018,
      trendBias: 0.015,
      seed: 789,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.6,
    }),
  },
  {
    code: "007339",
    name: "富国科技创新A",
    enName: "Fullgoal Tech Innovation A",
    type: "股票型",
    manager: "富国基金",
    trackIndex: "中证科技创新指数",
    inception: "2019-06-11",
    description:
      "深度挖掘中国科技创新企业投资机会，重点关注半导体自主可控、AI大模型应用、机器人及商业航天等前沿领域。",
    data: generateFundData({
      startNav: 1.3850,
      days: 30,
      volatility: 0.019,
      trendBias: 0.016,
      seed: 555,
      events: MARKET_EVENTS_SHOCKS,
      eventFactor: 0.65,
    }),
  },
];

// ============ 计算基金统计数据 ============

FUNDS.forEach((fund) => {
  const data = fund.data;
  const latest = data[data.length - 1];
  const first = data[0];
  fund.latestNav = latest.nav;
  fund.latestDate = latest.date;
  fund.latestChange = latest.change;
  fund.periodReturn = parseFloat(
    (((latest.nav - first.nav) / first.nav) * 100).toFixed(2)
  );
  fund.maxNav = Math.max(...data.map((d) => d.nav));
  fund.minNav = Math.min(...data.map((d) => d.nav));
  fund.avgChange = parseFloat(
    (data.reduce((s, d) => s + d.change, 0) / data.length).toFixed(2)
  );
});

// ============ 世界新闻事件分析 ============

const NEWS_EVENTS = [
  {
    date: "2026-06-04",
    dateCN: "06月04日",
    title: "美联储6月议息会议维持利率不变，鲍威尔暗示年内或降息1-2次",
    category: "货币政策",
    sentiment: "positive",
    impact:
      "美联储维持联邦基金利率在4.75%-5.00%区间不变，符合市场预期。鲍威尔在新闻发布会上表示\"通胀正在回到2%目标的路径上\"，点阵图显示年内可能降息1-2次。利率期货市场定价9月降息概率升至72%。科技成长股对利率高度敏感，降息预期升温直接推高纳斯达克100 ETF估值，当日纳斯达克100 ETF上涨约1.8%。建信新兴市场也受益于美元走弱预期，资金回流新兴市场。",
    affectedFunds: ["513100", "161130", "241002", "165601", "017093", "161128"],
    impactLevel: "high",
    tags: ["美联储", "利率决议", "降息预期"],
  },
  {
    date: "2026-06-06",
    dateCN: "06月06日",
    title: "英伟达市值突破3万亿美元，超越苹果成为全球第二大公司",
    category: "科技产业",
    sentiment: "positive",
    impact:
      "英伟达 (NVDA) 股价再创新高，市值突破3万亿美元大关，超越苹果成为美股市值第二大公司，仅次于微软。黄仁勋表示\"AI革命才刚刚开始\"，数据中心业务需求远超预期。作为纳斯达克100指数第二大权重股（权重约8.5%），英伟达的强势表现直接拉动指数上行。易方达纳斯达克100、华宝纳斯达克精选、景顺长城纳斯达克科技等纳斯达克主题基金当日涨幅均超2.5%。",
    affectedFunds: ["513100", "161130", "241002", "017093", "006555", "012198"],
    impactLevel: "high",
    tags: ["英伟达", "AI", "纳斯达克"],
  },
  {
    date: "2026-06-09",
    dateCN: "06月09日",
    title: "美国5月非农就业新增27.2万人远超预期，降息预期降温",
    category: "经济数据",
    sentiment: "negative",
    impact:
      "美国劳工部公布5月非农就业人口新增27.2万，远超市场预期的18.5万。平均时薪同比上涨4.1%，显示劳动力市场依然强劲。强劲的就业数据意味着通胀压力仍在，美联储降息的紧迫性降低。CME FedWatch显示9月降息概率从72%回落至55%。科技股普遍回调，纳斯达克100 ETF下跌约1.5%。市场担忧\"Higher for Longer\"利率环境对成长股估值的压制。",
    affectedFunds: ["513100", "161130", "241002", "270028", "012049", "017093"],
    impactLevel: "medium",
    tags: ["非农就业", "通胀", "降息预期"],
  },
  {
    date: "2026-06-12",
    dateCN: "06月12日",
    title: "美国5月CPI同比上涨3.3%低于预期，通胀降温信号明确",
    category: "经济数据",
    sentiment: "positive",
    impact:
      "美国5月CPI同比上涨3.3%，低于市场预期的3.4%，核心CPI环比仅上涨0.2%，为2021年以来最小涨幅。服务业通胀出现明显放缓迹象，住房成本增速回落。数据公布后，美债收益率大幅下行，2年期美债收益率跌至4.73%。科技股迎来强劲反弹，纳斯达克100 ETF上涨约2.0%。广发全球精选、易方达全球成长精选等跨市场配置基金也全面受益，全球风险偏好显著回升。",
    affectedFunds: ["513100", "161130", "241002", "270028", "165601", "012049", "017093"],
    impactLevel: "high",
    tags: ["CPI", "通胀降温", "美债收益率"],
  },
  {
    date: "2026-06-16",
    dateCN: "06月16日",
    title: "欧央行宣布降息25个基点，为2019年以来首次降息",
    category: "货币政策",
    sentiment: "positive",
    impact:
      "欧洲央行将三大关键利率各下调25个基点，主要再融资利率降至4.25%，为2019年9月以来首次降息。欧央行同时上调了2024-2026年通胀预期，拉加德表示\"不会预先承诺特定利率路径\"。欧元区降息改善了全球流动性预期，欧洲科技股和新兴市场资产均获资金流入。建信新兴市场优选、国富亚洲机会受益于全球宽松周期开启的预期，广发全球精选中欧洲科技配置部分也获正向贡献。",
    affectedFunds: ["165601", "270028", "457001", "006542"],
    impactLevel: "medium",
    tags: ["欧央行", "降息", "全球流动性"],
  },
  {
    date: "2026-06-18",
    dateCN: "06月18日",
    title: "黄仁勋在Computex发布新一代Blackwell架构GPU",
    category: "科技产业",
    sentiment: "positive",
    impact:
      "英伟达在台北国际电脑展(Computex)上正式发布基于Blackwell架构的B200 GPU，算力较前代Hopper架构提升2.5倍，能效提升5倍。黄仁勋宣布\"我们正在进入一个新的工业革命时代\"。谷歌、微软、Meta、亚马逊等科技巨头已下单采购。Blackwell平台的发布强化了英伟达在AI算力领域的绝对领先地位，AI产业链情绪高涨。纳斯达克100 ETF、华宝海外科技、景顺长城纳斯达克科技当日大涨3.0%，创近月最大单日涨幅。",
    affectedFunds: ["513100", "161130", "241002", "017093", "017145", "006555", "012198", "006373"],
    impactLevel: "high",
    tags: ["英伟达", "Blackwell", "AI算力", "半导体"],
  },
  {
    date: "2026-06-20",
    dateCN: "06月20日",
    title: "中东地缘冲突升级，国际原油价格单日飙升5%",
    category: "地缘政治",
    sentiment: "negative",
    impact:
      "中东地区紧张局势骤然升级，布伦特原油期货单日上涨5%至每桶88美元。地缘风险溢价快速上升，全球避险情绪蔓延。投资者从风险资产撤出，涌入黄金和美债等避险资产。科技股遭抛售，纳斯达克100 ETF下跌约2.2%。华夏全球科技先锋、浦银安盛全球智能科技等全球科技基金也受风险偏好下降拖累。建信新兴市场中中东配置部分面临直接冲击。",
    affectedFunds: ["513100", "165601", "006555", "012198", "457001", "006373"],
    impactLevel: "high",
    tags: ["中东", "地缘冲突", "原油", "避险情绪"],
  },
  {
    date: "2026-06-24",
    dateCN: "06月24日",
    title: "苹果WWDC发布Apple Intelligence，AI战略全面升级",
    category: "科技产业",
    sentiment: "positive",
    impact:
      "苹果在WWDC 2026上发布Apple Intelligence AI平台，深度融合ChatGPT-4o，Siri获得革命性升级。新平台将AI能力嵌入iOS、iPadOS和macOS全系生态，覆盖超20亿台活跃设备。市场重新评估苹果的AI战略定位，此前市场担忧苹果在AI领域落后。苹果股价盘后大涨超5%，作为纳斯达克100第三大权重股，直接推升指数。广发全球精选、易方达全球成长精选中苹果配置获显著正贡献。",
    affectedFunds: ["513100", "270028", "161130", "241002", "012049", "017093"],
    impactLevel: "medium",
    tags: ["苹果", "Apple Intelligence", "AI应用"],
  },
  {
    date: "2026-06-26",
    dateCN: "06月26日",
    title: "美国进一步收紧对华芯片出口管制，先进制程设备受限",
    category: "监管政策",
    sentiment: "negative",
    impact:
      "美国商务部工业和安全局(BIS)发布新规，进一步限制向中国出口先进制程半导体制造设备，包括EUV光刻机及部分DUV设备。同时新增31家中国实体至\"实体清单\"。半导体板块首当其冲，华夏科技创新和富国科技创新中半导体配置占比超25%，受冲击最大。华夏移动互联、长城全球新能源车等A股科技主题基金也受情绪拖累。不过部分市场参与者认为制裁将加速国产替代进程，长期利好国产设备厂商。",
    affectedFunds: ["007349", "007339", "002396", "501008", "016660"],
    impactLevel: "high",
    tags: ["芯片管制", "半导体", "出口限制", "国产替代"],
  },
  {
    date: "2026-07-02",
    dateCN: "07月02日",
    title: "美国6月ISM制造业PMI降至48.5，连续三个月低于荣枯线",
    category: "经济数据",
    sentiment: "negative",
    impact:
      "美国6月ISM制造业PMI为48.5，低于预期的49.0，连续第三个月处于收缩区间。新订单分项指数降至47.0，显示制造业需求持续疲软。但就业分项略有改善。制造业持续萎缩引发市场对美国经济动能的担忧，科技股中工业软件和半导体设备板块承压。天弘全球高端制造、浦银安盛全球智能科技中工业自动化相关配置受冲击。不过部分投资者认为经济放缓将促使美联储更快降息，因此对利率敏感的科技成长股跌幅有限。",
    affectedFunds: ["513100", "161130", "241002", "006555", "012026", "017093"],
    impactLevel: "medium",
    tags: ["ISM", "制造业PMI", "经济放缓"],
  },
  {
    date: "2026-07-07",
    dateCN: "07月07日",
    title: "美国6月非农就业新增18.7万不及预期，9月降息预期重燃",
    category: "经济数据",
    sentiment: "positive",
    impact:
      "美国6月非农就业人口新增18.7万，低于预期的20万，前值大幅下修至21.8万。失业率小幅升至4.1%。就业市场降温迹象明显，市场重新定价美联储降息路径。CME FedWatch显示9月降息25bp的概率从55%升至78%，12月降息2次的概率升至65%。科技成长股对降息预期高度敏感，纳斯达克100 ETF、华宝纳斯达克精选、景顺长城纳斯达克科技大涨2.2%。建信新兴市场也受益于美元走弱预期，新兴市场资金流入加速。",
    affectedFunds: ["513100", "161130", "241002", "165601", "017093", "006555"],
    impactLevel: "high",
    tags: ["非农就业", "降息预期", "就业降温"],
  },
  {
    date: "2026-07-09",
    dateCN: "07月09日",
    title: "美股科技股财报季正式开启，市场聚焦AI变现能力",
    category: "科技产业",
    sentiment: "positive",
    impact:
      "随着佩普西科率先发布财报，美股Q2财报季正式拉开帷幕。市场重点关注即将公布的科技巨头财报，尤其是英伟达、微软、谷歌的AI相关收入增速。分析师预计标普500科技板块Q2盈利同比增长17.5%，其中AI相关收入增速或超40%。纳斯达克100指数成分股中已有超过60%的公司发布正面业绩指引。市场情绪偏乐观，全球科技基金小幅上涨。广发全球精选、建信新兴市场也受益于全球科技板块的正面预期。",
    affectedFunds: ["513100", "270028", "165601", "006373", "012198", "015820"],
    impactLevel: "low",
    tags: ["财报季", "AI变现", "科技巨头"],
  },
  {
    date: "2026-07-11",
    dateCN: "07月11日",
    title: "美国6月CPI同比降至2.9%，首次跌破3%关口",
    category: "经济数据",
    sentiment: "positive",
    impact:
      "美国6月CPI同比上涨2.9%，为2021年3月以来首次低于3%，低于市场预期的3.1%。核心CPI环比上涨0.1%，服务业和商品通胀全面放缓。数据公布后，2年期美债收益率暴跌15bp至4.58%，美元指数大跌1.2%。市场对9月降息的概率定价升至90%以上。这是本轮通胀周期最重要的里程碑之一，科技成长股迎来爆发式上涨。纳斯达克100 ETF、华宝纳斯达克精选、景顺长城纳斯达克科技大涨2.8%，易方达纳斯达克100同步上涨。广发全球精选、建信新兴市场也因美元走弱而显著上涨。",
    affectedFunds: ["513100", "161130", "241002", "270028", "165601", "012049", "017093", "017145"],
    impactLevel: "high",
    tags: ["CPI", "通胀达标", "降息确定"],
  },
  {
    date: "2026-07-15",
    dateCN: "07月15日",
    title: "全球避险情绪升温，科技股高位回调",
    category: "市场情绪",
    sentiment: "negative",
    impact:
      "经过此前持续上涨，科技股估值已处于历史高位区间，纳斯达克100指数市盈率(TTM)达到32倍，处于过去10年85%分位。市场出现获利了结压力，叠加部分地缘政治不确定性，全球避险情绪短暂升温。VIX恐慌指数从12.5跳升至16.8。科技股普遍回调，纳斯达克100 ETF、华宝海外科技、景顺长城纳斯达克科技下跌约2.0%。华夏科技创新、富国科技创新、华夏移动互联也因前期涨幅较大而出现技术性回调。不过基本面未发生实质性变化，多数机构认为回调属于健康的技术性调整。",
    affectedFunds: ["513100", "161130", "241002", "017093", "017145", "007349", "007339", "002396"],
    impactLevel: "medium",
    tags: ["高位回调", "避险情绪", "估值压力"],
  },
];

// ============ 全球指数概览 ============

const GLOBAL_INDICES = [
  { name: "纳指100ETF", code: "QQQ", value: "488.35", change: -0.55 },
  { name: "标普500ETF", code: "SPY", value: "561.85", change: -0.16 },
  { name: "汇率", code: "USDCNH", value: "7.2842", change: 0.00 },
  { name: "纳斯达克综合", code: "IXIC", value: "18,742.35", change: 1.85 },
  { name: "道琼斯工业", code: "DJI", value: "41,235.08", change: 0.45 },
  { name: "恒生科技", code: "HSTECH", value: "4,287.56", change: -0.68 },
];

// ============ 市场情绪指标 ============

const MARKET_SENTIMENT = {
  fearGreedIndex: 68,
  sentimentLabel: "贪婪",
  vix: 14.2,
  vixLabel: "低波动",
  tenYearYield: "4.32%",
  dollarIndex: 104.28,
  goldPrice: "$2,418/oz",
  oilPrice: "$82.5/bbl",
};

// ============ 导出 ============

window.FUNDS = FUNDS;
window.NEWS_EVENTS = NEWS_EVENTS;
window.GLOBAL_INDICES = GLOBAL_INDICES;
window.MARKET_SENTIMENT = MARKET_SENTIMENT;
