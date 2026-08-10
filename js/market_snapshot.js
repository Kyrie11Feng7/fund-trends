// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-10
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-10",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29722.3,
      "change": 1.19
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26690.62,
      "change": 1.3
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7757.64,
      "change": 0.62
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4919.46,
      "change": 1.26
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4403.56,
      "change": 0.09,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 79.05,
      "change": 1.11,
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
    "300308": -6.01,
    "300502": -5.07,
    "688498": 4.4,
    "688256": -6.33,
    "002384": -4.78,
    "300476": 2.07,
    "002463": -2.52,
    "300394": -3.32,
    "688019": 0.56,
    "603929": -1.18,
    "603308": -0.29,
    "688041": -1.8,
    "688361": 3.26,
    "600183": -1.01,
    "002371": 1.07,
    "002916": -2.67,
    "002475": -2.11,
    "688205": -0.2,
    "600330": 2.04
  }
};
