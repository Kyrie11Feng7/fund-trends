// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-27
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-27",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 26726.39,
      "change": 2.61
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24129.5,
      "change": 2.31
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7297.49,
      "change": 1.6
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3637.88,
      "change": 6.45
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3677.82,
      "change": 3.18,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 82.9,
      "change": -0.93,
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
    "300308": 19.98,
    "300502": 20.0,
    "688498": 20.0,
    "688256": 18.68,
    "002384": 10.0,
    "300476": 15.08,
    "002463": 10.0,
    "300394": 19.8,
    "688019": 20.0,
    "603929": 10.0,
    "603308": 8.85,
    "688041": 18.05,
    "688361": 20.0,
    "600183": 10.01,
    "002371": 10.0,
    "002916": 10.0,
    "002475": 9.05,
    "688205": -1.1,
    "600330": 10.03
  }
};
