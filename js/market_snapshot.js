// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-05
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-05",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 27174.98,
      "change": -4.44
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 24743.83,
      "change": -3.86
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7472.55,
      "change": -2.81
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4154.29,
      "change": 5.55
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4131.06,
      "change": 1.43,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 90.02,
      "change": 2.16,
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
    "300308": -7.51,
    "300502": -5.54,
    "688498": -1.06,
    "688256": -0.31,
    "002384": -5.54,
    "300476": -0.18,
    "002463": -5.76,
    "300394": -4.78,
    "688019": 3.38,
    "603929": -0.45,
    "603308": 0.15,
    "688041": 2.83,
    "688361": 9.02,
    "600183": -3.83,
    "002371": 4.76,
    "002916": -4.26,
    "002475": 2.73,
    "688205": 6.25,
    "600330": 1.96
  }
};
