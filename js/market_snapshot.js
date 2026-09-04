// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-04
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-04",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29482.32,
      "change": 1.16
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26584.06,
      "change": 1.4
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7747.71,
      "change": 1.06
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4569.8,
      "change": 2.27
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4443.02,
      "change": -2.13,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 90.4,
      "change": -0.98,
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
    "300308": 0.12,
    "300502": 0.32,
    "688498": -2.79,
    "688256": -2.54,
    "002384": -0.27,
    "300476": -1.35,
    "002463": -4.23,
    "300394": -0.04,
    "688019": -4.55,
    "603929": -3.06,
    "603308": 1.48,
    "688041": -1.03,
    "688361": -6.57,
    "600183": -3.97,
    "002371": -2.69,
    "002916": -2.85,
    "002475": -3.33,
    "688205": -3.04,
    "600330": -4.3
  }
};
