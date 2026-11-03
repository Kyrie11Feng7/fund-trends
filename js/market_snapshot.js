// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-03
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-03",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 28210.35,
      "change": 0.79
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 25382.24,
      "change": 0.87
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7578.51,
      "change": 0.49
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3867.73,
      "change": 0.74
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3938.84,
      "change": -0.77,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 95.73,
      "change": -0.75,
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
    "300308": -12.69,
    "300502": -9.46,
    "688498": -10.78,
    "688256": -10.81,
    "002384": -4.41,
    "300476": -9.12,
    "002463": -9.19,
    "300394": -12.8,
    "688019": -1.46,
    "603929": -6.78,
    "603308": -3.98,
    "688041": -3.95,
    "688361": -8.0,
    "600183": -10.0,
    "002371": -3.41,
    "002916": -10.0,
    "002475": 0.4,
    "688205": 1.91,
    "600330": -9.95
  }
};
