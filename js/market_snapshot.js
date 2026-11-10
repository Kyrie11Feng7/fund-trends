// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-10
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-10",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27672.98,
      "change": -0.84
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25020.11,
      "change": -0.92
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7498.69,
      "change": -0.68
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4084.45,
      "change": 1.08
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4032.72,
      "change": -1.99,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 86.46,
      "change": -0.45,
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
    "300308": 4.2,
    "300502": 4.43,
    "688498": 0.04,
    "688256": -1.55,
    "002384": 2.7,
    "300476": 1.05,
    "002463": 5.45,
    "300394": 2.92,
    "688019": 2.1,
    "603929": 0.61,
    "603308": 1.28,
    "688041": -0.98,
    "688361": 0.82,
    "600183": 0.35,
    "002371": -1.13,
    "002916": 2.31,
    "002475": 1.77,
    "688205": -4.6,
    "600330": 1.27
  }
};
