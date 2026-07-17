# -*- coding: utf-8 -*-
"""
抓取真实市场快照：全球指数 + 宏观（黄金/原油/美债） + 各基金 A股持仓个股真实涨跌幅
数据源：neodata-financial-search（NeoData 金融数据，真实行情）
输出：js/market_snapshot.js  ->  window.MARKET_SNAPSHOT { date, source, indices[], stockChanges{} }

用法：
  python fetch_market_snapshot.py
可接入每日自动化（与 fetch_deep_news.py 同机同凭证）。
"""
import subprocess
import re
import json
import sys
import os
import time

HERE = os.path.dirname(os.path.abspath(__file__))
PY = "C:/Users/26355/.workbuddy/binaries/python/versions/3.13.12/python.exe"
NEODATA = "D:/workbuddy/resources/app.asar.unpacked/resources/builtin-skills/neodata-financial-search/scripts/query.py"
OUT = os.path.join(HERE, "js", "market_snapshot.js")

# ---- 快照条目：指数 / 宏观 ----
SNAPSHOT_ITEMS = [
    ("ndx",    "纳斯达克100",   ".NDX.US",     "纳斯达克100指数 最新点位 涨跌幅"),
    ("ixic",   "纳斯达克综合",  ".IXIC.US",    "纳斯达克综合指数 最新点位 涨跌幅"),
    ("spx",    "标普500",       ".INX.US",     "标普500指数 最新收盘点位 涨跌幅"),
    ("hstech", "恒生科技",      "HSTECH.HK",   "恒生科技指数 实时行情 涨跌幅"),
    ("gold",   "伦敦金",        "AUUSDO.LIFFE","现货黄金 最新价格 美元每盎司"),
    ("oil",    "WTI原油",       "CL",          "WTI原油 最新价格 美元每桶"),
    ("us10y",  "美债10年",      "US10Y",       "美国10年期国债收益率 最新"),
]

# ---- A股持仓个股（取自 holdings.js 中 market 为 0/1 的标的关键词，用于真实涨跌归因）----
STOCK_QUERIES = [
    ("300308", "中际旭创 300308 最新涨跌幅"),
    ("300502", "新易盛 300502 最新涨跌幅"),
    ("688498", "源杰科技 688498 最新涨跌幅"),
    ("688256", "寒武纪 688256 最新涨跌幅"),
    ("002384", "东山精密 002384 最新涨跌幅"),
    ("300476", "胜宏科技 300476 最新涨跌幅"),
    ("002463", "沪电股份 002463 最新涨跌幅"),
    ("300394", "天孚通信 300394 最新涨跌幅"),
    ("688019", "安集科技 688019 最新涨跌幅"),
    ("603929", "亚翔集成 603929 最新涨跌幅"),
    ("603308", "应流股份 603308 最新涨跌幅"),
    ("688041", "海光信息 688041 最新涨跌幅"),
    ("688361", "中科飞测 688361 最新涨跌幅"),
    ("600183", "生益科技 600183 最新涨跌幅"),
    ("002371", "北方华创 002371 最新涨跌幅"),
    ("002916", "深南电路 002916 最新涨跌幅"),
    ("002475", "立讯精密 002475 最新涨跌幅"),
    ("688205", "德科立 688205 最新涨跌幐"),
    ("600330", "天通股份 600330 最新涨跌幅"),
]


def query_neodata(q, timeout=80):
    """调用 neodata 查询脚本，返回解析后的 JSON dict。失败时抛异常。"""
    try:
        out = subprocess.run(
            [PY, NEODATA, "--query", q],
            capture_output=True, text=True, timeout=timeout,
            cwd=HERE,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError(f"timeout: {q}")
    txt = out.stdout
    if "TOKEN_EXPIRED" in txt or "TOKEN_MISSING" in txt:
        raise RuntimeError("TOKEN_EXPIRED")
    if "鉴权" in txt or "认证" in txt or "401" in txt or "403" in txt:
        raise RuntimeError("AUTH_ERROR")
    try:
        return json.loads(txt)
    except Exception:
        # 有时脚本会在 JSON 前后打印日志；尝试截取首个 { 到末个 }
        s = txt.find("{")
        e = txt.rfind("}")
        if s >= 0 and e > s:
            return json.loads(txt[s:e + 1])
        raise RuntimeError(f"parse-fail: {q}\n{txt[:300]}")


def query_with_retry(q, timeout=80):
    """带重试：AUTH_ERROR / 超时 退避 5s 重试一次（与 neodata 技能约定一致）。"""
    last = None
    for _ in range(2):
        try:
            return query_neodata(q, timeout)
        except RuntimeError as e:
            last = e
            if "AUTH_ERROR" in str(e) or "timeout" in str(e):
                time.sleep(5)
                continue
            raise
    raise last


def find_content(data):
    """从 neodata 返回里抽取首个 apiRecall 的 content 文本。"""
    try:
        api = data.get("data", {}).get("apiData", {}).get("apiRecall", [])
        if api:
            return api[0].get("content", "")
        # 兜底：宏数据可能在表格里
        return ""
    except Exception:
        return ""


def parse_price_change(content):
    """解析文本格式 '最新价格:VALUE' 与 '当日涨跌幅:X%'（含千分位逗号）。"""
    price = None
    change = None
    m = re.search(r"最新价格[:：]\s*([\d,]+\.?\d*)", content)
    if m:
        price = float(m.group(1).replace(",", ""))
    m = re.search(r"当日涨跌幅[:：]\s*(-?[\d.]+)\s*%", content)
    if m:
        change = float(m.group(1))
    return price, change


def parse_table_price_change(content, keyword):
    """解析期货/表格格式：定位含 keyword 的数据行，取 最新价格 与 昨收盘 计算日涨跌。"""
    price = None
    change = None
    for line in content.splitlines():
        if keyword in line and "|" in line:
            cells = [c.strip() for c in line.split("|")]
            # 列序：商品类型|市场类型|期货名称|证券代码|最新价格|昨收盘|...
            try:
                if len(cells) >= 7:
                    price = float(cells[5].replace(",", ""))
                    prev = float(cells[6].replace(",", ""))
                    if prev:
                        change = round((price - prev) / prev * 100, 2)
            except (ValueError, IndexError):
                pass
            if price is not None:
                break
    return price, change


def parse_extra(content):
    """解析 5日涨跌幅 与 年初至今涨跌幅（指数用）。"""
    extra = {}
    m = re.search(r"5日涨跌幅[:：]\s*(-?[\d.]+)\s*%", content)
    if m:
        extra["w5"] = float(m.group(1))
    m = re.search(r"年初至今涨跌幅[:：]\s*([\d.]+)\s*%", content)
    if m:
        extra["ytd"] = float(m.group(1))
    m = re.search(r"20日涨跌幅[:：]\s*(-?[\d.]+)\s*%", content)
    if m:
        extra["m20"] = float(m.group(1))
    return extra


def parse_macro_value(content):
    """宏观利率表格：取第一行（最新日期）的 数据值。"""
    # 行形如：| ... | % | 4.519489765167236 |
    vals = re.findall(r"\| % \|\s*([\d.]+)\s*\|", content)
    if vals:
        return float(vals[0])
    return None


def load_existing():
    """读取已生成的快照，用于增量补齐（只补缺失项）。"""
    if not os.path.exists(OUT):
        return None
    try:
        with open(OUT, "r", encoding="utf-8") as f:
            txt = f.read()
        s = txt.find("{")
        e = txt.rfind("}")
        if s < 0 or e <= s:
            return None
        return json.loads(txt[s:e + 1])
    except Exception:
        return None


def fetch_snapshot(existing=None):
    existing = existing or {}
    existing_idx = {i.get("key"): i for i in existing.get("indices", [])}
    items = []
    for key, name, code, q in SNAPSHOT_ITEMS:
        # 增量补齐：已有真实数值则复用，降低调用量、避开限流
        prev = existing_idx.get(key)
        if prev and prev.get("value") is not None:
            print(f"  [复用] {name}: 已有数值，跳过")
            items.append(prev)
            continue
        rec = {"key": key, "name": name, "code": code}
        try:
            data = query_with_retry(q)
            content = find_content(data)
            if key == "us10y":
                v = parse_macro_value(content)
                rec["value"] = v
                rec["change"] = None
                rec["unit"] = "%"
                rec["note"] = "2026-06-30 月末值"
            elif key in ("gold", "oil"):
                price, change = parse_table_price_change(
                    content, "伦敦金" if key == "gold" else "WTI原油"
                )
                rec["value"] = price
                rec["change"] = change
                rec["unit"] = "/oz" if key == "gold" else "/bbl"
            else:
                price, change = parse_price_change(content)
                rec["value"] = price
                rec["change"] = change
                extra = parse_extra(content)
                if extra:
                    rec["extra"] = extra
            if rec.get("value") is None:
                print(f"  [WARN] {name}: 未解析到数值", file=sys.stderr)
        except Exception as e:
            print(f"  [ERR] {name}: {e}", file=sys.stderr)
        items.append(rec)
        time.sleep(1.0)
    return items


def fetch_stock_changes(existing=None):
    existing = existing or {}
    changes = dict(existing.get("stockChanges", {}))
    for code, q in STOCK_QUERIES:
        if code in changes and changes[code] is not None:
            continue
        try:
            data = query_with_retry(q)
            content = find_content(data)
            _, change = parse_price_change(content)
            if change is not None:
                changes[code] = round(change, 2)
            else:
                print(f"  [WARN] 个股 {code}: 未解析到涨跌幅", file=sys.stderr)
        except Exception as e:
            print(f"  [ERR] 个股 {code}: {e}", file=sys.stderr)
        time.sleep(1.0)
    return changes


def main():
    existing = load_existing()
    print("== 抓取全球指数 / 宏观快照 ==")
    indices = fetch_snapshot(existing)
    print("== 抓取 A股持仓个股涨跌幅 ==")
    stock_changes = fetch_stock_changes(existing)

    snap = {
        "date": "2026-07-17",
        "source": "NeoData 金融数据（真实行情快照）",
        "indices": indices,
        "stockChanges": stock_changes,
    }

    missing_idx = [i["name"] for i in indices if i.get("value") is None]
    if missing_idx:
        print(f"[WARN] 以下指数/宏观仍未取到数值: {missing_idx}", file=sys.stderr)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅\n")
        f.write(f"// 数据源：{snap['source']}；数据日期：{snap['date']}（美债为 2026-06-30 月末值）\n")
        f.write("// 由 fetch_market_snapshot.py 生成，可接入每日自动化刷新。\n")
        f.write("window.MARKET_SNAPSHOT = " + json.dumps(snap, ensure_ascii=False, indent=2) + ";\n")

    print(f"已写入 {OUT}")
    print(f"指数/宏观条目: {len(indices)}；个股涨跌幅: {len(stock_changes)} 条")


if __name__ == "__main__":
    main()
