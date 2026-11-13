// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-13
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-13",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27721.8,
      "change": -2.01
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24972.12,
      "change": -1.55
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7523.85,
      "change": -0.9
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3813.19,
      "change": -3.02
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3886.56,
      "change": 0.03,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 88.64,
      "change": -0.12,
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
    "300308": -8.39,
    "300502": -8.76,
    "688498": -11.76,
    "688256": 0.6,
    "002384": -9.95,
    "300476": -10.57,
    "002463": -10.0,
    "300394": -10.94,
    "688019": 1.49,
    "603929": -7.08,
    "603308": -6.7,
    "688041": 0.46,
    "688361": -3.63,
    "600183": -9.99,
    "002371": -1.04,
    "002916": -9.99,
    "002475": -1.57,
    "688205": -2.46,
    "600330": -8.03
  }
};
