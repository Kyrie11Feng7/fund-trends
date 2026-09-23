// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅
// 数据源：腾讯财经行情快照（实时）；数据日期：2026-09-23
// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。
window.MARKET_SNAPSHOT = {
  "date": "2026-09-23",
  "source": "腾讯财经行情快照（实时）",
  "indices": [
    {
      "key": "ndx",
      "name": "纳斯达克100",
      "code": "usNDX",
      "value": 30594.19,
      "change": -0.45
    },
    {
      "key": "ixic",
      "name": "纳斯达克综合",
      "code": "usIXIC",
      "value": 27133.2,
      "change": -0.41
    },
    {
      "key": "spx",
      "name": "标普500",
      "code": "usINX",
      "value": 7744.86,
      "change": -0.25
    },
    {
      "key": "hstech",
      "name": "恒生科技",
      "code": "hkHSTECH",
      "value": 4379.07,
      "change": -1.33
    },
    {
      "key": "gold",
      "name": "伦敦金",
      "code": "hf_GC",
      "value": 4321.18,
      "change": -1.26,
      "unit": "/oz"
    },
    {
      "key": "oil",
      "name": "WTI原油",
      "code": "hf_CL",
      "value": 91.74,
      "change": 1.35,
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
    "300308": -0.56,
    "300502": -0.84,
    "688498": -1.03,
    "688256": -1.6,
    "002384": -2.58,
    "300476": 0.91,
    "002463": 2.37,
    "300394": -0.16,
    "688019": -0.21,
    "603929": -0.71,
    "603308": -2.14,
    "688041": -1.7,
    "688361": 0.65,
    "600183": 0.08,
    "002371": -0.71,
    "002916": 3.69,
    "002475": -0.86,
    "688205": 0.09,
    "600330": 0.91
  }
};
