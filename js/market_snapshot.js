// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-29
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-29",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30420.69,
      "change": 0.48
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26882.13,
      "change": 0.23
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7684.6,
      "change": 0.01
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4249.62,
      "change": -1.08
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4202.88,
      "change": 0.83,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 91.2,
      "change": -1.51,
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
    "300308": -0.24,
    "300502": -1.7,
    "688498": 2.96,
    "688256": 2.55,
    "002384": 1.74,
    "300476": 1.53,
    "002463": 1.6,
    "300394": 4.57,
    "688019": -0.32,
    "603929": -0.62,
    "603308": 0.63,
    "688041": -1.92,
    "688361": -1.8,
    "600183": 0.78,
    "002371": -0.78,
    "002916": 1.25,
    "002475": 0.96,
    "688205": 0.66,
    "600330": 0.11
  }
};
