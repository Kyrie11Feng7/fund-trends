// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-15
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-15",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29126.87,
      "change": -0.0
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26164.08,
      "change": -0.09
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7612.27,
      "change": -0.1
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4291.34,
      "change": -0.62
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4325.81,
      "change": -0.6,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 103.72,
      "change": 2.3,
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
    "300308": -1.03,
    "300502": -1.22,
    "688498": -0.44,
    "688256": 3.44,
    "002384": -1.24,
    "300476": 0.47,
    "002463": 0.1,
    "300394": 0.16,
    "688019": 1.46,
    "603929": 1.43,
    "603308": -0.26,
    "688041": 0.41,
    "688361": 1.9,
    "600183": 2.91,
    "002371": 1.94,
    "002916": 0.15,
    "002475": -2.18,
    "688205": 1.43,
    "600330": -3.97
  }
};
