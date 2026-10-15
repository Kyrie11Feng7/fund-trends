// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-15
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-15",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29481.66,
      "change": -1.57
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26351.72,
      "change": -1.28
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7679.25,
      "change": -0.51
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4060.99,
      "change": -2.72
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4176.82,
      "change": 1.68,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 96.05,
      "change": 1.01,
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
    "300308": -5.19,
    "300502": -7.49,
    "688498": -4.68,
    "688256": -3.43,
    "002384": -5.49,
    "300476": -4.69,
    "002463": 1.03,
    "300394": -2.48,
    "688019": -3.86,
    "603929": -7.71,
    "603308": -4.77,
    "688041": -3.79,
    "688361": -1.53,
    "600183": -4.2,
    "002371": 3.95,
    "002916": -5.4,
    "002475": -0.65,
    "688205": 4.52,
    "600330": 2.66
  }
};
