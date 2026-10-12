// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-12
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-12",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30652.71,
      "change": -0.75
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27242.8,
      "change": -0.45
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7802.81,
      "change": -0.11
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4169.57,
      "change": -0.67
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4192.68,
      "change": -0.56,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 93.96,
      "change": 2.3,
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
    "300308": -6.41,
    "300502": -6.1,
    "688498": -6.96,
    "688256": -1.43,
    "002384": -6.59,
    "300476": -2.92,
    "002463": -2.38,
    "300394": -2.34,
    "688019": -1.39,
    "603929": 3.77,
    "603308": -2.16,
    "688041": -2.77,
    "688361": 1.1,
    "600183": -3.33,
    "002371": -1.02,
    "002916": -5.61,
    "002475": -2.67,
    "688205": 1.47,
    "600330": -4.0
  }
};
