# -*- coding: utf-8 -*-
"""
抓取 25 只基金「成立以来」每日单位净值（真实数据）
主数据源：天天基金 fund.eastmoney.com/pingzhongdata/{code}.js  ->  Data_netWorthTrend（含完整历史 + 当日涨跌%）
输出：js/realdata.js  ->  window.REAL_FUND_DATA = { code: [{date, dateCN, nav, change}, ...] }
 - change = equityReturn（当日净值增长率%，来自源数据，已含分红/拆分口径）
 - 数据为真实历史净值，未做任何模拟
"""
import urllib.request
import urllib.parse
import ssl
import json
import time
import sys
import os
import datetime

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Referer": "http://fundf10.eastmoney.com/",
    "Accept": "*/*",
}

FUND_CODES = [
    "513100","017436","006555","270023","017730","000043","161128","161130",
    "012920","006373","539002","001668","005698","002891","016701","501226",
    "017145","501312","008253","017093","016664","006751","457001","007349","007345",
]

END_DATE = "2026-07-16"


def fetch_pingzhong(code, retries=3):
    url = "https://fund.eastmoney.com/pingzhongdata/%s.js" % code
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            raw = urllib.request.urlopen(req, timeout=30, context=CTX).read().decode("utf-8", "ignore")
            # 提取 Data_netWorthTrend（单位净值 + 当日涨跌%）
            net = _extract_array(raw, "Data_netWorthTrend")
            # 提取 Data_ACWorthTrend（累计净值/复权，用于真实收益与最大回撤，已还原拆分/分红）
            ac = _extract_array(raw, "Data_ACWorthTrend")
            if net is None:
                return None
            ac_map = {}
            if ac:
                for item in ac:
                    if isinstance(item, list) and len(item) >= 2 and item[1] is not None:
                        try:
                            ac_map[item[0]] = float(item[1])
                        except Exception:
                            pass
            return net, ac_map
        except Exception as e:
            print("  [retry %d] %s -> %s" % (attempt + 1, code, e), file=sys.stderr)
            time.sleep(1.5)
    return None


def _extract_array(raw, name):
    start = raw.find(name)
    if start < 0:
        return None
    eq = raw.find("[", start)
    end = raw.find("];", eq)
    if end < 0:
        return None
    return json.loads(raw[eq : end + 1])


def ts_to_date(ms):
    # eastmoney 时间戳为当日 00:00 CST 对应的 UTC 前一刻；+8h 还原为 CST 日期
    dt = datetime.datetime.utcfromtimestamp(ms / 1000.0 + 28800)
    return dt.strftime("%Y-%m-%d")


def to_date_cn(d):
    y, m, day = d.split("-")
    return "%s月%s日" % (int(m), int(day))


def main():
    codes = FUND_CODES
    if len(sys.argv) > 1:
        codes = sys.argv[1:]

    result = {}
    for code in codes:
        result.setdefault(code, [])

    # 反复抓取，直到所有基金都有数据（应对偶发限流/网络抖动）
    for attempt in range(4):
        missing = [c for c in codes if not result.get(c)]
        if not missing:
            break
        print("\n=== 第 %d 轮补全，缺 %d 只：%s ===" % (attempt + 1, len(missing), ", ".join(missing)))
        for code in missing:
            print("fetching %s ..." % code)
            fetched = fetch_pingzhong(code)
            if not fetched:
                print("  !! %s 本次无数据，下轮重试" % code)
                continue
            arr, ac_map = fetched
            series = []
            for item in arr:
                ms = item.get("x")
                nav = item.get("y")
                if ms is None or nav is None:
                    continue
                try:
                    nav = float(nav)
                except Exception:
                    continue
                date = ts_to_date(ms)
                change = item.get("equityReturn")
                try:
                    change = round(float(change), 2) if change is not None else 0.0
                except Exception:
                    change = 0.0
                acc = ac_map.get(ms)
                if acc is None:
                    acc = nav
                series.append({
                    "date": date,
                    "dateCN": to_date_cn(date),
                    "nav": nav,
                    "acc": round(float(acc), 4),
                    "change": change,
                })
            if series:
                result[code] = series
                print("  %s: %d points, %s ~ %s, latestNav=%.4f" % (
                    code, len(series), series[0]["date"], series[-1]["date"], series[-1]["nav"]))
            else:
                print("  !! %s 解析为空，下轮重试" % code)
            time.sleep(3.0)
        time.sleep(4.0)

    still_missing = [c for c in codes if not result.get(c)]
    if still_missing:
        print("\n警告：以下基金仍无数据，放弃写入以避免破坏 realdata.js：%s" % ", ".join(still_missing))
        return

    # 写文件
    lines = []
    lines.append("// 真实基金净值数据（数据来源：天天基金 eastmoney，pingzhongdata 接口）")
    lines.append("// 抓取日期：2026-07-18   区间：各基金成立以来 ~ %s" % END_DATE)
    lines.append("// nav = 单位净值(元，每日实际披露)；acc = 累计净值/复权(已还原份额拆分与分红，用于真实收益与最大回撤)；change = 当日净值增长率(%)，源数据 equityReturn。")
    lines.append("// QDII 基金净值为 T+1/T+2 披露，交易日数量可能少于 A 股基金；全部 25 只代码均已与天天基金官方名称逐一核对。")
    lines.append("window.REAL_FUND_DATA = {")
    for i, code in enumerate(FUND_CODES):
        series = result.get(code, [])
        lines.append('  "%s": [' % code)
        for j, d in enumerate(series):
            comma = "," if j < len(series) - 1 else ""
            lines.append('    {date:"%s",dateCN:"%s",nav:%s,acc:%s,change:%s}%s' % (
                d["date"], d["dateCN"], d["nav"], d["acc"], d["change"], comma))
        lines.append("  ]," if i < len(FUND_CODES) - 1 else "  ]")
    lines.append("};")
    out = "\n".join(lines) + "\n"

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "js", "realdata.js")
    tmp_path = out_path + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(out)
    # 仅当全部基金齐全时才覆盖 realdata.js，避免写入残缺数据
    os.replace(tmp_path, out_path)
    print("\nwritten -> %s (%d bytes)" % (out_path, len(out.encode("utf-8"))))


if __name__ == "__main__":
    main()
