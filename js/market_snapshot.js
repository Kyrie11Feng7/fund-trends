// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-26
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-26",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29209.23,
      "change": 0.64
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26151.3,
      "change": 0.66
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7677.28,
      "change": 0.32
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4626.15,
      "change": 0.82
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4679.26,
      "change": -0.32,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 79.9,
      "change": -2.99,
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
    "300308": 0.58,
    "300502": -0.52,
    "688498": -0.84,
    "688256": 0.94,
    "002384": 1.84,
    "300476": 1.82,
    "002463": 4.31,
    "300394": -1.37,
    "688019": 0.09,
    "603929": 0.66,
    "603308": 1.17,
    "688041": -0.47,
    "688361": 6.79,
    "600183": 0.78,
    "002371": 0.04,
    "002916": 2.06,
    "002475": 4.1,
    "688205": -0.4,
    "600330": -3.32
  }
};
