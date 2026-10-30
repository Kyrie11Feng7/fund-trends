// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-30
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-30",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28615.76,
      "change": -2.68
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25621.74,
      "change": -2.15
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7615.72,
      "change": -1.36
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3754.9,
      "change": 0.29
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3919.55,
      "change": -2.77,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 104.13,
      "change": 2.09,
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
    "300308": -4.99,
    "300502": -14.19,
    "688498": -7.19,
    "688256": -3.61,
    "002384": -8.58,
    "300476": -13.31,
    "002463": -7.19,
    "300394": -8.42,
    "688019": -4.76,
    "603929": -7.46,
    "603308": 0.66,
    "688041": -8.44,
    "688361": -6.57,
    "600183": -7.56,
    "002371": -3.73,
    "002916": -8.2,
    "002475": -5.14,
    "688205": 17.13,
    "600330": -6.27
  }
};
