// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-13
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-13",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29742.6,
      "change": 0.74
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26588.49,
      "change": 0.54
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7748.5,
      "change": 0.26
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4792.39,
      "change": 0.33
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4435.85,
      "change": -0.71,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 81.76,
      "change": -1.81,
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
    "300308": 0.0,
    "300502": 0.4,
    "688498": 5.02,
    "688256": 0.01,
    "002384": 0.96,
    "300476": -2.9,
    "002463": -1.91,
    "300394": 7.13,
    "688019": -3.14,
    "603929": -2.92,
    "603308": 0.0,
    "688041": -0.58,
    "688361": -3.4,
    "600183": -1.04,
    "002371": -2.82,
    "002916": -2.03,
    "002475": -2.25,
    "688205": -2.02,
    "600330": -0.12
  }
};
