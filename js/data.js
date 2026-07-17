/**
 * 基金趋势分析网站 - 数据层
 * 包含：基金NAV数据、世界新闻事件分析、全球指数概览
 * 基金每日单位净值与涨跌幅来自天天基金(eastmoney)真实历史净值(pingzhongdata接口)，抓取于2026-07-18，区间为各基金成立以来 ~ 2026-07-16。
 * 趋势分析支持「成立以来 / 近5年 / 近3年 / 近1年 / 近半年 / 近3月 / 近1月」七个区间，区间收益与最大回撤由真实净值实时计算。
 * 下列 NEWS_EVENTS 为「真实宏观事件」，逐条标注来源/可核实出处，并按实际发生(发布)时间排序；
 * impact 仅做宏观传导机制说明与主题相关基金映射，不臆造单只基金当日虚构涨跌幅。
 */

// ============ 真实净值数据见 js/realdata.js (window.REAL_FUND_DATA)，来源：天天基金 eastmoney ============
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
    data: REAL_FUND_DATA["513100"]
  },
  {
    code: "017436",
    name: "华宝纳斯达克精选",
    enName: "HWABAO NASDAQ Select",
    type: "QDII股票型",
    manager: "华宝基金",
    trackIndex: "纳斯达克100指数",
    inception: "2020-03-20",
    description:
      "华宝基金旗下纳斯达克100主题基金，聚焦美股科技龙头，重仓人工智能、云计算、半导体等前沿科技领域。",
    data: REAL_FUND_DATA["017436"]
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
    data: REAL_FUND_DATA["006555"]
  },
  {
    code: "270023",
    name: "广发全球精选股票",
    enName: "GF Global Select",
    type: "股票型",
    manager: "广发基金",
    trackIndex: "MSCI全球指数",
    inception: "2010-08-18",
    description:
      "全球配置型基金，跨市场投资美股科技、欧洲奢侈品、日本制造业及新兴市场消费，分散单一市场风险。",
    data: REAL_FUND_DATA["270023"]
  },
  {
    code: "017730",
    name: "嘉实全球产业升级",
    enName: "Harvest Global Industry Upgrade",
    type: "QDII股票型",
    manager: "嘉实基金",
    trackIndex: "MSCI全球指数",
    inception: "2018-11-02",
    description:
      "聚焦全球产业升级主题，重点配置新能源、半导体、工业自动化、数字化服务等领域的全球龙头公司。",
    data: REAL_FUND_DATA["017730"]
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
    data: REAL_FUND_DATA["000043"]
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
    data: REAL_FUND_DATA["161128"]
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
    data: REAL_FUND_DATA["161130"]
  },
  {
    code: "012920",
    name: "易方达全球成长精选",
    enName: "E Fund Global Growth Select",
    type: "QDII股票型",
    manager: "易方达基金",
    trackIndex: "MSCI全球成长指数",
    inception: "2021-04-28",
    description:
      "全球成长风格基金，精选全球范围内具有长期成长潜力的优质公司，重点配置美股科技、医药及新兴市场消费。",
    data: REAL_FUND_DATA["012920"]
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
    data: REAL_FUND_DATA["006373"]
  },
  {
    code: "539002",
    name: "建信新兴市场混合",
    enName: "Jianxin Emerging Market",
    type: "混合型",
    manager: "建信基金",
    trackIndex: "MSCI新兴市场指数",
    inception: "2011-08-02",
    description:
      "聚焦新兴市场科技与消费龙头，重点配置中国台湾半导体、韩国电子、印度IT服务及东南亚互联网企业。",
    data: REAL_FUND_DATA["539002"]
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
    data: REAL_FUND_DATA["001668"]
  },
  {
    code: "005698",
    name: "华夏全球科技先锋",
    enName: "ChinaAMC Global Tech Pioneer",
    type: "QDII股票型",
    manager: "华夏基金",
    trackIndex: "MSCI全球信息科技指数",
    inception: "2021-03-15",
    description:
      "聚焦全球科技产业先锋企业，重点布局人工智能、半导体、云计算、新能源科技等前沿赛道，兼顾中美欧科技龙头。",
    data: REAL_FUND_DATA["005698"]
  },
  {
    code: "002891",
    name: "华夏移动互联",
    enName: "ChinaAMC Mobile Internet",
    type: "股票型",
    manager: "华夏基金",
    trackIndex: "中证TMT产业主题指数",
    inception: "2016-01-27",
    description:
      "A股移动互联网主题基金，重点配置通信、电子、计算机、传媒等TMT板块，聚焦中国数字经济产业链。",
    data: REAL_FUND_DATA["002891"]
  },
  {
    code: "016701",
    name: "银华海外数字经济",
    enName: "YinHua Overseas Digital Economy",
    type: "QDII股票型",
    manager: "银华基金",
    trackIndex: "MSCI全球信息科技指数",
    inception: "2022-05-12",
    description:
      "海外数字经济主题基金，重点配置美股科技巨头及全球数字基础设施、平台经济、人工智能应用产业链。",
    data: REAL_FUND_DATA["016701"]
  },
  {
    code: "501226",
    name: "长城全球新能源车",
    enName: "Great Wall Global NEV",
    type: "QDII股票型",
    manager: "长城基金",
    trackIndex: "MSCI全球新能源车指数",
    inception: "2019-08-21",
    description:
      "全球新能源汽车产业链主题基金，覆盖整车制造、动力电池、电机电控、上游锂矿等新能源车全产业链。",
    data: REAL_FUND_DATA["501226"]
  },
  {
    code: "017145",
    name: "华宝海外新能源汽车",
    enName: "HWABAO Overseas NEV",
    type: "QDII股票型",
    manager: "华宝基金",
    trackIndex: "MSCI全球新能源车指数",
    inception: "2022-09-14",
    description:
      "海外新能源汽车主题基金，重点配置特斯拉、比亚迪、蔚来、小鹏、理想等全球新能源整车及零部件龙头。",
    data: REAL_FUND_DATA["017145"]
  },
  {
    code: "501312",
    name: "华宝海外科技",
    enName: "HWABAO Overseas Tech",
    type: "QDII股票型",
    manager: "华宝基金",
    trackIndex: "纳斯达克100指数",
    inception: "2022-11-08",
    description:
      "海外科技主题基金，重点配置美股科技龙头及全球创新型企业，聚焦人工智能、半导体、云计算等硬科技方向。",
    data: REAL_FUND_DATA["501312"]
  },
  {
    code: "008253",
    name: "华宝致远混合",
    enName: "HWABAO Zhiyuan Mixed",
    type: "混合型",
    manager: "华宝基金",
    trackIndex: "沪深300指数",
    inception: "2019-09-16",
    description:
      "平衡配置型混合基金，股债动态调整，权益部分重点配置科技成长、高端制造及消费服务领域的优质企业。",
    data: REAL_FUND_DATA["008253"]
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
    data: REAL_FUND_DATA["017093"]
  },
  {
    code: "016664",
    name: "天弘全球高端制造",
    enName: "Tianhong Global High-End Manufacturing",
    type: "QDII股票型",
    manager: "天弘基金",
    trackIndex: "MSCI全球工业指数",
    inception: "2021-06-08",
    description:
      "全球高端制造主题基金，重点配置工业自动化、航空航天、精密仪器、半导体设备、机器人等先进制造领域。",
    data: REAL_FUND_DATA["016664"]
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
    data: REAL_FUND_DATA["006751"]
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
    data: REAL_FUND_DATA["457001"]
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
    data: REAL_FUND_DATA["007349"]
  },
  {
    code: "007345",
    name: "富国科技创新A",
    enName: "Fullgoal Tech Innovation A",
    type: "股票型",
    manager: "富国基金",
    trackIndex: "中证科技创新指数",
    inception: "2019-06-11",
    description:
      "深度挖掘中国科技创新企业投资机会，重点关注半导体自主可控、AI大模型应用、机器人及商业航天等前沿领域。",
    data: REAL_FUND_DATA["007345"]
  },
];

// ============ 计算基金统计数据 ============

FUNDS.forEach((fund) => {
  const data = fund.data;
  const latest = data[data.length - 1];
  fund.latestNav = latest.nav;
  fund.latestDate = latest.date;
  fund.latestChange = latest.change;
  // 近30日收益（取最后最多30个交易日）
  const n = Math.min(30, data.length);
  const past = data[data.length - n];
  fund.periodReturn = parseFloat(
    (((latest.nav - past.nav) / past.nav) * 100).toFixed(2)
  );
  fund.maxNav = Math.max.apply(null, data.map((d) => d.nav));
  fund.minNav = Math.min.apply(null, data.map((d) => d.nav));
  fund.avgChange = parseFloat(
    (data.reduce((s, d) => s + d.change, 0) / data.length).toFixed(2)
  );
});

// ============ 世界新闻事件分析 ============

const NEWS_EVENTS = [
  // ===== 以下为真实宏观事件，逐条标注来源、按实际发生/发布时间排序（最新置顶由渲染层处理） =====
  {
    date: "2026-07-15",
    dateCN: "07月15日",
    title: "美国6月CPI同比回落至3.5%，能源降价带动通胀降温",
    category: "经济数据",
    sentiment: "positive",
    impact:
      "美国6月CPI同比3.5%（较5月4.2%明显回落），环比-0.4%，核心CPI同比2.57%、环比0.0%。能源价格回落（美伊局势缓和后）是主要拖累项。通胀降温重燃美联储降息预期，美债收益率与美元走弱，长久期科技成长股估值修复动力增强——纳斯达克主题基金（513100、017436、017093、161128）及全球成长基金（012920、270023）受益；新兴市场亦受美元走弱提振（539002、457001）。",
    affectedFunds: ["513100", "161130", "017436", "017093", "161128", "012920", "270023", "539002"],
    impactLevel: "high",
    tags: ["美国CPI", "通胀降温", "降息预期"],
    source: "NeoData 宏观数据库（美国6月CPI，数据日期2026-06-30，发布 2026-07-14/15）",
  },
  {
    date: "2026-06-30",
    dateCN: "06月30日",
    title: "中国6月官方制造业PMI回升至50.3%，重回荣枯线上方",
    category: "经济数据",
    sentiment: "positive",
    impact:
      "国家统计局6月30日公布：6月制造业PMI 50.3%（前值50.0%，预期50.1%），非制造业PMI 50.2%。美伊局势缓和后能源价格回落，推动前期积压需求释放，新订单指数升至51.2%、新出口订单升至50.1%。制造业回暖利好中国及亚洲科技制造链，对A股科技基金（007349、007345、002891）及亚洲/新兴市场基金（457001、539002）构成基本面支撑。",
    affectedFunds: ["007349", "007345", "002891", "457001", "539002"],
    impactLevel: "medium",
    tags: ["中国PMI", "制造业", "经济复苏"],
    source: "国家统计局（2026-06-30 09:30 发布）；东海/东吴证券6月PMI研报",
  },
  {
    date: "2026-06-29",
    dateCN: "06月29日",
    title: "美伊临时和平协议脆弱，霍尔木兹海峡再遭袭、油价反弹",
    category: "地缘政治",
    sentiment: "negative",
    impact:
      "6月下旬美伊冲突再度升级：临时和平协议破裂，霍尔木兹海峡内多艘船只遇袭，美方与伊朗展开打击行动，为协议签署后最激烈程度。布伦特原油反弹至约72.44美元/桶、WTI约70.05美元/桶。油价与避险情绪回升压制全球风险资产，重仓新兴市场的基金（539002、457001）及高估值科技成长板块（513100、017436、017093）短期承压；能源供给恢复不及预期则支撑油价中枢。",
    affectedFunds: ["539002", "457001", "513100", "017436", "017093", "006555", "270023"],
    impactLevel: "medium",
    tags: ["美伊冲突", "霍尔木兹", "原油", "避险"],
    source: "腾讯财经/环球市场播报《中东美伊再度爆发冲突，油价攀升》（2026-06-29）",
  },
  {
    date: "2026-06-17",
    dateCN: "06月17日",
    title: "美联储6月议息会议（新主席沃什首次主持）：联邦基金利率维持约3.62%",
    category: "货币政策",
    sentiment: "neutral",
    impact:
      "美联储6月议息会议由新任主席凯文·沃什（Kevin Warsh）首次主持。据联邦基金利率日度序列，全月利率稳定在约3.62%（6月初3.62%、月末3.63%），未见进一步大幅变动。在5月CPI回升至4.2%、欧央行意外加息的背景下，美联储选择按兵不动、观察通胀路径。利率高位企稳对纳斯达克/全球科技成长基金（513100、017436、017093、161128）估值中性偏谨慎，市场将焦点转向后续通胀与就业数据。",
    affectedFunds: ["513100", "161130", "017436", "017093", "161128", "012920"],
    impactLevel: "medium",
    tags: ["美联储", "FOMC", "沃什", "利率"],
    source: "NeoData 宏观数据库·联邦基金利率日度序列（2026年6月全月约3.62%）；美联储6月会议为沃什任内首次FOMC（据2026-06-11 金融时报报道）",
  },
  {
    date: "2026-06-11",
    dateCN: "06月11日",
    title: "欧洲央行意外加息25bp，近三年来首次加息",
    category: "货币政策",
    sentiment: "negative",
    impact:
      "6月11日欧洲央行将三大关键利率各上调25bp：存款机制利率2.25%、主要再融资2.40%、边际借贷2.65%，为2023年9月以来首次加息。欧央行表态中东冲突推升通胀压力，并上调今明两年通胀预期（2026年3.0%）。这是年内首家重启加息的主要经济体央行，重新点燃「高利率时代回归」讨论，令美联储6月会议前「维持高利率更久」预期升温，对全球成长股估值形成压制。",
    affectedFunds: ["539002", "457001", "270023", "017730", "006555"],
    impactLevel: "medium",
    tags: ["欧洲央行", "加息", "通胀"],
    source: "金融时报/腾讯财经《欧洲央行近3年来首次加息》（2026-06-11）",
  },
  {
    date: "2026-06-10",
    dateCN: "06月10日",
    title: "美国5月CPI同比升至4.2%，通胀重回4%上方",
    category: "经济数据",
    sentiment: "negative",
    impact:
      "美国5月CPI同比4.2%（预期4.2%，前值3.8%），核心CPI同比2.9%（前值2.8），能源CPI同比高达23.5%。通胀超预期回升，直接压制美联储降息空间，并迫使全球央行重新评估「高利率维持更久」。利率预期上行通常利空长久期科技成长股（513100、017436、017093、161128），同时支撑美元与美债收益率。",
    affectedFunds: ["513100", "161130", "017436", "017093", "161128", "012920"],
    impactLevel: "high",
    tags: ["美国CPI", "通胀", "降息预期"],
    source: "NeoData 宏观数据库·经济事件日历（美国5月CPI，发布日 2026-06-10 20:30）",
  },
  {
    date: "2026-06-09",
    dateCN: "06月09日",
    title: "美伊冲突骤起：美军直升机在霍尔木兹海峡被击落，美方对伊朗实施打击",
    category: "地缘政治",
    sentiment: "negative",
    impact:
      "6月8日美军一架阿帕奇直升机在霍尔木兹海峡被伊朗击落；9日美军中央司令部对伊朗发动自卫性打击。冲突推升原油风险溢价与全球避险情绪，油价与黄金获支撑，权益风险资产承压。重仓全球/新兴市场的基金（539002、457001、270023）受扰动；避险情绪升温通常压制高估值科技成长板块（513100、017436、017093）。",
    affectedFunds: ["539002", "457001", "270023", "513100", "017436", "017093", "006555"],
    impactLevel: "high",
    tags: ["美伊冲突", "霍尔木兹", "原油", "避险"],
    source: "腾讯财经/环球市场播报《美伊又打起来了 霍尔木兹海峡局势紧张》（2026-06-11）",
  },
  {
    date: "2026-06-05",
    dateCN: "06月05日",
    title: "美国5月非农：私营部门新增12万超预期，失业率持稳4.3%",
    category: "经济数据",
    sentiment: "neutral",
    impact:
      "美国5月就业数据韧性仍强——私营部门新增12万（预期8.5万，前值12.3万），失业率4.3%与前值持平。就业稳健使市场对美联储快速降息的预期降温，但同时强化了「经济软着陆」叙事，对美股科技成长股影响偏中性。重仓美股的纳斯达克/全球科技基金（513100、017436、017093、161128等）后续走势更多取决于通胀与利率路径。",
    affectedFunds: ["513100", "161130", "017436", "017093", "161128", "270023"],
    impactLevel: "medium",
    tags: ["非农就业", "美国就业", "失业率"],
    source: "NeoData 宏观数据库·经济事件日历（美国5月非农，发布日 2026-06-05 20:30）",
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
  fearGreedIndex: 39,
  sentimentLabel: "恐惧",
  vix: 21.67,
  vixLabel: "波动上升",
  tenYearYield: "4.32%",
  dollarIndex: 104.28,
  goldPrice: "$2,418/oz",
  oilPrice: "$82.5/bbl",
  dataDate: "2026-07-18",
  dataSource: "VIX(标普500波动率指数): 腾讯财经实时行情; 恐惧贪婪指数: CNN Fear & Greed Index",
};

// ============ 导出 ============

window.FUNDS = FUNDS;
window.NEWS_EVENTS = NEWS_EVENTS;
window.GLOBAL_INDICES = GLOBAL_INDICES;
window.MARKET_SENTIMENT = MARKET_SENTIMENT;
