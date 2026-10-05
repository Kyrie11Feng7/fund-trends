// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-05
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-05",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 31025.51,
      "change": 0.71
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27439.26,
      "change": 0.91
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7771.61,
      "change": 0.63
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4183.68,
      "change": 0.62
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4154.14,
      "change": -0.2,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 89.94,
      "change": -1.29,
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
    "300308": -0.56,
    "300502": -1.0,
    "688498": -1.56,
    "688256": -3.54,
    "002384": -2.23,
    "300476": -2.98,
    "002463": -2.64,
    "300394": 1.87,
    "688019": -1.5,
    "603929": -2.31,
    "603308": -3.13,
    "688041": -3.85,
    "688361": -1.59,
    "600183": -2.27,
    "002371": -2.07,
    "002916": -0.69,
    "002475": -1.92,
    "688205": -3.58,
    "600330": -3.38
  }
};
