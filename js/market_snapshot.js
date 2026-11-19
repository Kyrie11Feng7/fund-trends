// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-19
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-19",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27019.36,
      "change": -0.36
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24349.98,
      "change": -0.33
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7277.24,
      "change": -0.63
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3649.14,
      "change": -2.33
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3688.82,
      "change": -1.42,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 83.44,
      "change": 1.38,
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
    "300308": 3.05,
    "300502": 5.59,
    "688498": 5.36,
    "688256": -1.58,
    "002384": -0.14,
    "300476": -0.69,
    "002463": 1.13,
    "300394": 0.24,
    "688019": 2.31,
    "603929": -0.22,
    "603308": -1.53,
    "688041": -4.81,
    "688361": 4.49,
    "600183": -1.0,
    "002371": 3.13,
    "002916": 5.0,
    "002475": 0.68,
    "688205": 1.01,
    "600330": -1.86
  }
};
