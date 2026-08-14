// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-14
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-14",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30084.5,
      "change": 1.15
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26803.03,
      "change": 0.81
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7798.99,
      "change": 0.65
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4707.62,
      "change": -1.77
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4409.94,
      "change": -0.24,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 82.17,
      "change": 1.13,
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
    "300308": 2.38,
    "300502": 4.23,
    "688498": 1.22,
    "688256": -1.13,
    "002384": 1.52,
    "300476": -0.73,
    "002463": 0.51,
    "300394": 4.1,
    "688019": 2.35,
    "603929": 0.73,
    "603308": 1.2,
    "688041": -1.75,
    "688361": -3.53,
    "600183": 1.04,
    "002371": 0.01,
    "002916": 0.01,
    "002475": 0.93,
    "688205": -1.03,
    "600330": 3.18
  }
};
