// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-20
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-20",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29248.61,
      "change": -0.95
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26209.09,
      "change": -0.84
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7672.49,
      "change": -0.24
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4045.91,
      "change": -1.52
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4150.57,
      "change": -0.23,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 98.71,
      "change": 0.18,
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
    "300308": -1.94,
    "300502": -3.19,
    "688498": 0.83,
    "688256": -0.81,
    "002384": 0.0,
    "300476": 4.44,
    "002463": -0.66,
    "300394": 0.61,
    "688019": 0.2,
    "603929": 0.1,
    "603308": 0.12,
    "688041": 0.26,
    "688361": -6.37,
    "600183": -0.34,
    "002371": -1.15,
    "002916": -0.39,
    "002475": 3.03,
    "688205": 0.58,
    "600330": 1.29
  }
};
