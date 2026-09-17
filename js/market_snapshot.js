// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-17
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-17",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29328.24,
      "change": 1.32
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26312.63,
      "change": 1.29
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7623.0,
      "change": 0.94
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4310.74,
      "change": -0.34
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4402.92,
      "change": 0.35,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 95.92,
      "change": -1.63,
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
    "300308": -1.3,
    "300502": 0.15,
    "688498": 1.93,
    "688256": -2.64,
    "002384": 0.8,
    "300476": -3.24,
    "002463": -3.38,
    "300394": 3.41,
    "688019": 1.1,
    "603929": -0.88,
    "603308": 0.75,
    "688041": -1.31,
    "688361": 6.13,
    "600183": -5.47,
    "002371": 0.39,
    "002916": -2.25,
    "002475": -1.44,
    "688205": -0.05,
    "600330": -3.86
  }
};
