// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-13
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-13",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30513.69,
      "change": -0.49
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27197.14,
      "change": -0.18
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7795.38,
      "change": -0.15
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4136.63,
      "change": -0.79
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4181.52,
      "change": -0.22,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 93.95,
      "change": 0.22,
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
    "300308": 1.45,
    "300502": 1.06,
    "688498": 3.64,
    "688256": 0.47,
    "002384": 2.83,
    "300476": 1.18,
    "002463": 5.73,
    "300394": 7.48,
    "688019": -0.24,
    "603929": -2.36,
    "603308": 1.04,
    "688041": -1.76,
    "688361": 6.04,
    "600183": 2.12,
    "002371": 0.51,
    "002916": 2.89,
    "002475": -0.37,
    "688205": 6.91,
    "600330": 4.84
  }
};
