// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-09
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-09",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27865.68,
      "change": 3.24
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25223.39,
      "change": 2.62
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7552.71,
      "change": 2.38
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4040.73,
      "change": -0.92
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4117.65,
      "change": 1.05,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 87.56,
      "change": -3.61,
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
    "300308": 0.9,
    "300502": 2.27,
    "688498": 7.77,
    "688256": 6.02,
    "002384": 1.62,
    "300476": 5.72,
    "002463": 5.31,
    "300394": 0.67,
    "688019": 0.63,
    "603929": -0.14,
    "603308": 2.4,
    "688041": 1.26,
    "688361": -1.95,
    "600183": 0.27,
    "002371": -2.71,
    "002916": 1.79,
    "002475": 1.46,
    "688205": -2.98,
    "600330": 3.31
  }
};
