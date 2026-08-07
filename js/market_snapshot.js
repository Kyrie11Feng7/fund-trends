// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-07
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-07",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29373.33,
      "change": -0.39
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26348.35,
      "change": -0.06
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7709.96,
      "change": -0.18
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4858.29,
      "change": 0.78
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4364.8,
      "change": 1.52,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 77.49,
      "change": 0.25,
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
    "300308": -3.68,
    "300502": -0.22,
    "688498": 1.69,
    "688256": 2.72,
    "002384": 4.04,
    "300476": 12.01,
    "002463": 7.4,
    "300394": 2.4,
    "688019": 2.98,
    "603929": 1.51,
    "603308": 0.94,
    "688041": 1.61,
    "688361": 1.74,
    "600183": 10.0,
    "002371": 1.28,
    "002916": 8.09,
    "002475": 1.95,
    "688205": -0.29,
    "600330": 6.28
  }
};
