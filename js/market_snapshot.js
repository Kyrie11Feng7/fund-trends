// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-14
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-14",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30337.28,
      "change": -0.76
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27045.47,
      "change": -0.58
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7771.4,
      "change": -0.44
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4174.47,
      "change": 0.91
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4115.31,
      "change": -1.48,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 95.45,
      "change": 1.39,
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
    "300308": -5.73,
    "300502": -5.84,
    "688498": -3.79,
    "688256": -4.86,
    "002384": -5.97,
    "300476": -1.98,
    "002463": -0.78,
    "300394": -7.17,
    "688019": -2.92,
    "603929": -5.3,
    "603308": -1.0,
    "688041": -3.95,
    "688361": -5.24,
    "600183": -2.37,
    "002371": -0.71,
    "002916": -0.07,
    "002475": -2.62,
    "688205": 1.0,
    "600330": -3.68
  }
};
