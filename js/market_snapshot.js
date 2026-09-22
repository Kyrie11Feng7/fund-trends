// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-22
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-22",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30566.1,
      "change": 0.27
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27227.23,
      "change": 0.39
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7780.5,
      "change": 0.2
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4438.21,
      "change": 0.34
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4366.03,
      "change": -0.41,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 90.36,
      "change": -2.18,
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
    "300308": -1.41,
    "300502": -0.38,
    "688498": -4.65,
    "688256": 0.74,
    "002384": 1.59,
    "300476": -2.38,
    "002463": -0.68,
    "300394": -1.22,
    "688019": -0.01,
    "603929": 0.25,
    "603308": -2.24,
    "688041": 3.88,
    "688361": -2.11,
    "600183": -1.93,
    "002371": -0.55,
    "002916": 1.26,
    "002475": 0.73,
    "688205": 1.72,
    "600330": 1.02
  }
};
