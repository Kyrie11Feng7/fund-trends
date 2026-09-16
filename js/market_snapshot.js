// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-16
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-16",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29093.38,
      "change": 0.54
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26095.8,
      "change": 0.44
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7601.81,
      "change": 0.21
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4325.45,
      "change": 0.79
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4389.65,
      "change": 1.31,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 98.75,
      "change": -1.98,
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
    "300308": 5.07,
    "300502": 6.72,
    "688498": 3.9,
    "688256": 5.6,
    "002384": 5.02,
    "300476": 1.9,
    "002463": 1.57,
    "300394": 4.51,
    "688019": 3.91,
    "603929": 4.77,
    "603308": -0.68,
    "688041": 4.67,
    "688361": 9.11,
    "600183": 2.82,
    "002371": 3.88,
    "002916": 0.71,
    "002475": 2.44,
    "688205": -1.07,
    "600330": 6.27
  }
};
