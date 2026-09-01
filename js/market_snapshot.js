// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-01
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-01",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29063.59,
      "change": -1.34
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26045.69,
      "change": -1.23
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7637.79,
      "change": -0.63
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4550.88,
      "change": -1.49
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4394.04,
      "change": -1.95,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 88.3,
      "change": 2.96,
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
    "300308": 0.87,
    "300502": 0.23,
    "688498": -3.33,
    "688256": -0.29,
    "002384": -4.7,
    "300476": -4.18,
    "002463": -3.35,
    "300394": -4.27,
    "688019": -5.01,
    "603929": -4.77,
    "603308": 2.08,
    "688041": -1.37,
    "688361": -4.57,
    "600183": -5.85,
    "002371": -4.59,
    "002916": -3.99,
    "002475": -1.21,
    "688205": 0.93,
    "600330": -5.07
  }
};
