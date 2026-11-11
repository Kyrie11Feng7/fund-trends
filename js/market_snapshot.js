// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-11
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-11",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28449.98,
      "change": 2.56
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25542.68,
      "change": 1.9
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7614.14,
      "change": 1.24
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4027.06,
      "change": -1.41
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4011.78,
      "change": -0.46,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 88.27,
      "change": 2.59,
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
    "300308": 15.07,
    "300502": 16.97,
    "688498": 20.0,
    "688256": 7.4,
    "002384": 10.0,
    "300476": 9.92,
    "002463": 10.0,
    "300394": 13.96,
    "688019": 2.58,
    "603929": 4.3,
    "603308": -1.63,
    "688041": 3.34,
    "688361": 2.87,
    "600183": 8.39,
    "002371": 1.71,
    "002916": 10.0,
    "002475": -0.02,
    "688205": -0.56,
    "600330": 6.32
  }
};
