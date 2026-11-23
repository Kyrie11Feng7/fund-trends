// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-23
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-23",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 26821.93,
      "change": 7.16
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24173.66,
      "change": 6.88
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7260.51,
      "change": 5.07
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3508.0,
      "change": -0.09
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3643.9,
      "change": 3.66,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 80.0,
      "change": -4.09,
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
    "300308": 6.1,
    "300502": 9.92,
    "688498": 4.63,
    "688256": -0.57,
    "002384": 5.72,
    "300476": 6.36,
    "002463": 2.96,
    "300394": 13.82,
    "688019": 0.66,
    "603929": 2.9,
    "603308": 4.42,
    "688041": -0.15,
    "688361": -5.79,
    "600183": 4.08,
    "002371": -6.55,
    "002916": -0.9,
    "002475": 1.23,
    "688205": 3.87,
    "600330": 6.39
  }
};
