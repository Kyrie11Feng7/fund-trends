// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-16
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-16",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29935.59,
      "change": -0.05
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26713.03,
      "change": 0.08
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7744.06,
      "change": 0.33
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4108.24,
      "change": 1.16
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4176.42,
      "change": 0.15,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 97.79,
      "change": -0.18,
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
    "300308": 1.99,
    "300502": 0.29,
    "688498": -3.56,
    "688256": 1.99,
    "002384": -1.23,
    "300476": -2.15,
    "002463": -2.41,
    "300394": -4.71,
    "688019": 1.68,
    "603929": -1.42,
    "603308": 1.78,
    "688041": -0.66,
    "688361": -1.75,
    "600183": -0.01,
    "002371": -2.68,
    "002916": -2.76,
    "002475": 0.04,
    "688205": -3.03,
    "600330": -4.15
  }
};
