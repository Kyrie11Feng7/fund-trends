// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-02
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-02",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28391.01,
      "change": 0.02
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25498.13,
      "change": 0.24
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7606.99,
      "change": 0.36
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3839.41,
      "change": 2.25
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3970.03,
      "change": 1.82,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 95.99,
      "change": -7.81,
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
    "300308": -0.54,
    "300502": -2.31,
    "688498": -1.6,
    "688256": -2.16,
    "002384": 7.13,
    "300476": -2.89,
    "002463": -1.48,
    "300394": -4.22,
    "688019": 16.87,
    "603929": 2.88,
    "603308": -0.25,
    "688041": 4.0,
    "688361": 4.8,
    "600183": -5.66,
    "002371": 5.28,
    "002916": -2.2,
    "002475": -0.72,
    "688205": 0.51,
    "600330": -3.32
  }
};
