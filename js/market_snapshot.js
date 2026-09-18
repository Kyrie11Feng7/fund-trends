// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-18
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-18",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29446.98,
      "change": 1.73
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26418.3,
      "change": 1.69
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7637.76,
      "change": 1.14
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4405.5,
      "change": 2.2
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4402.69,
      "change": 0.07,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 97.23,
      "change": -0.0,
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
    "300308": 3.4,
    "300502": 4.87,
    "688498": 2.82,
    "688256": 0.65,
    "002384": 1.35,
    "300476": 1.86,
    "002463": 0.02,
    "300394": 2.52,
    "688019": 2.09,
    "603929": 3.21,
    "603308": 4.6,
    "688041": 4.04,
    "688361": 7.71,
    "600183": -1.44,
    "002371": 3.16,
    "002916": 0.21,
    "002475": 3.78,
    "688205": -3.12,
    "600330": -0.98
  }
};
