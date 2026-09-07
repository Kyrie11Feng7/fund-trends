// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-07
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-07",
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
      "value": 4527.71,
      "change": -0.92
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4450.14,
      "change": -0.59,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 92.65,
      "change": 1.28,
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
    "300308": 10.38,
    "300502": 8.08,
    "688498": 16.1,
    "688256": 1.9,
    "002384": 6.65,
    "300476": 6.36,
    "002463": 10.0,
    "300394": 7.36,
    "688019": 3.36,
    "603929": 3.82,
    "603308": -2.94,
    "688041": -0.39,
    "688361": 4.79,
    "600183": 7.75,
    "002371": 3.52,
    "002916": 10.0,
    "002475": 3.0,
    "688205": -3.47,
    "600330": 10.02
  }
};
