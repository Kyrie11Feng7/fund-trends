// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-27
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-27",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29533.84,
      "change": 1.06
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26469.05,
      "change": 1.3
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7719.73,
      "change": 0.57
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4620.29,
      "change": -0.13
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4671.95,
      "change": 0.4,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 83.97,
      "change": 2.11,
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
    "300308": 1.79,
    "300502": 2.59,
    "688498": 5.91,
    "688256": 2.75,
    "002384": 3.21,
    "300476": 5.46,
    "002463": 2.35,
    "300394": 5.36,
    "688019": 6.1,
    "603929": 3.75,
    "603308": 2.5,
    "688041": 6.5,
    "688361": 3.23,
    "600183": 8.43,
    "002371": 2.47,
    "002916": 4.9,
    "002475": 0.12,
    "688205": -1.17,
    "600330": 10.0
  }
};
