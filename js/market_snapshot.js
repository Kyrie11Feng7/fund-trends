// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-25
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-25",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30577.66,
      "change": 0.32
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27009.39,
      "change": 0.26
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7718.04,
      "change": 0.18
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4311.78,
      "change": -1.13
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4304.04,
      "change": 0.14,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 93.68,
      "change": -0.98,
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
    "300308": -2.89,
    "300502": -3.59,
    "688498": -1.96,
    "688256": -1.05,
    "002384": -3.63,
    "300476": -4.75,
    "002463": -3.16,
    "300394": -2.71,
    "688019": -2.9,
    "603929": -2.85,
    "603308": -2.99,
    "688041": -1.34,
    "688361": -2.89,
    "600183": -4.34,
    "002371": -2.26,
    "002916": -4.89,
    "002475": -4.36,
    "688205": 1.98,
    "600330": -4.6
  }
};
