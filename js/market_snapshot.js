// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-09
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-09",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30839.15,
      "change": 0.37
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27330.13,
      "change": 0.5
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7801.56,
      "change": 0.47
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4197.84,
      "change": 3.06
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4215.76,
      "change": 1.41,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 91.91,
      "change": 0.46,
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
    "300308": -0.98,
    "300502": -2.19,
    "688498": -6.54,
    "688256": 0.51,
    "002384": -3.43,
    "300476": -1.72,
    "002463": -3.1,
    "300394": -0.01,
    "688019": -1.38,
    "603929": -3.85,
    "603308": -4.96,
    "688041": -0.43,
    "688361": 3.14,
    "600183": -5.85,
    "002371": -1.05,
    "002916": -5.64,
    "002475": -1.73,
    "688205": 2.34,
    "600330": -4.05
  }
};
