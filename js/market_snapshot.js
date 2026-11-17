// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-17
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-17",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 26907.73,
      "change": -1.06
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24265.92,
      "change": -0.99
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7341.62,
      "change": -1.01
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3758.17,
      "change": -1.14
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3870.89,
      "change": 0.46,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 86.54,
      "change": 0.96,
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
    "300308": -3.9,
    "300502": -4.08,
    "688498": -2.85,
    "688256": 0.76,
    "002384": -5.49,
    "300476": -1.96,
    "002463": -1.46,
    "300394": -5.07,
    "688019": 1.07,
    "603929": 0.44,
    "603308": -2.49,
    "688041": -3.93,
    "688361": 4.89,
    "600183": -4.45,
    "002371": 4.09,
    "002916": -2.48,
    "002475": -1.75,
    "688205": 2.86,
    "600330": -3.45
  }
};
