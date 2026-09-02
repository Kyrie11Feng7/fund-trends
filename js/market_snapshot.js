// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-02
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-02",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29077.22,
      "change": -1.29
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26099.77,
      "change": -1.03
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7631.47,
      "change": -0.71
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4517.16,
      "change": -0.74
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4380.81,
      "change": -0.35,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 89.8,
      "change": -0.46,
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
    "300308": -4.29,
    "300502": -4.0,
    "688498": -0.07,
    "688256": -0.09,
    "002384": -2.79,
    "300476": -3.35,
    "002463": -1.93,
    "300394": -0.7,
    "688019": -0.63,
    "603929": -0.91,
    "603308": -6.19,
    "688041": -1.29,
    "688361": -3.4,
    "600183": 0.39,
    "002371": -0.1,
    "002916": -1.68,
    "002475": 0.28,
    "688205": 1.28,
    "600330": -1.93
  }
};
