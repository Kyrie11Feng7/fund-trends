// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-11
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-11",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29103.51,
      "change": -1.08
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26081.72,
      "change": -0.65
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7591.7,
      "change": -0.58
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4320.57,
      "change": -0.23
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4419.92,
      "change": 0.29,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 99.31,
      "change": -3.09,
      "unit": "/bbl"
    },
    {
      "key": "us10y",
      "name": "美债10年",
      "code": "US10Y",
      "unit": "%",
      "value": null,
      "change": null,
      "note": "暂未获取"
    }
  ],
  "stockChanges": {
    "300308": 4.03,
    "300502": 2.94,
    "688498": -1.05,
    "688256": -0.37,
    "002384": 0.35,
    "300476": -0.42,
    "002463": 0.26,
    "300394": -2.62,
    "688019": -1.61,
    "603929": -3.32,
    "603308": -2.69,
    "688041": -0.64,
    "688361": -1.33,
    "600183": 1.0,
    "002371": -0.73,
    "002916": 1.11,
    "002475": 1.73,
    "688205": 3.77,
    "600330": -3.03
  }
};
