// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-23
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-23",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28895.99,
      "change": -0.22
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25910.66,
      "change": -0.38
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7620.24,
      "change": -0.56
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3871.66,
      "change": 2.05
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4038.63,
      "change": -0.54,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 102.1,
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
    "300308": 3.82,
    "300502": 1.16,
    "688498": 0.56,
    "688256": 5.46,
    "002384": 0.63,
    "300476": 3.08,
    "002463": 0.09,
    "300394": 1.93,
    "688019": 2.78,
    "603929": 0.92,
    "603308": 3.69,
    "688041": 5.28,
    "688361": -0.3,
    "600183": 0.5,
    "002371": -0.83,
    "002916": -0.46,
    "002475": 7.25,
    "688205": 2.22,
    "600330": 1.69
  }
};
