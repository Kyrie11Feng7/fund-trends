// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-21
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-21",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29712.03,
      "change": 0.75
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26617.97,
      "change": 0.73
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7730.84,
      "change": 0.24
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3994.77,
      "change": -1.26
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4147.9,
      "change": 0.13,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 97.44,
      "change": -0.39,
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
    "300308": -0.17,
    "300502": -1.36,
    "688498": 1.06,
    "688256": -0.5,
    "002384": 0.84,
    "300476": 1.72,
    "002463": 3.57,
    "300394": 5.1,
    "688019": -0.17,
    "603929": -0.45,
    "603308": 2.81,
    "688041": 0.68,
    "688361": -1.15,
    "600183": 1.5,
    "002371": -0.97,
    "002916": 1.53,
    "002475": 1.03,
    "688205": -1.96,
    "600330": 5.64
  }
};
