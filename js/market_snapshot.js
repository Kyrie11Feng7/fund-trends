// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-09
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-09",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29507.7,
      "change": -0.12
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26421.41,
      "change": -0.32
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7673.52,
      "change": -0.58
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4420.79,
      "change": -0.76
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4453.05,
      "change": 0.32,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 95.61,
      "change": 2.77,
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
    "300308": 0.72,
    "300502": -0.38,
    "688498": 0.17,
    "688256": -0.38,
    "002384": 5.17,
    "300476": 1.96,
    "002463": 2.12,
    "300394": -0.18,
    "688019": -1.01,
    "603929": 0.8,
    "603308": 10.0,
    "688041": -0.46,
    "688361": -2.02,
    "600183": 1.29,
    "002371": -0.23,
    "002916": 0.21,
    "002475": 1.45,
    "688205": -4.49,
    "600330": -2.39
  }
};
