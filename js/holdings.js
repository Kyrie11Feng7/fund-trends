// 基金前十大持仓与涨跌归因（真实数据）
// 持仓来源：天天基金 jjcc 接口（最新已披露季度）
// 个股涨跌幅来源：东方财富行情接口（对应个股最近交易日真实涨跌幅）
// 归因方法：权重(%) × 个股涨跌幅(%) = 加权贡献(百分点)，取贡献最大者为涨跌主因
// 说明：基金净值日与个股交易日可能存在 1 个交易日偏差，归因为近似解释，非精确复算
window.FUND_HOLDINGS = {
  "513100": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NVDA",name:"英伟达",weight:7.88,market:105},
        {code:"AAPL",name:"苹果",weight:6.93,market:105},
        {code:"MSFT",name:"微软",weight:5.11,market:105},
        {code:"AMZN",name:"亚马逊",weight:4.16,market:105},
        {code:"TSLA",name:"特斯拉",weight:3.45,market:105},
        {code:"META",name:"Meta Platforms Inc-A",weight:3.14,market:105},
        {code:"WMT",name:"沃尔玛",weight:3.12,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:3.11,market:105},
        {code:"GOOG",name:"谷歌-C",weight:2.9,market:105},
        {code:"AVGO",name:"博通",weight:2.73,market:105},
        {code:"COST",name:"开市客",weight:2.27,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "017436": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NFLX",name:"奈飞",weight:9.32,market:105},
        {code:"NVDA",name:"英伟达",weight:9.28,market:105},
        {code:"AAPL",name:"苹果",weight:7.76,market:105},
        {code:"MSFT",name:"微软",weight:7.5,market:105},
        {code:"AVGO",name:"博通",weight:7.43,market:105},
        {code:"TSLA",name:"特斯拉",weight:7.33,market:105},
        {code:"GOOG",name:"谷歌-C",weight:6.82,market:105},
        {code:"AMZN",name:"亚马逊",weight:6.34,market:105},
        {code:"META",name:"Meta Platforms Inc-A",weight:5.77,market:105},
        {code:"MRVL",name:"迈威尔科技",weight:4.96,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "006555": {
    asOf: "2026-03-31",
    stocks: [
        {code:"LITE",name:"Lumentum Holdings Inc",weight:8.22,market:105},
        {code:"GOOG",name:"谷歌-C",weight:6.4,market:105},
        {code:"TSM",name:"台积电",weight:6.04,market:106},
        {code:"WDC",name:"西部数据",weight:5.19,market:105},
        {code:"COHR",name:"Coherent Corp",weight:5.17,market:106},
        {code:"MU",name:"美光科技",weight:5.13,market:105},
        {code:"INTC",name:"英特尔",weight:4.34,market:105},
        {code:"NFLX",name:"奈飞",weight:3.55,market:105},
        {code:"ASML",name:"阿斯麦",weight:3.25,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "270023": {
    asOf: "2026-03-31",
    stocks: [
        {code:"ASML",name:"阿斯麦",weight:5.21,market:105},
        {code:"02513",name:"智谱",weight:5.1,market:116},
        {code:"GOOG",name:"谷歌-C",weight:4.94,market:105},
        {code:"NVDA",name:"英伟达",weight:4.47,market:105},
        {code:"AAPL",name:"苹果",weight:4.07,market:105},
        {code:"AMZN",name:"亚马逊",weight:4.02,market:105},
        {code:"LRCX",name:"拉姆研究",weight:4.01,market:105},
        {code:"SNDK",name:"闪迪",weight:3.54,market:105},
        {code:"AVGO",name:"博通",weight:3.27,market:105},
        {code:"MU",name:"美光科技",weight:3.26,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:0.02,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "017730": {
    asOf: "2026-03-31",
    stocks: [
        {code:"AVGO",name:"博通",weight:5.37,market:105},
        {code:"MU",name:"美光科技",weight:4.85,market:105},
        {code:"MRVL",name:"迈威尔科技",weight:4.37,market:105},
        {code:"688498",name:"源杰科技",weight:4.25,market:1},
        {code:"NVDA",name:"英伟达",weight:3.79,market:105},
        {code:"ASML",name:"阿斯麦",weight:3.7,market:105},
        {code:"688256",name:"寒武纪",weight:3.66,market:1},
        {code:"KLAC",name:"科磊",weight:3.44,market:105},
        {code:"TSM",name:"台积电",weight:3.39,market:106},
        {code:"AMD",name:"超威半导体",weight:3.33,market:105}
    ],
    attribution: {available:true,up:[],down:[{name:"源杰科技",weight:4.25,change:-9.31,contrib:-0.396},
          {name:"寒武纪",weight:3.66,change:-6.93,contrib:-0.254}]}
  },
  "000043": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NVDA",name:"英伟达",weight:9.97,market:105},
        {code:"AAPL",name:"苹果",weight:9.75,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:6.2,market:105},
        {code:"MSFT",name:"微软",weight:6.17,market:105},
        {code:"AVGO",name:"博通",weight:4.86,market:105},
        {code:"AMZN",name:"亚马逊",weight:4.04,market:105},
        {code:"TSLA",name:"特斯拉",weight:3.1,market:105},
        {code:"GOOG",name:"谷歌-C",weight:2.9,market:105},
        {code:"META",name:"Meta Platforms Inc-A",weight:2.84,market:105},
        {code:"LLY",name:"礼来",weight:2.34,market:106},
        {code:"TSM",name:"台积电",weight:1.82,market:106}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "161128": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NVDA",name:"英伟达",weight:20.16,market:105},
        {code:"AAPL",name:"苹果",weight:17.73,market:105},
        {code:"MSFT",name:"微软",weight:13.08,market:105},
        {code:"AVGO",name:"博通",weight:6.98,market:105},
        {code:"MU",name:"美光科技",weight:1.81,market:105},
        {code:"PLTR",name:"Palantir Technologies Inc-A",weight:1.59,market:105},
        {code:"AMD",name:"超威半导体",weight:1.58,market:105},
        {code:"CSCO",name:"思科",weight:1.46,market:105},
        {code:"AMAT",name:"应用材料",weight:1.29,market:105},
        {code:"LRCX",name:"拉姆研究",weight:1.27,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "161130": {
    asOf: "",
    stocks: [
        
    ],
    attribution: {available:false,note:"该基金为指数复制型ETF或QDII，最新季度前十大持仓未在A股公开接口披露（持仓以指数/海外资产为主）。",up:[],down:[]}
  },
  "012920": {
    asOf: "2026-03-31",
    stocks: [
        {code:"TSM",name:"台积电",weight:8.88,market:106},
        {code:"LITE",name:"Lumentum Holdings Inc",weight:8.68,market:105},
        {code:"300502",name:"新易盛",weight:6.02,market:0},
        {code:"GLW",name:"康宁",weight:4.67,market:106},
        {code:"AXTI",name:"AXT Inc",weight:4.67,market:105},
        {code:"300308",name:"中际旭创",weight:4.67,market:0},
        {code:"688498",name:"源杰科技",weight:4.49,market:1},
        {code:"TSEM",name:"Tower半导体",weight:3.72,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:3.36,market:105},
        {code:"002384",name:"东山精密",weight:2.67,market:0}
    ],
    attribution: {available:true,up:[],down:[{name:"新易盛",weight:6.02,change:-11.01,contrib:-0.663},
          {name:"中际旭创",weight:4.67,change:-12.0,contrib:-0.56},
          {name:"源杰科技",weight:4.49,change:-9.31,contrib:-0.418}]}
  },
  "006373": {
    asOf: "2026-03-31",
    stocks: [
        {code:"MU",name:"美光科技",weight:7.69,market:105},
        {code:"TSM",name:"台积电",weight:7.03,market:106},
        {code:"LRCX",name:"拉姆研究",weight:7.02,market:105},
        {code:"GLW",name:"康宁",weight:6.79,market:106},
        {code:"GOOG",name:"谷歌-C",weight:6.49,market:105},
        {code:"NVDA",name:"英伟达",weight:5.86,market:105},
        {code:"TSEM",name:"Tower半导体",weight:5.01,market:105},
        {code:"MKSI",name:"MKS Inc",weight:4.68,market:105},
        {code:"TTMI",name:"TTM科技",weight:4.48,market:105},
        {code:"INTC",name:"英特尔",weight:3.16,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "539002": {
    asOf: "2026-03-31",
    stocks: [
        {code:"TSM",name:"台积电",weight:10.26,market:106},
        {code:"NVDA",name:"英伟达",weight:10.14,market:105},
        {code:"AVGO",name:"博通",weight:8.52,market:105},
        {code:"SNDK",name:"闪迪",weight:4.91,market:105},
        {code:"GLW",name:"康宁",weight:4.29,market:106},
        {code:"WDC",name:"西部数据",weight:3.73,market:105},
        {code:"LITE",name:"Lumentum Holdings Inc",weight:3.58,market:105},
        {code:"MPWR",name:"Monolithic Power Systems Inc",weight:3.49,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "001668": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NVDA",name:"英伟达",weight:8.96,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:8.14,market:105},
        {code:"MSFT",name:"微软",weight:5.0,market:105},
        {code:"AMZN",name:"亚马逊",weight:4.84,market:105},
        {code:"AAPL",name:"苹果",weight:4.45,market:105},
        {code:"AVGO",name:"博通",weight:3.89,market:105},
        {code:"META",name:"Meta Platforms Inc-A",weight:3.48,market:105},
        {code:"TSM",name:"台积电",weight:3.34,market:106},
        {code:"NFLX",name:"奈飞",weight:2.36,market:105},
        {code:"MU",name:"美光科技",weight:2.21,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "005698": {
    asOf: "2026-03-31",
    stocks: [
        {code:"CIEN",name:"Ciena科技",weight:5.56,market:106},
        {code:"TSM",name:"台积电",weight:4.87,market:106},
        {code:"LITE",name:"Lumentum Holdings Inc",weight:4.72,market:105},
        {code:"COHR",name:"Coherent Corp",weight:4.59,market:106},
        {code:"VIAV",name:"Viavi Solutions Inc",weight:4.52,market:105},
        {code:"GLW",name:"康宁",weight:4.15,market:106},
        {code:"SNDK",name:"闪迪",weight:2.66,market:105},
        {code:"MU",name:"美光科技",weight:2.3,market:105},
        {code:"AEIS",name:"先进能源工业",weight:1.63,market:105},
        {code:"TER",name:"泰瑞达",weight:1.62,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "002891": {
    asOf: "2026-03-31",
    stocks: [
        {code:"COHR",name:"Coherent Corp",weight:7.54,market:106},
        {code:"SNDK",name:"闪迪",weight:7.13,market:105},
        {code:"MU",name:"美光科技",weight:6.58,market:105},
        {code:"ONTO",name:"Onto Innovation Inc",weight:5.85,market:106},
        {code:"LITE",name:"Lumentum Holdings Inc",weight:5.79,market:105},
        {code:"GLW",name:"康宁",weight:5.12,market:106},
        {code:"GOOGL",name:"谷歌-A",weight:4.76,market:105},
        {code:"NVDA",name:"英伟达",weight:4.11,market:105},
        {code:"INTC",name:"英特尔",weight:3.45,market:105},
        {code:"AAOI",name:"应用光电",weight:3.02,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "016701": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NVDA",name:"英伟达",weight:9.26,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:8.06,market:105},
        {code:"AAPL",name:"苹果",weight:6.37,market:105},
        {code:"AMZN",name:"亚马逊",weight:5.62,market:105},
        {code:"AVGO",name:"博通",weight:4.69,market:105},
        {code:"TSLA",name:"特斯拉",weight:4.63,market:105},
        {code:"MU",name:"美光科技",weight:3.92,market:105},
        {code:"TSM",name:"台积电",weight:3.9,market:106},
        {code:"AMD",name:"超威半导体",weight:3.71,market:105},
        {code:"MSFT",name:"微软",weight:3.64,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "501226": {
    asOf: "2026-03-31",
    stocks: [
        {code:"TSM",name:"台积电",weight:7.44,market:106},
        {code:"ASML",name:"阿斯麦",weight:7.27,market:105},
        {code:"NVDA",name:"英伟达",weight:6.99,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:6.33,market:105},
        {code:"MU",name:"美光科技",weight:5.95,market:105},
        {code:"AVGO",name:"博通",weight:5.45,market:105},
        {code:"AMZN",name:"亚马逊",weight:5.04,market:105},
        {code:"KLAC",name:"科磊",weight:4.54,market:105},
        {code:"LRCX",name:"拉姆研究",weight:4.23,market:105},
        {code:"SNDK",name:"闪迪",weight:4.2,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "017145": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NIO",name:"蔚来",weight:10.17,market:106},
        {code:"CVNA",name:"Carvana Co-A",weight:9.74,market:106},
        {code:"RIVN",name:"Rivian Automotive Inc-A",weight:9.65,market:105},
        {code:"AVGO",name:"博通",weight:9.64,market:105},
        {code:"RACE",name:"法拉利",weight:9.58,market:106},
        {code:"NVDA",name:"英伟达",weight:9.46,market:105},
        {code:"TSLA",name:"特斯拉",weight:9.33,market:105},
        {code:"PONY",name:"小马智行",weight:6.9,market:105},
        {code:"03750",name:"宁德时代",weight:6.39,market:116},
        {code:"MRVL",name:"迈威尔科技",weight:4.81,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "501312": {
    asOf: "",
    stocks: [
        
    ],
    attribution: {available:false,note:"该基金为指数复制型ETF或QDII，最新季度前十大持仓未在A股公开接口披露（持仓以指数/海外资产为主）。",up:[],down:[]}
  },
  "008253": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NVDA",name:"英伟达",weight:7.79,market:105},
        {code:"LITE",name:"Lumentum Holdings Inc",weight:7.07,market:105},
        {code:"SNDK",name:"闪迪",weight:5.47,market:105},
        {code:"MU",name:"美光科技",weight:4.53,market:105},
        {code:"AVGO",name:"博通",weight:4.15,market:105},
        {code:"GOOG",name:"谷歌-C",weight:3.96,market:105},
        {code:"TSM",name:"台积电",weight:3.89,market:106},
        {code:"GLW",name:"康宁",weight:2.96,market:106},
        {code:"COHR",name:"Coherent Corp",weight:2.66,market:106},
        {code:"ASML",name:"阿斯麦",weight:2.36,market:105},
        {code:"GOOGL",name:"谷歌-A",weight:0.96,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "017093": {
    asOf: "",
    stocks: [
        
    ],
    attribution: {available:false,note:"该基金为指数复制型ETF或QDII，最新季度前十大持仓未在A股公开接口披露（持仓以指数/海外资产为主）。",up:[],down:[]}
  },
  "016664": {
    asOf: "2026-03-31",
    stocks: [
        {code:"NVDA",name:"英伟达",weight:3.65,market:105},
        {code:"AVGO",name:"博通",weight:3.07,market:105},
        {code:"TSM",name:"台积电",weight:2.77,market:106},
        {code:"TSEM",name:"Tower半导体",weight:2.75,market:105},
        {code:"LITE",name:"Lumentum Holdings Inc",weight:2.69,market:105},
        {code:"300308",name:"中际旭创",weight:2.44,market:0},
        {code:"COHR",name:"Coherent Corp",weight:2.28,market:106},
        {code:"300502",name:"新易盛",weight:2.23,market:0},
        {code:"300476",name:"胜宏科技",weight:2.21,market:0}
    ],
    attribution: {available:true,up:[],down:[{name:"中际旭创",weight:2.44,change:-12.0,contrib:-0.293},
          {name:"新易盛",weight:2.23,change:-11.01,contrib:-0.246},
          {name:"胜宏科技",weight:2.21,change:-10.86,contrib:-0.24}]}
  },
  "006751": {
    asOf: "2026-03-31",
    stocks: [
        {code:"300308",name:"中际旭创",weight:9.49,market:0},
        {code:"300502",name:"新易盛",weight:9.39,market:0},
        {code:"06869",name:"长飞光纤光缆",weight:8.72,market:116},
        {code:"002463",name:"沪电股份",weight:7.63,market:0},
        {code:"002384",name:"东山精密",weight:6.71,market:0},
        {code:"002916",name:"深南电路",weight:5.53,market:0},
        {code:"300394",name:"天孚通信",weight:5.39,market:0},
        {code:"688019",name:"安集科技",weight:4.48,market:1},
        {code:"603929",name:"亚翔集成",weight:3.36,market:1},
        {code:"603308",name:"应流股份",weight:3.23,market:1}
    ],
    attribution: {available:true,up:[],down:[{name:"中际旭创",weight:9.49,change:-12.0,contrib:-1.139},
          {name:"新易盛",weight:9.39,change:-11.01,contrib:-1.034},
          {name:"天孚通信",weight:5.39,change:-13.42,contrib:-0.723}]}
  },
  "457001": {
    asOf: "2026-03-31",
    stocks: [
        {code:"09988",name:"阿里巴巴-W",weight:5.03,market:116},
        {code:"TSM",name:"台积电",weight:4.89,market:106},
        {code:"JOYY",name:"欢聚",weight:3.0,market:105}
    ],
    attribution: {available:false,note:"该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。",up:[],down:[]}
  },
  "007349": {
    asOf: "2026-03-31",
    stocks: [
        {code:"688019",name:"安集科技",weight:8.32,market:1},
        {code:"300502",name:"新易盛",weight:7.53,market:0},
        {code:"300308",name:"中际旭创",weight:7.05,market:0},
        {code:"002463",name:"沪电股份",weight:6.17,market:0},
        {code:"002916",name:"深南电路",weight:5.92,market:0},
        {code:"688041",name:"海光信息",weight:5.57,market:1},
        {code:"688361",name:"中科飞测",weight:4.8,market:1},
        {code:"688498",name:"源杰科技",weight:4.56,market:1},
        {code:"600183",name:"生益科技",weight:4.42,market:1},
        {code:"002371",name:"北方华创",weight:4.22,market:0}
    ],
    attribution: {available:true,up:[],down:[{name:"中际旭创",weight:7.05,change:-12.0,contrib:-0.846},
          {name:"新易盛",weight:7.53,change:-11.01,contrib:-0.829},
          {name:"安集科技",weight:8.32,change:-6.81,contrib:-0.567}]}
  },
  "007345": {
    asOf: "2026-03-31",
    stocks: [
        {code:"300502",name:"新易盛",weight:9.11,market:0},
        {code:"300308",name:"中际旭创",weight:8.8,market:0},
        {code:"00700",name:"腾讯控股",weight:8.62,market:116},
        {code:"002384",name:"东山精密",weight:7.08,market:0},
        {code:"02423",name:"贝壳-W",weight:4.46,market:116},
        {code:"002916",name:"深南电路",weight:4.24,market:0},
        {code:"002475",name:"立讯精密",weight:4.19,market:0},
        {code:"688205",name:"德科立",weight:2.86,market:1},
        {code:"600330",name:"天通股份",weight:1.91,market:1},
        {code:"06088",name:"FIT HON TENG",weight:1.74,market:116}
    ],
    attribution: {available:true,up:[],down:[{name:"中际旭创",weight:8.8,change:-12.0,contrib:-1.056},
          {name:"新易盛",weight:9.11,change:-11.01,contrib:-1.003},
          {name:"东山精密",weight:7.08,change:-10.0,contrib:-0.708}]}
  }
};
