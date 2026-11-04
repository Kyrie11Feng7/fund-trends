// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-04
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-04",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28369.29,
      "change": 0.67
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25676.88,
      "change": 1.2
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7662.2,
      "change": 1.23
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3936.02,
      "change": 1.77
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4051.61,
      "change": 2.82,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 92.01,
      "change": -4.24,
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
    "300308": 11.07,
    "300502": 13.35,
    "688498": 9.27,
    "688256": 10.38,
    "002384": 7.04,
    "300476": 10.21,
    "002463": 9.99,
    "300394": 10.02,
    "688019": 13.76,
    "603929": 8.22,
    "603308": 8.59,
    "688041": 10.29,
    "688361": 20.0,
    "600183": 9.49,
    "002371": 10.0,
    "002916": 10.0,
    "002475": 8.93,
    "688205": -0.99,
    "600330": 6.73
  }
};
