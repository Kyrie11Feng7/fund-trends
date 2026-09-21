// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-21
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-21",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30274.26,
      "change": 2.13
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26946.77,
      "change": 1.6
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7728.16,
      "change": 1.02
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4423.29,
      "change": 0.4
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4385.23,
      "change": -0.9,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 92.04,
      "change": -4.2,
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
    "300308": 1.57,
    "300502": 2.64,
    "688498": 0.19,
    "688256": -0.03,
    "002384": -0.58,
    "300476": 9.23,
    "002463": 2.02,
    "300394": -1.9,
    "688019": -0.81,
    "603929": -2.57,
    "603308": -3.32,
    "688041": 2.1,
    "688361": 0.16,
    "600183": 1.63,
    "002371": -1.44,
    "002916": 2.74,
    "002475": 0.63,
    "688205": -0.52,
    "600330": 0.14
  }
};
