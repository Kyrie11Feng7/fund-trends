// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-25
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-25",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29023.18,
      "change": -0.97
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25980.19,
      "change": -0.76
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7652.86,
      "change": -0.28
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4588.54,
      "change": -0.12
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4681.8,
      "change": -0.34,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 82.87,
      "change": -2.52,
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
    "300308": -2.78,
    "300502": -2.7,
    "688498": 0.78,
    "688256": 4.28,
    "002384": -1.43,
    "300476": -0.0,
    "002463": -1.11,
    "300394": 3.05,
    "688019": -3.6,
    "603929": -2.96,
    "603308": 1.97,
    "688041": 0.54,
    "688361": -3.01,
    "600183": 2.14,
    "002371": -1.06,
    "002916": -0.77,
    "002475": 2.12,
    "688205": 3.31,
    "600330": 5.14
  }
};
