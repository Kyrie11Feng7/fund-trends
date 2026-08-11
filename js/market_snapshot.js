// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-11
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-11",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29621.8,
      "change": -0.34
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26605.36,
      "change": -0.32
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7753.11,
      "change": -0.06
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4824.42,
      "change": -1.93
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4430.12,
      "change": 0.24,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 84.39,
      "change": 2.75,
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
    "300308": 2.59,
    "300502": 3.93,
    "688498": -4.53,
    "688256": -2.97,
    "002384": 4.26,
    "300476": -4.01,
    "002463": -1.39,
    "300394": -0.24,
    "688019": -2.8,
    "603929": 0.32,
    "603308": -1.53,
    "688041": -1.18,
    "688361": -3.9,
    "600183": -2.36,
    "002371": -1.83,
    "002916": 2.23,
    "002475": -0.29,
    "688205": 2.04,
    "600330": -0.98
  }
};
