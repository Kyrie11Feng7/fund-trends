// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-06
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-06",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29487.79,
      "change": -0.83
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26363.44,
      "change": -0.83
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7723.55,
      "change": -0.17
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4820.78,
      "change": -2.28
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4328.03,
      "change": 0.53,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 75.85,
      "change": 0.84,
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
    "300308": 0.77,
    "300502": -0.57,
    "688498": 2.7,
    "688256": 2.75,
    "002384": -0.61,
    "300476": 5.84,
    "002463": 1.38,
    "300394": 3.89,
    "688019": 1.37,
    "603929": 1.93,
    "603308": 0.8,
    "688041": 0.76,
    "688361": 1.0,
    "600183": 3.63,
    "002371": 1.13,
    "002916": 1.38,
    "002475": 0.05,
    "688205": 2.22,
    "600330": 10.01
  }
};
