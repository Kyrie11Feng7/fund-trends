// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-19
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-19",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29764.74,
      "change": 1.98
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26598.02,
      "change": 1.75
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7726.62,
      "change": 0.88
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4108.24,
      "change": 1.16
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4163.86,
      "change": -0.41,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 98.12,
      "change": -0.91,
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
    "300308": -1.39,
    "300502": 0.36,
    "688498": -2.58,
    "688256": 1.48,
    "002384": -0.42,
    "300476": -2.83,
    "002463": -1.44,
    "300394": -4.46,
    "688019": 0.5,
    "603929": -0.88,
    "603308": 0.62,
    "688041": -0.54,
    "688361": -10.36,
    "600183": 2.64,
    "002371": -3.46,
    "002916": -2.52,
    "002475": 3.43,
    "688205": 0.59,
    "600330": -2.12
  }
};
