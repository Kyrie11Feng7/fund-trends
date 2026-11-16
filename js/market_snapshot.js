// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-16
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-16",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27227.85,
      "change": -2.56
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24519.6,
      "change": -2.45
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7419.42,
      "change": -1.88
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3801.64,
      "change": -0.3
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3850.56,
      "change": -0.92,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 85.55,
      "change": -3.4,
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
    "300308": -12.28,
    "300502": -11.08,
    "688498": -7.48,
    "688256": -8.27,
    "002384": -10.0,
    "300476": -11.54,
    "002463": -10.0,
    "300394": -11.83,
    "688019": -1.83,
    "603929": -7.08,
    "603308": -5.6,
    "688041": -6.54,
    "688361": -11.48,
    "600183": -9.99,
    "002371": -1.2,
    "002916": -9.92,
    "002475": -3.14,
    "688205": 3.77,
    "600330": -8.48
  }
};
