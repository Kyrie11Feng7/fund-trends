// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-04
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-04",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29593.42,
      "change": 2.84
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26466.45,
      "change": 2.13
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7716.4,
      "change": 1.52
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4885.61,
      "change": 0.21
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4144.48,
      "change": 1.32,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 75.89,
      "change": -5.54,
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
    "300308": 13.24,
    "300502": 13.68,
    "688498": 14.65,
    "688256": 4.88,
    "002384": 10.0,
    "300476": 6.6,
    "002463": 10.0,
    "300394": 17.45,
    "688019": 4.96,
    "603929": 7.18,
    "603308": 5.21,
    "688041": 5.5,
    "688361": 4.95,
    "600183": 10.0,
    "002371": 7.13,
    "002916": 10.0,
    "002475": 3.3,
    "688205": -2.25,
    "600330": 10.02
  }
};
