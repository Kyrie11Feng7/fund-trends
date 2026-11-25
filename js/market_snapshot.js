// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-25
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-25",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 25928.27,
      "change": -1.09
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 23502.8,
      "change": -0.97
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7179.78,
      "change": -0.3
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3378.26,
      "change": -2.56
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3571.78,
      "change": -0.54,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 83.65,
      "change": 1.95,
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
    "300308": -1.92,
    "300502": 0.72,
    "688498": -4.72,
    "688256": -6.4,
    "002384": -3.99,
    "300476": -0.68,
    "002463": -5.52,
    "300394": 7.65,
    "688019": -10.07,
    "603929": -6.36,
    "603308": -6.22,
    "688041": -3.1,
    "688361": -8.79,
    "600183": -5.15,
    "002371": -9.55,
    "002916": -5.08,
    "002475": -3.39,
    "688205": 3.97,
    "600330": -6.25
  }
};
