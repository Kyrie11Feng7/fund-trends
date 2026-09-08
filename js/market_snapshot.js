// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-08
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-08",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29544.16,
      "change": 0.21
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26506.99,
      "change": -0.29
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7718.6,
      "change": -0.38
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4454.85,
      "change": -1.61
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4451.5,
      "change": -0.56,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 92.55,
      "change": 1.17,
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
    "300308": 0.44,
    "300502": -0.19,
    "688498": 0.76,
    "688256": -3.06,
    "002384": -2.17,
    "300476": -1.91,
    "002463": 1.83,
    "300394": -3.18,
    "688019": 4.25,
    "603929": 1.53,
    "603308": -1.03,
    "688041": -2.39,
    "688361": 0.45,
    "600183": -1.26,
    "002371": -1.93,
    "002916": 4.8,
    "002475": -1.56,
    "688205": 1.9,
    "600330": 4.12
  }
};
