#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
由 news_raw.json 生成 js/news_deep.js（window.NEWS_DEEP）：
- 剔除 publishTime 为空 / 链接无效的条目（不可核实）
- 多层去重：同 url、标题相互包含、同类同前缀且同时段
- 清洗正文尾部 boilerplate（文章来源/footer/免责声明）
- 关键词引擎生成「所以呢·市场含义」并映射到站点 25 只基金
- 并入既有 8 条宏观事件（转「宏观政策」类）
输出供网站富文本渲染的深层资讯数据。
"""
import json
import os
import re
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(__file__)
RAW = os.path.join(HERE, "news_raw.json")
OUT = os.path.join(HERE, "js", "news_deep.js")

# ---------- 基金分组（基于 data.js 的 25 只基金描述）----------
NASDAQ = ["513100", "017436", "161128", "161130", "017093", "501312",
          "012920", "006555", "006373", "005698", "016701", "000043", "006751"]
INTERNET_HK = ["001668", "006751", "012920", "270023", "539002", "457001"]
EM_ASIA = ["539002", "457001", "012920", "270023", "017730"]
GLOBAL = ["270023", "012920", "017730", "008253"]
NEV = ["501226", "017145", "017730", "016664"]
A_TECH = ["007349", "007345", "002891"]
OIL_PRESSURE = ["539002", "457001", "270023"]


def clean_content(text):
    if not text:
        return ""
    t = text
    # 截断尾部 boilerplate
    for marker in ["（文章来源", "文章来源：", "郑重声明", "责任编辑：", "<footer>"]:
        idx = t.find(marker)
        if idx > 0:
            t = t[:idx]
    # 去掉 footer 标签块
    t = re.sub(r"<footer>.*?</footer>", "", t, flags=re.S)
    t = re.sub(r"<footer>.*", "", t, flags=re.S)
    # 去掉首尾空白与多余空行
    t = re.sub(r"\n{2,}", "\n", t).strip()
    return t


def hkt(ts):
    dt = datetime.fromtimestamp(int(ts), tz=timezone.utc) + timedelta(hours=8)
    return dt


def gen_insight(title, content, category):
    blob = (title or "") + " " + (content or "")
    funds = set()
    themes = []

    def hit(*kws):
        return any(kw in blob for kw in kws)

    if hit("纳斯达克", "纳指", "美股", "英伟达", "苹果", "微软", "ai", "半导体",
           "云计算", "算力", "科技股", "科网", "互联网", "chatgpt", "大模型"):
        funds.update(NASDAQ)
        if hit("港股", "恒生", "中概", "互联网", "阿里", "腾讯", "美团"):
            funds.update(INTERNET_HK)
        themes.append("美股科技/AI/互联网是本站核心持仓方向")
    if hit("港股", "恒生", "h股", "中概"):
        funds.update(INTERNET_HK)
        themes.append("港股与中概互联网估值处历史低位，南向资金与外资再配置是主要驱动")
    if hit("新兴市场", "亚洲", "印度", "韩国", "东南亚", "台湾半导体"):
        funds.update(EM_ASIA)
        themes.append("新兴市场/亚洲对美元走弱与全球流动性改善敏感，弹性较大")
    if hit("原油", "油价", "霍尔木兹", "美伊", "地缘", "伊朗", "中东"):
        funds.update(OIL_PRESSURE)
        themes.append("地缘冲突推升油价与波动，短期压制全球风险资产与新兴市场；油价持续高位将重燃通胀担忧")
    if hit("美联储", "加息", "利率", "美债", "沃什", "通胀", "cpi", "ppi"):
        funds.update(NASDAQ)
        themes.append("美联储利率路径是科技成长估值的核心变量：加息预期升温压制、维持/降息则缓释")
    if hit("黄金", "贵金属", "白银", "央行购金"):
        themes.append("黄金创历史高位后波动加剧，央行购金与避险提供支撑，但高利率环境构成压制；本站无直接黄金主题基金")
    if hit("房地产", "地产", "楼市", "房价", "土地", "按揭"):
        themes.append("香港/内地地产链仍处调整，但核心城市房价环比回稳、香港土地与楼市回暖释放积极信号；本站无直接地产基金，影响经亚洲/全球消费类间接体现")
    if hit("消费", "内需", "十五五", "扩内需", "零售"):
        funds.update(["457001", "539002", "012920", "270023"])
        themes.append("扩内需与消费刺激政策利好亚洲/全球消费类持仓")
    if hit("新能源", "电动车", "电池", "蔚来", "比亚迪", "特斯拉", "汽车"):
        funds.update(NEV)
        themes.append("新能源车产业链全球竞争加剧，相关主题基金波动大，需关注销量与关税")
    if hit("医药", "创新药", "cxo", "生物"):
        funds.update(["012920", "270023"])
        themes.append("创新药出海与CXO回暖利好全球配置型基金中的医药敞口")
    if hit("人民币", "债券通", "离岸", "潘功胜", "外汇储备"):
        funds.update(["012920", "270023", "539002", "457001"])
        themes.append("香港离岸人民币与债券通扩容改善流动性底层，利好港股与中资资产定价")

    if not themes:
        return "", sorted(funds)
    so_what = "；".join(themes) + "。"
    # 关联基金上限 8
    return so_what, sorted(funds)[:8]


def norm_title(t):
    return re.sub(r"[\s\u3000，。、：:；;,.]", "", t or "").lower()


def main():
    with open(RAW, encoding="utf-8") as f:
        raw = json.load(f)

    kept = []
    seen_url = set()
    seen_norm = {}  # norm_title -> publishTime
    for it in raw:
        url = (it.get("url") or "").strip()
        pub = it.get("publishTime")
        cat = it.get("category")
        title = (it.get("title") or "").strip()
        # 1) 剔除不可核实
        if not pub or url in ("", "gu.qq.com"):
            continue
        # 2) 同 url 去重
        if url in seen_url:
            continue
        # 3) 标题相互包含去重（保留较长）
        nt = norm_title(title)
        dup = False
        for k, (kt, kts) in list(seen_norm.items()):
            if k == nt or k in nt or nt in k:
                # 同一类且时间接近 -> 丢弃较短
                if kt == cat and abs((pub or 0) - (kts or 0)) < 3600:
                    if len(title) <= len(seen_norm[k][0]) if False else True:
                        dup = True
                # 跨类标题也包含则保留更长的（丢弃较短）
                if len(title) < len(kt):
                    dup = True
        if dup:
            continue
        seen_url.add(url)
        seen_norm[nt] = (title, pub)

        dt = hkt(pub)
        summary = clean_content(it.get("content"))
        so_what, funds = gen_insight(title, summary, cat)
        kept.append({
            "category": cat,
            "date": dt.strftime("%Y-%m-%d"),
            "dateCN": dt.strftime("%m月%d日"),
            "time": dt.strftime("%H:%M"),
            "title": title,
            "summary": summary,
            "soWhat": so_what,
            "relatedFunds": funds,
            "source": it.get("source") or "腾讯财经",
            "url": url,
            "sentiment": "neutral",
        })

    # 既有的 8 条宏观事件（转「宏观政策」类，保留原有深度分析与基金映射）
    MACRO = [
        {"title": "美国6月CPI同比回落至3.5%，能源降价带动通胀降温", "date": "2026-07-15",
         "dateCN": "07月15日", "summary": "美国6月CPI同比3.5%（较5月4.2%明显回落），环比-0.4%，核心CPI同比2.57%、环比0.0%。能源价格回落（美伊局势缓和后）是主要拖累项。通胀降温重燃美联储降息预期，美债收益率与美元走弱，长久期科技成长股估值修复动力增强——纳斯达克主题基金（513100、017436、017093、161128）及全球成长基金（012920、270023）受益；新兴市场亦受美元走弱提振（539002、457001）。",
         "relatedFunds": ["513100", "161130", "017436", "017093", "161128", "012920", "270023", "539002"],
         "source": "NeoData 宏观数据库（美国6月CPI，发布 2026-07-14/15）"},
        {"title": "中国6月官方制造业PMI回升至50.3%，重回荣枯线上方", "date": "2026-06-30",
         "dateCN": "06月30日", "summary": "国家统计局6月30日公布：6月制造业PMI 50.3%（前值50.0%，预期50.1%），非制造业PMI 50.2%。美伊局势缓和后能源价格回落，推动前期积压需求释放，新订单指数升至51.2%、新出口订单升至50.1%。制造业回暖利好中国及亚洲科技制造链，对A股科技基金（007349、007345、002891）及亚洲/新兴市场基金（457001、539002）构成基本面支撑。",
         "relatedFunds": ["007349", "007345", "002891", "457001", "539002"],
         "source": "国家统计局（2026-06-30 09:30 发布）；东海/东吴证券6月PMI研报"},
        {"title": "美伊临时和平协议脆弱，霍尔木兹海峡再遭袭、油价反弹", "date": "2026-06-29",
         "dateCN": "06月29日", "summary": "6月下旬美伊冲突再度升级：临时和平协议破裂，霍尔木兹海峡内多艘船只遇袭，美方与伊朗展开打击行动。布伦特原油反弹至约72.44美元/桶、WTI约70.05美元/桶。油价与避险情绪回升压制全球风险资产，重仓新兴市场的基金（539002、457001）及高估值科技成长板块（513100、017436、017093）短期承压；能源供给恢复不及预期则支撑油价中枢。",
         "relatedFunds": ["539002", "457001", "513100", "017436", "017093", "006555", "270023"],
         "source": "腾讯财经/环球市场播报（2026-06-29）"},
        {"title": "美联储6月议息会议（新主席沃什首次主持）：联邦基金利率维持约3.62%", "date": "2026-06-17",
         "dateCN": "06月17日", "summary": "美联储6月议息会议由新任主席凯文·沃什（Kevin Warsh）首次主持。据联邦基金利率日度序列，全月利率稳定在约3.62%。在5月CPI回升至4.2%、欧央行意外加息的背景下，美联储选择按兵不动、观察通胀路径。利率高位企稳对纳斯达克/全球科技成长基金（513100、017436、017093、161128）估值中性偏谨慎，市场将焦点转向后续通胀与就业数据。",
         "relatedFunds": ["513100", "161130", "017436", "017093", "161128", "012920"],
         "source": "NeoData 宏观数据库·联邦基金利率日度序列；美联储6月会议为沃什任内首次FOMC"},
        {"title": "欧洲央行意外加息25bp，近三年来首次加息", "date": "2026-06-11",
         "dateCN": "06月11日", "summary": "6月11日欧洲央行将三大关键利率各上调25bp：存款机制利率2.25%、主要再融资2.40%、边际借贷2.65%，为2023年9月以来首次加息。欧央行表态中东冲突推升通胀压力，并上调今明两年通胀预期。这是年内首家重启加息的主要经济体央行，重新点燃「高利率时代回归」讨论，令美联储「维持高利率更久」预期升温，对全球成长股估值形成压制。",
         "relatedFunds": ["539002", "457001", "270023", "017730", "006555"],
         "source": "金融时报/腾讯财经（2026-06-11）"},
        {"title": "美国5月CPI同比升至4.2%，通胀重回4%上方", "date": "2026-06-10",
         "dateCN": "06月10日", "summary": "美国5月CPI同比4.2%（预期4.2%，前值3.8%），核心CPI同比2.9%，能源CPI同比高达23.5%。通胀超预期回升，直接压制美联储降息空间，并迫使全球央行重新评估「高利率维持更久」。利率预期上行通常利空长久期科技成长股（513100、017436、017093、161128），同时支撑美元与美债收益率。",
         "relatedFunds": ["513100", "161130", "017436", "017093", "161128", "012920"],
         "source": "NeoData 宏观数据库·经济事件日历（发布日 2026-06-10）"},
        {"title": "美伊冲突骤起：美军直升机在霍尔木兹海峡被击落，美方对伊朗实施打击", "date": "2026-06-09",
         "dateCN": "06月09日", "summary": "6月8日美军一架阿帕奇直升机在霍尔木兹海峡被伊朗击落；9日美军中央司令部对伊朗发动自卫性打击。冲突推升原油风险溢价与全球避险情绪，油价与黄金获支撑，权益风险资产承压。重仓全球/新兴市场的基金（539002、457001、270023）受扰动；避险情绪升温通常压制高估值科技成长板块（513100、017436、017093）。",
         "relatedFunds": ["539002", "457001", "270023", "513100", "017436", "017093", "006555"],
         "source": "腾讯财经/环球市场播报（2026-06-11）"},
        {"title": "美国5月非农：私营部门新增12万超预期，失业率持稳4.3%", "date": "2026-06-05",
         "dateCN": "06月05日", "summary": "美国5月就业数据韧性仍强——私营部门新增12万（预期8.5万，前值12.3万），失业率4.3%与前值持平。就业稳健使市场对美联储快速降息的预期降温，但同时强化了「经济软着陆」叙事，对美股科技成长股影响偏中性。重仓美股的纳斯达克/全球科技基金（513100、017436、017093、161128等）后续走势更多取决于通胀与利率路径。",
         "relatedFunds": ["513100", "161130", "017436", "017093", "161128", "270023"],
         "source": "NeoData 宏观数据库·经济事件日历（发布日 2026-06-05）"},
    ]
    for m in MACRO:
        kept.append({
            "category": "宏观政策",
            "date": m["date"],
            "dateCN": m["dateCN"],
            "time": "",
            "title": m["title"],
            "summary": m["summary"],
            "soWhat": "",
            "relatedFunds": m["relatedFunds"],
            "source": m["source"],
            "url": "",
            "sentiment": "neutral",
        })

    # 按日期+时间倒序
    def sort_key(x):
        d = x.get("date", "")
        t = x.get("time") or "00:00"
        return d + " " + t
    kept.sort(key=sort_key, reverse=True)

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("// 每日深度解读 · 真实财经资讯（自动抓取 + 深加工）\n")
        f.write("// 数据来源：腾讯财经 / 财联社 / 新浪财经 等（经 neodata-financial-search 聚合），抓取于 2026-07-18\n")
        f.write("// summary 为新闻原文深度正文；soWhat 为「所以呢·市场含义」解读；relatedFunds 为基于主题的关键词映射（非投资建议）\n")
        f.write("window.NEWS_DEEP = ")
        json.dump(kept, f, ensure_ascii=False, indent=2)
        f.write(";\n")

    print(f"生成 {len(kept)} 条（含 8 条宏观政策事件），写入 {OUT}")
    from collections import Counter
    c = Counter(k["category"] for k in kept)
    for k, v in c.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
