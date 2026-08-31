// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-31
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-31",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29348.47,
      "change": -0.29
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26294.77,
      "change": -0.41
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7673.34,
      "change": -0.5
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4619.87,
      "change": 0.32
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4489.46,
      "change": -0.89,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 85.32,
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
    "300308": -0.75,
    "300502": 0.72,
    "688498": -0.35,
    "688256": 6.26,
    "002384": 1.22,
    "300476": 0.64,
    "002463": 2.64,
    "300394": -0.22,
    "688019": -1.73,
    "603929": 0.38,
    "603308": 0.66,
    "688041": 3.43,
    "688361": 0.92,
    "600183": 5.32,
    "002371": 0.33,
    "002916": 1.84,
    "002475": 1.8,
    "688205": -3.66,
    "600330": -1.8
  }
};
