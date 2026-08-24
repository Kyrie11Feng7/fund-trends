// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-08-24
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-08-24",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 29308.86,
      "change": 0.33
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 26180.45,
      "change": 0.43
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7674.37,
      "change": 0.43
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4594.04,
      "change": -3.61
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4700.41,
      "change": 0.42,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 85.04,
      "change": -2.32,
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
    "300308": -7.72,
    "300502": -6.79,
    "688498": -2.9,
    "688256": -6.37,
    "002384": -3.72,
    "300476": -3.44,
    "002463": -4.65,
    "300394": -8.63,
    "688019": 0.52,
    "603929": -0.7,
    "603308": -3.79,
    "688041": -6.25,
    "688361": 0.01,
    "600183": -4.89,
    "002371": -0.91,
    "002916": -4.08,
    "002475": -1.7,
    "688205": -1.96,
    "600330": -4.4
  }
};
