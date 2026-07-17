# -*- coding: utf-8 -*-
"""
抓取 25 只基金的前十大持仓（真实，来源：天天基金 jjcc 接口）与对应 A 股持仓股
最近交易日真实涨跌幅（来源：东方财富行情 ulist 接口），并按 权重×涨跌幅 计算
涨跌归因。输出 js/holdings.js（window.FUND_HOLDINGS）。

说明：
- 持仓为基金最新已披露季度（优先 2026Q2，回退 2026Q1）。
- 个股涨跌幅为该股“最近交易日”真实涨跌幅；基金净值日与该个股交易日可能存在
  1 个交易日偏差，故归因为“近似解释”，页面已明示。
- QDII/ETF 持仓若不在 A 股行情接口覆盖内（美股/港股代码），则不强行归因。
"""
import urllib.request, urllib.parse, json, re, sys, time

H = {"User-Agent": "Mozilla/5.0", "Referer": "https://fundf10.eastmoney.com/"}
HQ = {"User-Agent": "Mozilla/5.0", "Referer": "https://quote.eastmoney.com/"}

ALL = ["513100","017436","006555","270023","017730","000043","161128","161130",
       "012920","006373","539002","001668","005698","002891","016701","501226",
       "017145","501312","008253","017093","016664","006751","457001","007349","007345"]

TEST = ["513100","007349","017436"]
CODES = TEST if (len(sys.argv) > 1 and sys.argv[1] == "test") else ALL

def fetch(url, headers):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
    for enc in ("utf-8", "gbk", "gb18030"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", "ignore")

def get_holdings(code):
    """返回 (asOf, stocks) 或 (None, [])"""
    for (y, m) in [(2026, 6), (2026, 3), (2026, 1)]:
        url = f"https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code={code}&year={y}&month={m}"
        html = None
        for attempt in range(3):
            try:
                html = fetch(url, H)
                break
            except Exception as e:
                print(f"  [warn] jjcc {code} {y}-{m} 重试 {attempt+1}/3: {e}")
                time.sleep(1.0)
        if not html:
            continue
        asof_m = re.search(r"截止至：<font class='px12'>([\d-]+)</font>", html)
        asOf = asof_m.group(1) if asof_m else f"{y}-{m:02d}-30"
        rows = re.findall(r"<tr>(.*?)</tr>", html, re.S)
        stocks = []
        for row in rows:
            if "股票代码" in row or "序号" in row:
                continue
            cm = re.search(r"r/(\d+)\.([A-Za-z0-9.]+)", row)
            if not cm:
                continue
            market, scode = int(cm.group(1)), cm.group(2)
            # 名称：行内 class='to[clr]' 的链接，A股仅名称格有class；QDII代码格与名称格都有class，取最后一个
            names = re.findall(r"class='to[clr][^>]*><a[^>]*>([^<]+)</a>", row)
            wm = re.search(r"class='to[clr]'>([\d.]+)%", row)
            if not (names and wm):
                continue
            name = names[-1].strip()
            stocks.append({
                "code": scode,
                "market": market,
                "name": name,
                "weight": float(wm.group(1)),
            })
        if stocks:
            return asOf, stocks
    return None, []

def get_changes_bulk(pairs):
    """pairs: list of (market, code)；返回 {code: changePct}，changePct 为 %（已 /100）"""
    out = {}
    secids = [f"{mk}.{sc}" for mk, sc in pairs]
    hosts = ["https://push2delay.eastmoney.com", "https://push2.eastmoney.com"]
    for i in range(0, len(secids), 15):
        chunk = secids[i:i+15]
        d = None
        for host in hosts:
            url = host + "/api/qt/ulist.np/get?fields=f12,f14,f3&secids=" + ",".join(chunk)
            for attempt in range(3):
                try:
                    d = json.loads(fetch(url, HQ))
                    break
                except Exception as e:
                    print(f"  [warn] ulist {host} 重试 {attempt+1}/3: {e}")
                    time.sleep(1.0)
            if d:
                break
        if not d:
            continue
        diffs = (d.get("data") or {}).get("diff") or []
        for it in diffs:
            code = str(it.get("f12"))
            f3 = it.get("f3")
            if code and f3 is not None:
                out[code] = f3 / 100.0
        time.sleep(0.4)
    return out

def main():
    result = {}
    ashare_pairs = []  # (market, code) 去重
    seen = set()
    for code in CODES:
        asOf, stocks = get_holdings(code)
        result[code] = {"asOf": asOf, "stocks": stocks}
        for s in stocks:
            if s["market"] in (0, 1) and s["code"] not in seen:
                seen.add(s["code"])
                ashare_pairs.append((s["market"], s["code"]))
        print(f"{code}: 持仓 {len(stocks)} 只, asOf={asOf}", flush=True)
        time.sleep(0.3)
    print(f"\n待取 A 股个股涨跌幅: {len(ashare_pairs)} 只", flush=True)
    changes = get_changes_bulk(ashare_pairs)
    print(f"成功取到涨跌幅: {len(changes)} 只", flush=True)
    for code in CODES:
        r = result[code]
        stocks = r["stocks"]
        if not stocks:
            r["attribution"] = {"available": False, "note": "该基金为指数复制型ETF或QDII，最新季度前十大持仓未在A股公开接口披露（持仓以指数/海外资产为主）。", "up": [], "down": []}
            continue
        contribs = []
        for s in stocks:
            if s["market"] in (0, 1):
                ch = changes.get(s["code"])
                if ch is None:
                    continue
                contrib = (s["weight"] / 100.0) * ch  # 权重占比 × 个股涨跌幅 = 对基金净值的贡献(百分点)
                contribs.append({"name": s["name"], "code": s["code"], "weight": s["weight"], "change": round(ch, 2), "contrib": round(contrib, 3)})
        if not contribs:
            r["attribution"] = {"available": False, "note": "该基金持仓以美股/港股为主，个股当日涨跌幅未在A股行情接口覆盖，暂无法做成分归因。", "up": [], "down": []}
            continue
        contribs.sort(key=lambda x: x["contrib"], reverse=True)
        up = [c for c in contribs if c["contrib"] > 0][:3]
        down = sorted([c for c in contribs if c["contrib"] < 0], key=lambda x: x["contrib"])[:3]
        r["attribution"] = {"available": True, "up": up, "down": down}
    # 输出
    lines = []
    lines.append("// 基金前十大持仓与涨跌归因（真实数据）")
    lines.append("// 持仓来源：天天基金 jjcc 接口（最新已披露季度）")
    lines.append("// 个股涨跌幅来源：东方财富行情接口（对应个股最近交易日真实涨跌幅）")
    lines.append("// 归因方法：权重(%) × 个股涨跌幅(%) = 加权贡献(百分点)，取贡献最大者为涨跌主因")
    lines.append("// 说明：基金净值日与个股交易日可能存在 1 个交易日偏差，归因为近似解释，非精确复算")
    lines.append("window.FUND_HOLDINGS = {")
    items = []
    for code in CODES:
        r = result[code]
        stocks_js = ",\n        ".join(
            f'{{code:"{s["code"]}",name:"{s["name"]}",weight:{s["weight"]},market:{s["market"]}}}' for s in r["stocks"]
        )
        attr = r.get("attribution", {})
        if attr.get("available"):
            up_js = ",\n          ".join(f'{{name:"{c["name"]}",weight:{c["weight"]},change:{c["change"]},contrib:{c["contrib"]}}}' for c in attr["up"])
            down_js = ",\n          ".join(f'{{name:"{c["name"]}",weight:{c["weight"]},change:{c["change"]},contrib:{c["contrib"]}}}' for c in attr["down"])
            attr_js = f'{{available:true,up:[{up_js}],down:[{down_js}]}}'
        else:
            note = attr.get("note", "").replace('"', "'")
            attr_js = f'{{available:false,note:"{note}",up:[],down:[]}}'
        asof = r["asOf"] or ""
        item = f'  "{code}": {{\n    asOf: "{asof}",\n    stocks: [\n        {stocks_js}\n    ],\n    attribution: {attr_js}\n  }}'
        items.append(item)
    lines.append(",\n".join(items))
    lines.append("};")
    with open("js/holdings.js", "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("\n已写出 js/holdings.js", flush=True)

if __name__ == "__main__":
    main()
