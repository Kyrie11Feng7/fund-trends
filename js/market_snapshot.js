// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-27
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-27",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29499.19,
      "change": 0.77
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26361.99,
      "change": 0.74
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7702.33,
      "change": 0.33
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3800.43,
      "change": -1.48
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4061.7,
      "change": 0.58,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 100.55,
      "change": -1.19,
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
    "300308": -2.94,
    "300502": -5.6,
    "688498": -4.73,
    "688256": -5.68,
    "002384": -4.12,
    "300476": -7.4,
    "002463": 0.3,
    "300394": -4.24,
    "688019": -5.71,
    "603929": -3.87,
    "603308": -1.82,
    "688041": -5.54,
    "688361": -6.61,
    "600183": -2.64,
    "002371": -5.51,
    "002916": -2.8,
    "002475": -2.03,
    "688205": -2.55,
    "600330": -1.79
  }
};
