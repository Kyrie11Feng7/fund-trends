// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-21
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-21",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29213.16,
      "change": -0.72
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26067.17,
      "change": -1.0
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7641.16,
      "change": -0.87
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4766.16,
      "change": 1.4
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4647.35,
      "change": 1.66,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 85.95,
      "change": -1.02,
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
    "300308": 4.29,
    "300502": 6.76,
    "688498": 2.72,
    "688256": 2.39,
    "002384": 1.73,
    "300476": 0.11,
    "002463": 6.03,
    "300394": -1.15,
    "688019": -2.95,
    "603929": -1.0,
    "603308": -0.63,
    "688041": -0.05,
    "688361": -1.72,
    "600183": 5.16,
    "002371": 0.26,
    "002916": 3.84,
    "002475": 2.46,
    "688205": -1.74,
    "600330": -2.22
  }
};
