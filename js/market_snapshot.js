// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-03
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-03",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29143.33,
      "change": 0.23
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26217.83,
      "change": 0.45
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7666.6,
      "change": 0.46
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4468.48,
      "change": -1.08
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4540.7,
      "change": 2.86,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 91.89,
      "change": 0.97,
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
    "300308": -1.14,
    "300502": -0.5,
    "688498": 1.82,
    "688256": -0.72,
    "002384": -2.33,
    "300476": -1.19,
    "002463": -1.66,
    "300394": -0.48,
    "688019": -1.31,
    "603929": -0.64,
    "603308": 1.84,
    "688041": -0.41,
    "688361": -4.9,
    "600183": -1.23,
    "002371": -1.67,
    "002916": -1.97,
    "002475": -1.59,
    "688205": -1.19,
    "600330": 3.7
  }
};
