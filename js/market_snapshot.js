// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-22
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-22",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29366.89,
      "change": -1.53
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26313.6,
      "change": -1.46
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7695.96,
      "change": -0.79
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3793.93,
      "change": -5.03
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4071.99,
      "change": -1.88,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 99.1,
      "change": 2.0,
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
    "300308": -8.76,
    "300502": -12.28,
    "688498": -9.9,
    "688256": -3.54,
    "002384": -7.84,
    "300476": -5.26,
    "002463": -6.97,
    "300394": -8.36,
    "688019": -4.76,
    "603929": -4.46,
    "603308": -3.56,
    "688041": -1.18,
    "688361": -6.97,
    "600183": -7.34,
    "002371": -3.39,
    "002916": -6.97,
    "002475": -2.02,
    "688205": -0.01,
    "600330": -5.77
  }
};
