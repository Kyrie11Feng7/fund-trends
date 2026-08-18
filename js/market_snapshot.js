// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-18
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-18",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29995.38,
      "change": -0.17
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26644.91,
      "change": -0.32
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7745.06,
      "change": -0.52
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4739.18,
      "change": -0.9
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4448.43,
      "change": -0.56,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 84.12,
      "change": 0.45,
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
    "300308": -1.29,
    "300502": -3.1,
    "688498": 1.16,
    "688256": 0.56,
    "002384": -1.76,
    "300476": -2.39,
    "002463": -1.2,
    "300394": 1.7,
    "688019": 4.22,
    "603929": 2.22,
    "603308": -2.59,
    "688041": -3.02,
    "688361": 0.88,
    "600183": -3.52,
    "002371": 1.44,
    "002916": -2.81,
    "002475": -1.87,
    "688205": 1.47,
    "600330": 6.95
  }
};
