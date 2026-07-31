// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-07-31
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-07-31",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28152.22,
      "change": 0.16
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25180.73,
      "change": 0.23
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7451.64,
      "change": 0.19
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4829.22,
      "change": 0.53
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4099.33,
      "change": -1.47,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 84.3,
      "change": 0.85,
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
    "300308": 4.4,
    "300502": 6.71,
    "688498": 7.41,
    "688256": 6.1,
    "002384": 5.98,
    "300476": 5.57,
    "002463": 7.46,
    "300394": 6.81,
    "688019": 3.46,
    "603929": 2.39,
    "603308": 3.28,
    "688041": 1.31,
    "688361": 7.26,
    "600183": 5.56,
    "002371": 2.83,
    "002916": 8.26,
    "002475": -1.49,
    "688205": -7.78,
    "600330": 1.34
  }
};
