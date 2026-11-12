// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-12
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-12",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28438.23,
      "change": 0.23
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25508.27,
      "change": 0.17
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7635.47,
      "change": 0.21
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3931.93,
      "change": -2.36
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3881.89,
      "change": -2.96,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 87.42,
      "change": 1.03,
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
    "300308": -6.11,
    "300502": -4.38,
    "688498": -1.55,
    "688256": 8.11,
    "002384": 1.77,
    "300476": -5.6,
    "002463": 2.12,
    "300394": -2.58,
    "688019": -0.92,
    "603929": -1.55,
    "603308": -0.98,
    "688041": 3.07,
    "688361": -0.01,
    "600183": -1.52,
    "002371": 1.99,
    "002916": 1.01,
    "002475": -1.65,
    "688205": -0.38,
    "600330": -1.4
  }
};
