// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-24
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-24",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 26187.3,
      "change": -2.09
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 23679.24,
      "change": -1.7
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7190.66,
      "change": -0.64
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3466.87,
      "change": -1.17
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3585.63,
      "change": -2.61,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 81.89,
      "change": 2.15,
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
    "300308": -0.05,
    "300502": -0.74,
    "688498": -1.92,
    "688256": 6.03,
    "002384": 1.72,
    "300476": 6.27,
    "002463": 1.73,
    "300394": 4.53,
    "688019": 5.25,
    "603929": -0.33,
    "603308": 1.59,
    "688041": -0.6,
    "688361": 4.93,
    "600183": 1.4,
    "002371": 1.14,
    "002916": -0.29,
    "002475": 3.98,
    "688205": -8.48,
    "600330": -1.5
  }
};
