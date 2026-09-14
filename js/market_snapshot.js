// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-14
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-14",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29023.8,
      "change": -1.17
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26109.97,
      "change": -0.85
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7604.19,
      "change": -0.69
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4317.94,
      "change": -0.06
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4318.1,
      "change": -2.06,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 102.7,
      "change": 2.65,
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
    "300308": -5.72,
    "300502": -4.99,
    "688498": -0.49,
    "688256": 0.0,
    "002384": -4.79,
    "300476": -1.74,
    "002463": -1.99,
    "300394": -1.91,
    "688019": -1.46,
    "603929": -1.6,
    "603308": -4.11,
    "688041": -3.12,
    "688361": -0.22,
    "600183": -1.64,
    "002371": -1.26,
    "002916": -1.9,
    "002475": -4.71,
    "688205": 5.74,
    "600330": 10.01
  }
};
