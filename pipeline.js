#!/usr/bin/env node
/**
 * 每日数据管线 v2：拉取每只基金真实净值（天天基金公开接口）→ 计算技术面趋势信号 → 写出 fund_signals.json
 *
 * 运行方式（本地）：
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 node pipeline.js      # 沙箱需绕过 TLS 拦截
 *   node pipeline.js                                     # 正常环境（含 GitHub Actions）
 *
 * 在 CI（GitHub Actions）中由 .github/workflows/daily-update.yml 定时触发，
 * 需要仓库 Secret GITHUB_TOKEN（workflow 已用 secrets.GITHUB_TOKEN 自动提供），
 * 由 workflow 的 git add/commit/push 步骤负责提交。
 *
 * 数据源：天天基金 F10 净值历史接口（api.fund.eastmoney.com/f10/lsjz），公开、无需鉴权，
 *         仅需带 Referer 头。每只基金用「累计净值 LJJZ」作为连续价格序列计算技术指标。
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'fund_signals.json');

// ───────────────────────────── 基金映射 ─────────────────────────────
// 组元数据（risk 为该组风险基线，真实风险会在每只基金上按回撤/波动微调）
const GROUP_META = {
  G1: { name: '纳指100/美股成长', driver: '纳斯达克100', risk: '中低' },
  G2: { name: '信息科技/半导体/AI', driver: '标普信息科技/费城半导体', risk: '高' },
  G3: { name: '全球新能源车', driver: '海外新能源车产业链', risk: '中' },
  G4: { name: 'A股科创主题', driver: '科创板/创业板', risk: '中' },
  G5: { name: '新兴/亚洲/混合', driver: 'MSCI 新兴/亚洲股', risk: '中' }
};

const FUND_GROUP = {
  '513100': 'G1', '017436': 'G1', '000043': 'G1', '161130': 'G1', '017093': 'G1',
  '006555': 'G2', '017730': 'G2', '161128': 'G2', '012920': 'G2', '006373': 'G2',
  '001668': 'G2', '005698': 'G2', '002891': 'G2', '016701': 'G2', '501312': 'G2', '006751': 'G2',
  '501226': 'G3', '017145': 'G3',
  '007349': 'G4', '007345': 'G4',
  '270023': 'G5', '539002': 'G5', '008253': 'G5', '016664': 'G5', '457001': 'G5'
};
const FUND_NAME = {
  '513100': '纳斯达克100ETF', '017436': '华宝纳斯达克精选', '000043': '嘉实美国成长', '161130': '易方达纳斯达克100', '017093': '景顺长城纳斯达克科技',
  '006555': '浦银安盛全球智能科技', '017730': '嘉实全球产业升级', '161128': '易方达标普信息科技', '012920': '易方达全球成长精选', '006373': '国富全球科技',
  '001668': '汇添富全球移动互联', '005698': '华夏全球科技先锋', '002891': '华夏移动互联', '016701': '银华海外数字经济', '501312': '华宝海外科技', '006751': '富国全球科技互联网',
  '501226': '长城全球新能源车', '017145': '华宝海外新能源汽车',
  '007349': '华夏科技创新A', '007345': '富国科技创新A',
  '270023': '广发全球精选', '539002': '建信新兴市场混合', '008253': '华宝致远混合', '016664': '天弘全球高端制造', '457001': '国富亚洲机会'
};

// ───────────────────────────── 技术指标库 ─────────────────────────────
const SMA = (a, n) => (a.length < n ? null : a.slice(a.length - n).reduce((s, v) => s + v, 0) / n);

function EMA(a, n) {
  if (a.length < n) return null;
  const k = 2 / (n + 1);
  let e = a.slice(0, n).reduce((s, v) => s + v, 0) / n;
  for (let i = n; i < a.length; i++) e = a[i] * k + e * (1 - k);
  return e;
}
// Wilder 平滑（RMA）
function RMA(a, n) {
  if (a.length < n) return null;
  let s = a.slice(0, n).reduce((x, v) => x + v, 0) / n;
  for (let i = n; i < a.length; i++) s = (s * (n - 1) + a[i]) / n;
  return s;
}

function MACD(closes) {
  const ema12 = EMA(closes, 12), ema26 = EMA(closes, 26);
  if (ema12 == null || ema26 == null) return { dif: null, dea: null, hist: null };
  const dif = ema12 - ema26;
  // DEA = DIF 的 9 日 EMA
  const difSeries = [];
  for (let i = 0; i < closes.length; i++) {
    const e12 = EMA(closes.slice(0, i + 1), 12);
    const e26 = EMA(closes.slice(0, i + 1), 26);
    if (e12 != null && e26 != null) difSeries.push(e12 - e26);
  }
  const dea = EMA(difSeries, 9);
  const hist = (difSeries.length && dea != null) ? (dif - dea) * 2 : null;
  return { dif, dea, hist };
}

function RSI(closes, n = 6) {
  if (closes.length <= n) return 50;
  let gain = 0, loss = 0;
  for (let i = closes.length - n; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d; else loss -= d;
  }
  if (loss === 0) return 100;
  const rs = gain / loss;
  return 100 - 100 / (1 + rs);
}

function BOLL(closes, n = 20, k = 2) {
  if (closes.length < n) return { mid: null, upper: null, lower: null };
  const slice = closes.slice(closes.length - n);
  const mid = slice.reduce((s, v) => s + v, 0) / n;
  const variance = slice.reduce((s, v) => s + (v - mid) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  return { mid, upper: mid + k * sd, lower: mid - k * sd };
}

// close-only 近似 ADX（用相邻净值变动构造 ±DM / TR），14 日
function ADX(closes, n = 14) {
  if (closes.length < n + 2) return 50; // 数据不足给中性值
  const tr = [], pdm = [], mdm = [];
  for (let i = 1; i < closes.length; i++) {
    const chg = closes[i] - closes[i - 1];
    tr.push(Math.abs(chg));
    pdm.push(chg > 0 ? chg : 0);
    mdm.push(chg < 0 ? -chg : 0);
  }
  let atr = RMA(tr, n), pdi = RMA(pdm, n), mdi = RMA(mdm, n);
  if (atr == null || pdi == null || mdi == null || atr === 0) return 50;
  const plusDI = (pdi / atr) * 100, minusDI = (mdi / atr) * 100;
  const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100;
  // DX 序列再做 RMA 平滑得 ADX（用尾部 n 个 DX 近似）
  const dxArr = [];
  for (let i = n; i < tr.length; i++) {
    const a = RMA(tr.slice(0, i + 1), n), p = RMA(pdm.slice(0, i + 1), n), m = RMA(mdm.slice(0, i + 1), n);
    if (a && a > 0) { const pd = (p / a) * 100, md = (m / a) * 100; dxArr.push((Math.abs(pd - md) / (pd + md)) * 100); }
  }
  const adx = RMA(dxArr, n);
  return adx == null ? 50 : adx;
}

function MAX_DRAWDOWN(equity) {
  let peak = equity[0], mdd = 0;
  for (const v of equity) {
    if (v > peak) peak = v;
    const d = (v / peak - 1) * 100;
    if (d < mdd) mdd = d;
  }
  return mdd;
}

function ANNUAL_VOL(closes) {
  const rets = [];
  for (let i = 1; i < closes.length; i++) rets.push(closes[i] / closes[i - 1] - 1);
  if (rets.length < 2) return 0;
  const mean = rets.reduce((s, v) => s + v, 0) / rets.length;
  const variance = rets.reduce((s, v) => s + (v - mean) ** 2, 0) / rets.length;
  return Math.sqrt(variance) * Math.sqrt(242) * 100;
}

// ───────────────────────────── 信号判定 ─────────────────────────────
function computeTrendSignal(t) {
  const oversold = t.rsi6 < 35 && t.close <= t.bollLower;
  const belowShort = t.close < t.ma20 && t.macd < 0;
  const strongTrend = t.adx > 25;
  let shortTerm, sScore;
  if (oversold && !strongTrend) { shortTerm = '超卖待反弹'; sScore = 38; }
  else if (oversold && strongTrend) { shortTerm = '超卖但趋势强'; sScore = 30; }
  else if (!belowShort && t.macd > 0) { shortTerm = '偏强'; sScore = 70; }
  else { shortTerm = '弱势下行'; sScore = 30; }
  let midTerm, mScore;
  if (t.ma250 != null && t.close > t.ma250 && t.close > t.ma120) { midTerm = '长牛结构未破'; mScore = 80; }
  else if (t.ma250 != null && t.close > t.ma250) { midTerm = '中性'; mScore = 55; }
  else if (t.ma250 == null) { midTerm = '数据不足·中性'; mScore = 55; }
  else { midTerm = '趋势转弱'; mScore = 35; }
  return { shortTerm, sScore, midTerm, mScore };
}

function shortLabel(score) {
  if (score >= 65) return '偏强';
  if (score >= 50) return '中性偏多';
  if (score >= 40) return '超卖待反弹';
  return '超卖但趋势强';
}
function midLabel(score) {
  if (score >= 75) return '长牛结构未破';
  if (score >= 60) return '中性';
  if (score >= 45) return '中性偏弱';
  return '趋势转弱';
}
function riskFromStats(dd, vol, baseRisk) {
  if (dd == null) return baseRisk;
  if (dd <= -40 || vol >= 35) return '高';
  if (dd <= -22 || vol >= 24) return baseRisk === '高' ? '高' : '中';
  return baseRisk === '高' ? '中' : '中低';
}

// ───────────────────────────── 数据拉取 ─────────────────────────────
async function getJSON(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { reject(new Error('parse: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
  });
}

// 分页拉取某基金净值序列，目标累计 target 条；返回升序 {dates[], navs[]}（navs 用累计净值）
async function fetchNavSeries(code, target = 260) {
  const hdrs = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://fundf10.eastmoney.com/', 'Accept': 'application/json' };
  const dates = [], navs = [];
  let page = 1;
  const PAGE = 20; // 天天基金接口每页实际返回上限约 20 条（pageSize 参数被忽略）
  while (dates.length < target && page <= 40) {
    const url = `https://api.fund.eastmoney.com/f10/lsjz?fundCode=${code}&pageIndex=${page}&pageSize=${PAGE}`;
    let list = [];
    try { list = (await getJSON(url, hdrs)).Data?.LSJZList || []; }
    catch (e) { console.warn(`  [${code}] 第${page}页失败:`, e.message); break; }
    if (!list.length) break;
    for (const r of list) {
      const nav = parseFloat(r.LJJZ);
      if (isNaN(nav)) continue;
      dates.push(r.FSRQ); navs.push(nav);
    }
    if (list.length < PAGE) break; // 到底
    page++;
    await new Promise((r) => setTimeout(r, 120)); // 轻量限速，避免触发风控
  }
  // 接口返回降序（最新在前），反转成升序（最旧在前）
  dates.reverse(); navs.reverse();
  return { dates, navs };
}

// 并发池
async function pool(items, worker, size = 4) {
  const out = new Array(items.length);
  let i = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await worker(items[idx]); } catch (e) { out[idx] = { error: e.message }; }
    }
  });
  await Promise.all(runners);
  return out;
}

// ───────────────────────────── 主流程 ─────────────────────────────
async function main() {
  const asOf = new Date().toISOString().slice(0, 10);
  const codes = Object.keys(FUND_GROUP);
  console.log(`[pipeline] 开始拉取 ${codes.length} 只基金真实净值（天天基金接口）…`);

  const results = await pool(codes, async (code) => {
    const g = FUND_GROUP[code];
    try {
      const { dates, navs } = await fetchNavSeries(code);
      if (navs.length < 5) throw new Error('净值条数不足(' + navs.length + ')');
      const close = navs[navs.length - 1];
      const ma20 = SMA(navs, 20), ma60 = SMA(navs, 60), ma120 = SMA(navs, 120), ma250 = SMA(navs, 250);
      const { dif, dea, hist } = MACD(navs);
      const macd = hist != null ? hist : (dif != null && dea != null ? dif - dea : 0);
      const rsi6 = RSI(navs, 6);
      const boll = BOLL(navs, 20, 2);
      const adx = ADX(navs, 14);
      const sig = computeTrendSignal({ close, ma20, ma60, ma120, ma250, macd, rsi6, bollLower: boll.lower, adx });
      const ret30 = navs.length > 30 ? (close / navs[navs.length - 31] - 1) * 100 : (close / navs[0] - 1) * 100;
      const dd = MAX_DRAWDOWN(navs);
      const vol = ANNUAL_VOL(navs);
      const risk = riskFromStats(dd, vol, GROUP_META[g].risk);
      return {
        code, name: FUND_NAME[code], group: g, measured: true,
        shortLabel: sig.shortTerm, shortScore: sig.sScore,
        midLabel: sig.midTerm, midScore: sig.mScore,
        risk,
        nav: close, navDate: dates[dates.length - 1],
        ret30: +ret30.toFixed(2), drawdown: +dd.toFixed(2), annualVol: +vol.toFixed(1),
        note: `实测：真实净值 ${close}@${dates[dates.length - 1]}，RSI6=${rsi6.toFixed(1)}，MA250${ma250 != null ? '上方' : '数据不足'}`
      };
    } catch (e) {
      console.warn(`  [${code}] 拉取/计算失败，降级继承组:`, e.message);
      return { code, name: FUND_NAME[code], group: g, error: e.message };
    }
  }, 4);

  // 聚合组信号（成功基金取均值 + 标签由分数推导；失败基金先占位，最后用组均值回填）
  const groups = {};
  for (const g of Object.keys(GROUP_META)) {
    const members = results.filter((r) => r.group === g && r.measured);
    const failed = results.filter((r) => r.group === g && !r.measured);
    let shortScore, midScore, risk;
    if (members.length) {
      shortScore = Math.round(members.reduce((s, r) => s + r.shortScore, 0) / members.length);
      midScore = Math.round(members.reduce((s, r) => s + r.midScore, 0) / members.length);
      const risks = members.map((r) => r.risk);
      risk = risks.includes('高') ? '高' : risks.includes('中') ? '中' : '中低';
    } else {
      // 整组失败：用上一版文件值（若有）
      shortScore = prevGroups[g]?.shortScore ?? 50;
      midScore = prevGroups[g]?.midScore ?? 50;
      risk = GROUP_META[g].risk;
    }
    groups[g] = {
      name: GROUP_META[g].name, driver: GROUP_META[g].driver,
      shortLabel: shortLabel(shortScore), shortScore,
      midLabel: midLabel(midScore), midScore, risk
    };
    // 回填失败基金
    for (const f of failed) {
      f.measured = false;
      f.shortLabel = groups[g].shortLabel; f.shortScore = groups[g].shortScore;
      f.midLabel = groups[g].midLabel; f.midScore = groups[g].midScore;
      f.risk = groups[g].risk;
      f.note = `继承${g}（真实净值拉取失败：${f.error}）`;
      f.nav = null; f.navDate = null; f.ret30 = null; f.drawdown = null; f.annualVol = null;
    }
  }

  const funds = results.map((r) => ({
    code: r.code, name: r.name, group: r.group, measured: r.measured,
    shortLabel: r.shortLabel, shortScore: r.shortScore,
    midLabel: r.midLabel, midScore: r.midScore, risk: r.risk, note: r.note,
    ...(r.measured ? { nav: r.nav, navDate: r.navDate, ret30: r.ret30, drawdown: r.drawdown, annualVol: r.annualVol } : {})
  }));

  const result = {
    meta: {
      asOf,
      source: '天天基金 F10 净值历史（api.fund.eastmoney.com），基于累计净值 LJJZ 计算技术面',
      scale: 'shortScore/midScore 0-100，越高越偏多/越健康',
      disclaimer: '信号为技术面趋势标签，非买卖建议；QDII 基金净值有 T+1/T+2 披露延迟',
      generatedBy: 'pipeline.js v2 (real NAV)'
    },
    groups, funds
  };
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  const ok = funds.filter((f) => f.measured).length;
  console.log(`[pipeline] 已写出 ${OUT}（asOf=${asOf}, ${funds.length} 只基金，真实测算 ${ok} 只，继承 ${funds.length - ok} 只）`);

  if (process.env.GH_TOKEN && process.env.AUTO_COMMIT) {
    try {
      require('child_process').execFileSync('bash', ['-c', `git add fund_signals.json && git commit -m "chore: daily signal update ${asOf}" && git push`], { stdio: 'inherit' });
    } catch (e) { console.warn('[pipeline] 提交失败：', e.message); }
  }
}

// 读取上一版组信号用于整组失败降级
let prevGroups = {};
try { prevGroups = JSON.parse(fs.readFileSync(OUT, 'utf8')).groups || {}; } catch {}

main().catch((e) => { console.error('[pipeline] 致命错误:', e); process.exit(1); });
