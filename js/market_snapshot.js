// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-11-20
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-11-20",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 25510.48,
      "change": -3.8
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 23053.96,
      "change": -3.46
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7030.95,
      "change": -2.02
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 3511.14,
      "change": -3.78
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 3535.78,
      "change": -4.06,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 82.53,
      "change": 0.11,
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
    "300308": -3.72,
    "300502": -1.23,
    "688498": -7.74,
    "688256": -1.5,
    "002384": -5.72,
    "300476": -4.2,
    "002463": -0.96,
    "300394": -6.84,
    "688019": -6.33,
    "603929": -5.77,
    "603308": -6.15,
    "688041": -8.75,
    "688361": -4.91,
    "600183": -3.18,
    "002371": -2.2,
    "002916": -0.59,
    "002475": -4.09,
    "688205": 4.27,
    "600330": -7.98
  }
};
