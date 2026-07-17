#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
抓取「每日深度解读」原始资讯：按五个维度（港股/国际/内地/地产/金融市场）调 neodata 自然语言查询，
解析 docData.docRecall -> docList，提取 标题/全文/发布时间/来源/原文链接，做时间窗口过滤与去重，
落盘为 news_raw.json，供后续深加工（写深度摘要 + 所以呢 + 关联基金）。

依赖：neodata-financial-search 技能的 scripts/query.py（自动管理凭证缓存）。
"""
import subprocess
import json
import os
import sys
from datetime import datetime, timedelta

NEODATA_DIR = r"D:\workbuddy\resources\app.asar.unpacked\resources\builtin-skills\neodata-financial-search"
PY = r"C:\Users\26355\.workbuddy\binaries\python\versions\3.13.12\python.exe"
OUT = os.path.join(os.path.dirname(__file__), "news_raw.json")

# 时间窗口（HKT = UTC+8）
WIN_START = datetime(2026, 7, 12, 0, 0)   # 2026-07-12 00:00 HKT
WIN_END = datetime(2026, 7, 18, 23, 59)   # 2026-07-18 23:59 HKT

# 五个维度查询
DIMENSIONS = [
    ("港股", "2026年7月12日至7月18日 港股市场 重要财经新闻 个股异动 板块动态"),
    ("国际", "2026年7月12日至7月18日 国际财经 全球宏观 央行政策 地缘政治 重要新闻"),
    ("内地", "2026年7月12日至7月18日 中国内地财经 经济政策 行业动态 资本市场 重要新闻"),
    ("地产", "2026年7月12日至7月18日 香港及内地房地产市场 政策 重要新闻"),
    ("金融市场", "2026年7月12日至7月18日 金融市场 大宗商品 外汇 债券 黄金 原油 重要新闻"),
]

# url host -> 来源名
HOST_MAP = {
    "gu.qq.com": "腾讯财经",
    "finance.qq.com": "腾讯财经",
    "news.qq.com": "腾讯财经",
    "finance.sina.com.cn": "新浪财经",
    "finance.eastmoney.com": "东方财富",
    "www.cls.cn": "财联社",
    "www.yicai.com": "第一财经",
    "www.stcn.com": "证券时报",
    "www.cs.com.cn": "中国证券报",
    "www.cnstock.com": "上海证券报",
    "www.21jingji.com": "21世纪经济报道",
    "www.thepaper.cn": "澎湃新闻",
    "www.gov.cn": "中国政府网",
    "www.pbc.gov.cn": "人民银行",
    "www.safe.gov.cn": "外汇局",
}


def host_of(url):
    try:
        from urllib.parse import urlparse
        return urlparse(url).netloc.lower()
    except Exception:
        return ""


def source_of(url, item_type):
    h = host_of(url)
    for k, v in HOST_MAP.items():
        if h.endswith(k):
            return v
    if h:
        return h
    return item_type or "综合消息"


def query_one(q):
    try:
        p = subprocess.run(
            [PY, "scripts/query.py", "--query", q],
            cwd=NEODATA_DIR, capture_output=True, text=True, timeout=120,
        )
    except subprocess.TimeoutExpired:
        return None
    out = p.stdout.strip()
    if not out:
        return None
    try:
        return json.loads(out)
    except Exception:
        # 有时前面会带非 JSON 行，尝试截取首个 { 起
        idx = out.find("{")
        if idx >= 0:
            try:
                return json.loads(out[idx:])
            except Exception:
                return None
    return None


def norm_title(t):
    return (t or "").strip().lower().replace(" ", "").replace("，", ",").replace("。", ".")


def main():
    collected = []  # {category,title,content,publishTime,source,url}
    seen = set()
    stats = {}

    for cat, q in DIMENSIONS:
        data = query_one(q)
        n_doc = 0
        if not data:
            stats[cat] = "查询无返回"
            continue
        doc_data = (data.get("data") or {}).get("docData") or {}
        recalls = doc_data.get("docRecall") or []
        for grp in recalls:
            for it in (grp.get("docList") or []):
                title = (it.get("title") or "").strip()
                content = (it.get("content") or "").strip()
                url = (it.get("url") or "").strip()
                pub = it.get("publishTime")
                if not title or not content:
                    continue
                # 去重（标题归一化）
                key = norm_title(title)
                if key in seen:
                    continue
                # 时间过滤（publishTime 为 unix 秒）
                if pub:
                    try:
                        ts = int(pub)
                        dt_utc = datetime.utcfromtimestamp(ts)
                        dt_hkt = dt_utc + timedelta(hours=8)
                        if dt_hkt < WIN_START or dt_hkt > WIN_END:
                            continue
                    except Exception:
                        pass
                seen.add(key)
                collected.append({
                    "category": cat,
                    "title": title,
                    "content": content,
                    "publishTime": pub,
                    "source": source_of(url, it.get("type")),
                    "url": url,
                })
                n_doc += 1
        stats[cat] = f"{n_doc} 条"

    # 按发布时间倒序
    def sort_key(x):
        try:
            return int(x.get("publishTime") or 0)
        except Exception:
            return 0
    collected.sort(key=sort_key, reverse=True)

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(collected, f, ensure_ascii=False, indent=2)

    print("=== 抓取统计 ===")
    for k, v in stats.items():
        print(f"  {k}: {v}")
    print(f"去重后共 {len(collected)} 条，时间窗 {WIN_START.date()} ~ {WIN_END.date()}")
    print(f"已写入 {OUT}")


if __name__ == "__main__":
    main()
