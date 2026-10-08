// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-08
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-08",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30963.31,
      "change": -0.63
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27366.69,
      "change": -0.62
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7773.05,
      "change": -0.37
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4073.38,
      "change": -2.89
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4138.16,
      "change": -0.06,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 92.89,
      "change": 5.22,
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
    "300308": -3.15,
    "300502": -2.7,
    "688498": -20.0,
    "688256": -2.78,
    "002384": -10.0,
    "300476": -1.94,
    "002463": -0.04,
    "300394": -9.86,
    "688019": -3.22,
    "603929": -1.19,
    "603308": 1.21,
    "688041": -2.76,
    "688361": -5.04,
    "600183": 1.46,
    "002371": -2.54,
    "002916": -1.34,
    "002475": -2.02,
    "688205": 0.48,
    "600330": -10.0
  }
};
