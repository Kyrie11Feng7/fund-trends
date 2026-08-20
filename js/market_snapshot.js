// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-20
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-20",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29426.02,
      "change": -0.22
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26331.09,
      "change": 0.16
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7707.98,
      "change": 0.21
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4700.53,
      "change": 0.39
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4546.94,
      "change": 0.04,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 86.39,
      "change": 2.37,
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
    "300308": 0.96,
    "300502": 0.61,
    "688498": 1.77,
    "688256": -3.77,
    "002384": 0.29,
    "300476": 3.29,
    "002463": 0.8,
    "300394": -0.41,
    "688019": -0.09,
    "603929": 0.72,
    "603308": -3.86,
    "688041": -5.16,
    "688361": 3.97,
    "600183": 0.65,
    "002371": -0.06,
    "002916": 0.31,
    "002475": -0.3,
    "688205": -1.46,
    "600330": 4.65
  }
};
