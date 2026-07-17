"""
抓取真实市场情绪数据：VIX 恐慌指数 + CNN 恐惧贪婪指数
用于回填 data.js 的 MARKET_SENTIMENT，使网站讲解板块展示真实数值。

数据源（已验证可用）：
  - VIX：腾讯财经 qt.gtimg.cn（s_us.VIX，标普500波动率指数，近实时）
  - 恐惧贪婪指数：CNN Fear & Greed API（需带 Referer/Origin/Accept 头绕过 418）

运行：python fetch_sentiment.py
"""
import urllib.request
import json
import ssl

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

CNN_HDR = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.cnn.com/markets/fear-and-greed",
    "Origin": "https://www.cnn.com",
}
TX_HDR = {
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://finance.qq.com",
}


def fetch(url, headers, timeout=12):
    req = urllib.request.Request(url, headers=headers)
    return urllib.request.urlopen(req, timeout=timeout, context=CTX).read().decode("utf-8", "ignore")


def get_fear_greed():
    """CNN 恐惧贪婪指数 0-100，rating 为英文区间标签。"""
    try:
        u = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
        d = json.loads(fetch(u, CNN_HDR))
        fg = d.get("fear_and_greed", {})
        score = fg.get("score")
        if score is not None:
            return {
                "score": int(round(float(score))),
                "rating": fg.get("rating"),
                "previous": fg.get("previous_close"),
            }
    except Exception as e:
        print("CNN Fear&Greed err:", e)
    return None


def get_vix():
    """腾讯财经 s_us.VIX，返回 {vix, name, change, change_pct}。"""
    try:
        u = "https://qt.gtimg.cn/q=s_us.VIX"
        raw = fetch(u, TX_HDR)
        # 形如 v_s_us.VIX="200~标普500波动率指数~.VIX~21.67~0.00~0.00~0~0~~"
        body = raw.split('"', 1)[1].rstrip('"')
        parts = body.split("~")
        vix = float(parts[3])
        chg = float(parts[4]) if parts[4] not in ("", "0") else 0.0
        chg_pct = float(parts[5]) if parts[5] not in ("", "0") else 0.0
        return {"vix": round(vix, 2), "name": parts[1], "change": chg, "change_pct": chg_pct}
    except Exception as e:
        print("Tencent VIX err:", e)
    return None


def label_fear_greed(rating):
    m = {
        "extreme fear": "极度恐惧",
        "fear": "恐惧",
        "neutral": "中性",
        "greed": "贪婪",
        "extreme greed": "极度贪婪",
    }
    return m.get((rating or "").lower(), rating or "未知")


def label_vix(v):
    if v < 15:
        return "低波动·平静"
    if v < 20:
        return "正常波动"
    if v < 30:
        return "波动上升"
    if v < 40:
        return "高度恐慌"
    return "极端恐慌"


if __name__ == "__main__":
    fg = get_fear_greed()
    vix = get_vix()
    print("=== 恐惧贪婪指数 (CNN) ===")
    if fg:
        print(f"  数值: {fg['score']}  状态: {label_fear_greed(fg['rating'])}  前值: {fg['previous']}")
    else:
        print("  抓取失败")
    print("=== VIX 恐慌指数 (腾讯财经) ===")
    if vix:
        print(f"  数值: {vix['vix']}  名称: {vix['name']}  涨跌: {vix['change']} ({vix['change_pct']}%)  标签: {label_vix(vix['vix'])}")
    else:
        print("  抓取失败")
