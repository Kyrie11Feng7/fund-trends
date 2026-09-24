// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-24
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-24",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30300.17,
      "change": -0.56
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26780.65,
      "change": -0.58
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7677.78,
      "change": -0.37
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4361.13,
      "change": -0.41
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4302.23,
      "change": -0.37,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 94.45,
      "change": 2.48,
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
    "300308": -2.89,
    "300502": -3.59,
    "688498": -1.96,
    "688256": -1.05,
    "002384": -3.63,
    "300476": -4.75,
    "002463": -3.16,
    "300394": -2.71,
    "688019": -2.9,
    "603929": -2.85,
    "603308": -2.99,
    "688041": -1.34,
    "688361": -2.89,
    "600183": -4.34,
    "002371": -2.26,
    "002916": -4.89,
    "002475": -4.36,
    "688205": 1.98,
    "600330": -4.6
  }
};
