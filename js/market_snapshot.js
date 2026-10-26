// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-26
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-26",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29384.31,
      "change": 1.47
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26292.63,
      "change": 1.3
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7698.2,
      "change": 0.98
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3857.53,
      "change": -0.36
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4038.64,
      "change": 0.77,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 101.63,
      "change": -1.59,
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
    "300308": -2.96,
    "300502": -3.57,
    "688498": -5.42,
    "688256": 3.84,
    "002384": -7.7,
    "300476": 2.47,
    "002463": -7.62,
    "300394": -1.91,
    "688019": -3.51,
    "603929": -4.97,
    "603308": -5.26,
    "688041": -1.54,
    "688361": -4.75,
    "600183": -9.52,
    "002371": -3.81,
    "002916": -5.47,
    "002475": -1.21,
    "688205": 1.97,
    "600330": -4.72
  }
};
