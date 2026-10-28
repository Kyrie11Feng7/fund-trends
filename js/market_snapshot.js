// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-28
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-28",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29694.4,
      "change": 0.14
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26470.86,
      "change": -0.03
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7736.66,
      "change": 0.18
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3853.72,
      "change": 1.4
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4055.24,
      "change": -0.48,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 102.44,
      "change": 2.55,
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
    "300308": 10.28,
    "300502": 8.08,
    "688498": 0.77,
    "688256": 4.93,
    "002384": 3.47,
    "300476": 3.57,
    "002463": 5.41,
    "300394": 6.79,
    "688019": 3.81,
    "603929": 3.98,
    "603308": 4.85,
    "688041": 3.03,
    "688361": 6.52,
    "600183": 5.0,
    "002371": 4.75,
    "002916": 7.7,
    "002475": 1.84,
    "688205": -2.62,
    "600330": 1.25
  }
};
