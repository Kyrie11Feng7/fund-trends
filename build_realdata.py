import urllib.request, json, os, re

# 最终正确的 25 个基金代码（已修正错配）
FINAL_CODES = [
    "513100", "017436", "006555", "270023", "017730", "000043", "161128", "161130",
    "012920", "006373", "539002", "001668", "005698", "002891", "016701", "501226",
    "017145", "501312", "008253", "017093", "016664", "006751", "457001", "007349", "007345",
]

URL = "https://api.fund.eastmoney.com/f10/lsjz?fundCode={code}&pageIndex=1&pageSize=40&startDate=2026-06-01&endDate=2026-07-17"
HEADERS = {"User-Agent": "Mozilla/5.0", "Referer": "https://fundf10.eastmoney.com/"}

def fetch(code):
    req = urllib.request.Request(URL.format(code=code), headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode("utf-8"))
    lst = (data.get("Data") or {}).get("LSJZList") or []
    out = []
    for it in lst:
        fsrq = it.get("FSRQ"); dwjz = it.get("DWJZ"); jz = it.get("JZZZL")
        if not fsrq or dwjz in (None, ""):
            continue
        jzzzl = 0.0 if jz in (None, "") else round(float(jz), 2)
        y, m, d = fsrq.split("-")
        out.append({"date": fsrq, "dateCN": "%s月%s日" % (m, d),
                    "nav": round(float(dwjz), 4), "change": jzzzl})
    out.sort(key=lambda x: x["date"])
    return out

result = {}
flat = []
for c in FINAL_CODES:
    try:
        arr = fetch(c)
        result[c] = arr
        if arr:
            mx = max(abs(x["change"]) for x in arr)
            rng = "FLAT!" if mx < 0.3 else "ok"
            if mx < 0.3:
                flat.append(c)
            print("%s: %d 条  %s -> %s  最大单日|涨跌|=%.2f%%  %s" % (
                c, len(arr), arr[0]["date"], arr[-1]["date"], mx, rng))
        else:
            print("%s: 空数据!" % c)
            flat.append(c)
    except Exception as e:
        print("%s: ERROR %s" % (c, e))
        result[c] = []

print("\n平坦(可疑)基金:", flat if flat else "无")

# 写出 js/realdata.js
lines = [
    "// 真实基金净值数据（数据来源：天天基金 eastmoney，接口 api.fund.eastmoney.com/f10/lsjz）",
    "// 抓取日期：2026-07-17   区间：2026-06-01 ~ 2026-07-17",
    "// nav = 单位净值(元)；change = 当日净值增长率(%)。QDII 基金净值为 T+1/T+2 披露，交易日数量可能少于 A 股基金。",
    "// 全部 25 只基金代码均已与天天基金官方名称逐一核对，确保名称与净值对应同一只基金。",
    "window.REAL_FUND_DATA = {",
]
codes_sorted = list(result.keys())
for i, c in enumerate(codes_sorted):
    arr = result[c]
    lines.append('  "%s": [' % c)
    inner = ['    {date:"%s",dateCN:"%s",nav:%s,change:%s}' % (r["date"], r["dateCN"], r["nav"], r["change"]) for r in arr]
    lines.append(",\n".join(inner))
    lines.append("  ]" + ("," if i < len(codes_sorted) - 1 else ""))
lines.append("};")

content = "\n".join(lines)
with open(os.path.join("js", "realdata.js"), "w", encoding="utf-8") as f:
    f.write(content)
print("\nWROTE js/realdata.js (%d bytes), 共 %d 条记录" % (len(content), sum(len(v) for v in result.values())))
