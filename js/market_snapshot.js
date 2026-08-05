// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-05
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-05",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29611.35,
      "change": -0.41
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26437.06,
      "change": -0.56
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7728.0,
      "change": -0.11
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4933.07,
      "change": 0.97
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4294.47,
      "change": 3.42,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 75.76,
      "change": -0.01,
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
    "300308": -7.27,
    "300502": -5.29,
    "688498": -1.29,
    "688256": 5.44,
    "002384": 5.44,
    "300476": 17.12,
    "002463": 3.43,
    "300394": 2.29,
    "688019": 5.9,
    "603929": 8.62,
    "603308": 4.88,
    "688041": 4.9,
    "688361": 7.43,
    "600183": 9.41,
    "002371": 6.87,
    "002916": 5.0,
    "002475": 0.7,
    "688205": 7.04,
    "600330": 8.61
  }
};
