// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-17
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-17",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30046.14,
      "change": -0.13
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26729.16,
      "change": -0.28
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7785.76,
      "change": -0.17
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4782.03,
      "change": 1.58
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4455.29,
      "change": 0.41,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 81.93,
      "change": 0.56,
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
    "300308": 6.15,
    "300502": 4.15,
    "688498": 5.0,
    "688256": 5.76,
    "002384": 6.08,
    "300476": 2.48,
    "002463": 3.15,
    "300394": 7.04,
    "688019": 5.53,
    "603929": 10.0,
    "603308": 4.84,
    "688041": 2.78,
    "688361": 13.68,
    "600183": 0.89,
    "002371": 3.7,
    "002916": 3.94,
    "002475": 3.99,
    "688205": 0.32,
    "600330": 10.01
  }
};
