// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-26
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-26",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 26046.9,
      "change": -0.64
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 23585.8,
      "change": -0.62
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7182.78,
      "change": -0.25
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3417.38,
      "change": 1.16
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3594.09,
      "change": 0.83,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 84.91,
      "change": 1.47,
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
    "300308": 5.18,
    "300502": 4.26,
    "688498": 2.8,
    "688256": 3.85,
    "002384": 3.9,
    "300476": 1.82,
    "002463": 2.01,
    "300394": 2.38,
    "688019": -2.63,
    "603929": -0.48,
    "603308": 0.95,
    "688041": -0.04,
    "688361": -0.38,
    "600183": 5.85,
    "002371": -3.14,
    "002916": 3.81,
    "002475": -0.15,
    "688205": -2.57,
    "600330": 1.94
  }
};
