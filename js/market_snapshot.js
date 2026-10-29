// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-10-29
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-10-29",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29446.45,
      "change": -1.23
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26226.58,
      "change": -1.22
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7721.91,
      "change": -0.28
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3744.14,
      "change": -2.84
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4033.1,
      "change": -0.46,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 100.16,
      "change": -2.55,
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
    "300308": -8.53,
    "300502": -11.06,
    "688498": -11.63,
    "688256": -4.7,
    "002384": -10.0,
    "300476": -11.05,
    "002463": -10.0,
    "300394": -19.77,
    "688019": -5.05,
    "603929": -2.83,
    "603308": -3.38,
    "688041": -3.54,
    "688361": -6.83,
    "600183": -8.17,
    "002371": -2.81,
    "002916": -9.37,
    "002475": -3.28,
    "688205": 2.03,
    "600330": -8.4
  }
};
