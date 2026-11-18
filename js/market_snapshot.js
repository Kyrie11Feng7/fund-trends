// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-18
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-18",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27192.24,
      "change": 0.71
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24497.29,
      "change": 0.69
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7350.27,
      "change": 0.13
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3736.33,
      "change": -0.58
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3750.38,
      "change": -2.95,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 81.5,
      "change": -3.72,
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
    "300308": 0.84,
    "300502": -1.12,
    "688498": -0.69,
    "688256": 4.89,
    "002384": 0.06,
    "300476": 6.42,
    "002463": 10.0,
    "300394": 4.6,
    "688019": -0.83,
    "603929": -0.23,
    "603308": -1.44,
    "688041": 3.59,
    "688361": 2.23,
    "600183": 3.91,
    "002371": 0.93,
    "002916": 10.0,
    "002475": -0.57,
    "688205": -2.54,
    "600330": 1.89
  }
};
