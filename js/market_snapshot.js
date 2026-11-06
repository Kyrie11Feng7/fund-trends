// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-06
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-06",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27078.51,
      "change": 1.68
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24674.38,
      "change": 1.48
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7411.8,
      "change": 0.79
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4078.23,
      "change": -1.83
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4066.56,
      "change": -1.14,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 89.96,
      "change": -0.62,
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
    "300308": -9.19,
    "300502": -7.28,
    "688498": -8.43,
    "688256": -4.98,
    "002384": -10.0,
    "300476": -7.92,
    "002463": -9.62,
    "300394": -5.79,
    "688019": -3.88,
    "603929": -3.82,
    "603308": -3.73,
    "688041": -1.71,
    "688361": -2.65,
    "600183": -9.37,
    "002371": -0.18,
    "002916": -7.44,
    "002475": -1.59,
    "688205": 7.84,
    "600330": -6.53
  }
};
