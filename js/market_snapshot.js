// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-12
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-12",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29525.48,
      "change": -0.33
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26445.45,
      "change": -0.6
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7728.2,
      "change": -0.32
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4776.44,
      "change": -0.99
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4476.28,
      "change": 0.79,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 82.76,
      "change": -0.53,
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
    "300308": 3.84,
    "300502": 3.11,
    "688498": 5.77,
    "688256": 1.35,
    "002384": 3.26,
    "300476": 1.77,
    "002463": 1.66,
    "300394": 7.89,
    "688019": 1.77,
    "603929": 1.84,
    "603308": 1.6,
    "688041": 0.23,
    "688361": -0.07,
    "600183": 5.86,
    "002371": 1.86,
    "002916": 1.34,
    "002475": 3.09,
    "688205": -0.59,
    "600330": 4.26
  }
};
