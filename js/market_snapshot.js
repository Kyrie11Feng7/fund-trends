// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-19
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-19",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29490.96,
      "change": -1.68
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26289.71,
      "change": -1.33
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7691.76,
      "change": -0.69
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4682.05,
      "change": -1.21
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4412.6,
      "change": -0.18,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 84.9,
      "change": 1.0,
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
    "300308": -9.36,
    "300502": -9.0,
    "688498": -5.91,
    "688256": -9.64,
    "002384": -7.82,
    "300476": -8.92,
    "002463": -8.24,
    "300394": -4.82,
    "688019": -8.92,
    "603929": -8.46,
    "603308": -7.34,
    "688041": -7.26,
    "688361": -8.05,
    "600183": -10.0,
    "002371": -8.24,
    "002916": -9.93,
    "002475": -7.34,
    "688205": 6.49,
    "600330": -9.32
  }
};
