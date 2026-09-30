// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-30
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-30",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30545.41,
      "change": 0.68
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27034.56,
      "change": 0.88
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7709.65,
      "change": 0.51
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4253.89,
      "change": 0.1
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4193.44,
      "change": 0.33,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 91.55,
      "change": 2.43,
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
    "300308": -0.56,
    "300502": -1.0,
    "688498": -1.56,
    "688256": -3.54,
    "002384": -2.23,
    "300476": -2.98,
    "002463": -2.64,
    "300394": 1.87,
    "688019": -1.5,
    "603929": -2.31,
    "603308": -3.13,
    "688041": -3.85,
    "688361": -1.59,
    "600183": -2.27,
    "002371": -2.07,
    "002916": -0.69,
    "002475": -1.92,
    "688205": -3.58,
    "600330": -3.38
  }
};
