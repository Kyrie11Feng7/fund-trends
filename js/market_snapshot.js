// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-28
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-28",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30318.59,
      "change": -0.95
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26887.21,
      "change": -0.67
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7698.14,
      "change": -0.58
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4296.0,
      "change": -0.37
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4160.12,
      "change": -3.73,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 93.16,
      "change": 0.81,
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
    "300308": -9.03,
    "300502": -8.11,
    "688498": -6.39,
    "688256": -6.55,
    "002384": -9.52,
    "300476": -8.25,
    "002463": -5.52,
    "300394": -8.63,
    "688019": -4.77,
    "603929": -6.84,
    "603308": -6.14,
    "688041": -3.14,
    "688361": -2.45,
    "600183": -3.92,
    "002371": -2.93,
    "002916": -5.96,
    "002475": -4.0,
    "688205": 0.8,
    "600330": -2.76
  }
};
