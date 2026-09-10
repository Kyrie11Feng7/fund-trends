// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-10
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-10",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29421.55,
      "change": -0.29
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26253.34,
      "change": -0.64
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7636.36,
      "change": -0.48
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4330.49,
      "change": -2.04
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4381.5,
      "change": -1.78,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 100.05,
      "change": 4.17,
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
    "300308": -2.07,
    "300502": -0.94,
    "688498": 0.06,
    "688256": -1.05,
    "002384": -1.18,
    "300476": -1.52,
    "002463": 0.29,
    "300394": 4.25,
    "688019": -1.81,
    "603929": 0.22,
    "603308": -3.76,
    "688041": -1.45,
    "688361": -0.12,
    "600183": -0.81,
    "002371": -1.2,
    "002916": 2.35,
    "002475": -2.52,
    "688205": 0.42,
    "600330": -3.47
  }
};
