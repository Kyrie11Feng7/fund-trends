# -*- coding: utf-8 -*-
# 抓取真实市场快照：全球指数 + 宏观（黄金/原油/美债） + 各基金 A股持仓个股真实涨跌幅
# 数据源：腾讯财经 qt.gtimg.cn（免 token，公开接口，GitHub Actions 云端可直连，无需本机 NeoData）
# 输出：js/market_snapshot.js  ->  window.MARKET_SNAPSHOT { date, source, indices[], stockChanges{} }
#
# 用法：
#   python fetch_market_snapshot.py
# 已接入每日自动化（仓库 .github/workflows/daily-update.yml 调用）。
import urllib.request
import json
import os
import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'js', 'market_snapshot.js')

UA = {'User-Agent': 'Mozilla/5.0', 'Referer': 'https://gu.qq.com/'}

SNAPSHOT_ITEMS = [
    ('ndx',    '纳斯达克100', 'usNDX',    'idx'),
    ('ixic',   '纳斯达克综合', 'usIXIC',   'idx'),
    ('spx',    '标普500',     'usINX',    'idx'),
    ('hstech', '恒生科技',    'hkHSTECH', 'idx'),
    ('gold',   '伦敦金',      'hf_GC',    'macro'),
    ('oil',    'WTI原油',     'hf_CL',    'macro'),
    ('us10y',  '美债10年',    'US10Y',    'us10y'),
]

STOCK_QUERIES = [
    ('300308', '中际旭创'), ('300502', '新易盛'), ('688498', '源杰科技'),
    ('688256', '寒武纪'),   ('002384', '东山精密'), ('300476', '胜宏科技'),
    ('002463', '沪电股份'), ('300394', '天孚通信'), ('688019', '安集科技'),
    ('603929', '亚翔集成'), ('603308', '应流股份'), ('688041', '海光信息'),
    ('688361', '中科飞测'), ('600183', '生益科技'), ('002371', '北方华创'),
    ('002916', '深南电路'), ('002475', '立讯精密'), ('688205', '德科立'),
    ('600330', '天通股份'),
]


def http_get(url, timeout=20):
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req, timeout=timeout).read().decode('utf-8', 'ignore')


def fetch_gtimg(symbol):
    raw = http_get('https://qt.gtimg.cn/q=' + symbol)
    try:
        raw = raw.encode('latin1').decode('gbk')
    except Exception:
        pass
    return raw


def extract_payload(raw):
    i = raw.find('"')
    j = raw.rfind('"')
    if i != -1 and j > i:
        return raw[i + 1:j]
    return ''


def parse_idx(symbol):
    payload = extract_payload(fetch_gtimg(symbol))
    if not payload:
        return None
    parts = payload.split('~')
    if len(parts) < 6:
        return None
    try:
        cur = float(parts[3])
        prev = float(parts[4])
    except ValueError:
        return None
    chg = round((cur - prev) / prev * 100, 2) if prev else None
    return cur, chg


def parse_macro(symbol):
    payload = extract_payload(fetch_gtimg(symbol))
    if not payload:
        return None
    parts = payload.split(',')
    if len(parts) < 2:
        return None
    try:
        cur = float(parts[0])
        chg = float(parts[1])
    except ValueError:
        return None
    return cur, chg


def fetch_us10y():
    url = ('https://datacenter.eastmoney.com/securities/api/data/v1/get'
           '?reportName=RPTA_WEB_BONDS_TREASURY&columns=ALL'
           '&filter=(marketCode=%22US%22)&pageSize=20'
           '&sortColumns=PUBLISHDATE&sortTypes=-1&source=WEB')
    try:
        data = json.loads(http_get(url))
        rows = data.get('result', {}).get('data', [])
        for r in rows:
            label = str(r.get('BONDTYPE', '')) + str(r.get('TIME', ''))
            if '10' in label:
                val = r.get('YIELD') or r.get('CURRENTYIELD') or r.get('VALUE')
                if val not in (None, ''):
                    return float(val), str(r.get('PUBLISHDATE', ''))[:10]
    except Exception:
        return None
    return None


def main():
    indices = []
    for key, name, sym, kind in SNAPSHOT_ITEMS:
        rec = {'key': key, 'name': name, 'code': sym}
        if kind == 'idx':
            r = parse_idx(sym)
            if r:
                cur, chg = r
                rec['value'] = cur
                rec['change'] = chg
            else:
                rec['value'] = None
                rec['change'] = None
        elif kind == 'macro':
            r = parse_macro(sym)
            if r:
                cur, chg = r
                rec['value'] = cur
                rec['change'] = chg
                rec['unit'] = '/oz' if key == 'gold' else '/bbl'
            else:
                rec['value'] = None
                rec['change'] = None
                rec['unit'] = '/oz' if key == 'gold' else '/bbl'
        elif kind == 'us10y':
            r = fetch_us10y()
            rec['unit'] = '%'
            if r and r[0] is not None:
                rec['value'] = r[0]
                rec['change'] = None
                rec['note'] = (r[1] or '') + ' 值'
            else:
                rec['value'] = None
                rec['change'] = None
                rec['note'] = '暂未获取'
        indices.append(rec)

    stock_changes = {}
    for code, _name in STOCK_QUERIES:
        sym = ('sh' if code.startswith('6') else 'sz') + code
        r = parse_idx(sym)
        if r and r[1] is not None:
            stock_changes[code] = r[1]

    snap_date = datetime.date.today().strftime('%Y-%m-%d')

    valid = sum(1 for it in indices if it.get('value') is not None)
    if valid < 4 or not stock_changes:
        print('⚠️ 行情源返回数据不足（有效指数 %d / %d，个股 %d），保留上一份快照，本次不覆盖。' % (valid, len(indices), len(stock_changes)))
        raise SystemExit(3)

    out = {
        'date': snap_date,
        'source': '腾讯财经行情快照（实时）',
        'indices': indices,
        'stockChanges': stock_changes,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('// 市场快照：全球指数 / 宏观 / A股持仓个股真实涨跌幅\n')
        f.write('// 数据源：腾讯财经行情快照（实时）；数据日期：%s\n' % snap_date)
        f.write('// 由 fetch_market_snapshot.py 生成，接入 GitHub Actions 每日自动刷新。\n')
        f.write('window.MARKET_SNAPSHOT = ')
        f.write(json.dumps(out, ensure_ascii=False, indent=2))
        f.write(';\n')
    print('✅ 已生成 %s | 快照日期 %s | 指数 %d 项 | 个股 %d 只' % (OUT, snap_date, len(indices), len(stock_changes)))


if __name__ == '__main__':
    main()
