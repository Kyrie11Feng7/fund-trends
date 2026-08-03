// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-03
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-03",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28702.5,
      "change": 1.51
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25878.94,
      "change": 1.99
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7586.83,
      "change": 1.3
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4875.61,
      "change": 0.96
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4089.47,
      "change": -0.43,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 79.69,
      "change": -5.88,
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
    "300308": 0.05,
    "300502": -0.49,
    "688498": 5.03,
    "688256": -7.05,
    "002384": -5.06,
    "300476": -0.58,
    "002463": -2.06,
    "300394": 5.55,
    "688019": -8.62,
    "603929": -7.92,
    "603308": 0.86,
    "688041": -5.78,
    "688361": -12.59,
    "600183": -3.42,
    "002371": -6.65,
    "002916": -1.85,
    "002475": -6.56,
    "688205": 0.97,
    "600330": -0.84
  }
};
