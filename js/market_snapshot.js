// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-28
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-28",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29433.43,
      "change": -0.7
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26402.42,
      "change": -0.52
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7711.76,
      "change": -0.25
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4605.15,
      "change": -0.33
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4508.06,
      "change": -3.34,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 83.5,
      "change": -0.04,
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
    "300308": -0.9,
    "300502": -2.47,
    "688498": -5.68,
    "688256": -0.13,
    "002384": -2.48,
    "300476": -8.15,
    "002463": -0.26,
    "300394": -1.34,
    "688019": -1.96,
    "603929": -2.01,
    "603308": -2.35,
    "688041": -0.2,
    "688361": -2.96,
    "600183": 3.32,
    "002371": -2.85,
    "002916": -0.74,
    "002475": -1.01,
    "688205": 1.53,
    "600330": -0.72
  }
};
