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
const NAV_OUT = path.join(__dirname, 'fund_nav.json');
const BT_OUT = path.join(__dirname, 'backtest.json');

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

// 计算历史序列的技术面数组（用于回测逐日判定）
function RMAarr(a, n) {
  const out = new Array(a.length).fill(null);
  if (a.length < n) return out;
  let s = 0;
  for (let i = 0; i < n; i++) s += a[i];
  out[n - 1] = s / n;
  for (let i = n; i < a.length; i++) out[i] = (a[i] + (n - 1) * out[i - 1]) / n;
  return out;
}

function computeSeries(navs) {
  const n = navs.length;
  const ma = (w) => {
    const a = new Array(n).fill(null);
    let s = 0;
    for (let i = 0; i < n; i++) {
      if (i < w - 1) continue;
      if (i === w - 1) { for (let j = 0; j < w; j++) s += navs[j]; }
      else s += navs[i] - navs[i - w];
      a[i] = s / w;
    }
    return a;
  };
  const ma20 = ma(20), ma60 = ma(60), ma120 = ma(120), ma250 = ma(250);
  // 布林下轨（MA20 ± 2σ）
  const bollLower = new Array(n).fill(null);
  let sb = 0, sb2 = 0;
  for (let i = 0; i < n; i++) {
    if (i < 19) continue;
    if (i === 19) { for (let j = 0; j < 20; j++) { sb += navs[j]; sb2 += navs[j] * navs[j]; } }
    else { sb += navs[i] - navs[i - 20]; sb2 += navs[i] * navs[i] - navs[i - 20] * navs[i - 20]; }
    const mid = sb / 20;
    const v = sb2 / 20 - mid * mid;
    const sd = v > 0 ? Math.sqrt(v) : 0;
    bollLower[i] = mid - 2 * sd;
  }
  // MACD 柱
  const k12 = 2 / 13, k26 = 2 / 27, k9 = 2 / 10;
  let e12 = navs[0], e26 = navs[0];
  const difArr = new Array(n);
  for (let i = 0; i < n; i++) { e12 = navs[i] * k12 + e12 * (1 - k12); e26 = navs[i] * k26 + e26 * (1 - k26); difArr[i] = e12 - e26; }
  const macdHist = new Array(n).fill(null);
  let e9 = null;
  for (let i = 0; i < n; i++) {
    if (i < 8) continue;
    if (i === 8) { let s = 0; for (let j = 0; j < 9; j++) s += difArr[j]; e9 = s / 9; }
    else e9 = difArr[i] * k9 + e9 * (1 - k9);
    macdHist[i] = (difArr[i] - e9) * 2;
  }
  // RSI(6) Wilder
  const rsi6 = new Array(n).fill(null);
  if (n > 6) {
    let g = 0, l = 0;
    for (let i = 1; i <= 6; i++) { const d = navs[i] - navs[i - 1]; if (d >= 0) g += d; else l -= d; }
    rsi6[6] = l === 0 ? 100 : 100 - 100 / (1 + g / l);
    for (let i = 7; i < n; i++) { const d = navs[i] - navs[i - 1]; g = (g * 5 + (d > 0 ? d : 0)) / 6; l = (l * 5 + (d < 0 ? -d : 0)) / 6; rsi6[i] = l === 0 ? 100 : 100 - 100 / (1 + g / l); }
  }
  // ADX(14)
  const adx = new Array(n).fill(null);
  if (n > 15) {
    const tr = new Array(n - 1), pdm = new Array(n - 1), mdm = new Array(n - 1);
    for (let i = 1; i < n; i++) { const c = navs[i] - navs[i - 1]; tr[i - 1] = Math.abs(c); pdm[i - 1] = c > 0 ? c : 0; mdm[i - 1] = c < 0 ? -c : 0; }
    const atr = RMAarr(tr, 14), pdi = RMAarr(pdm, 14), mdi = RMAarr(mdm, 14);
    const dx = new Array(n - 1).fill(null);
    for (let i = 0; i < n - 1; i++) {
      if (atr[i] && atr[i] > 0) { const p = 100 * pdi[i] / atr[i], m = 100 * mdi[i] / atr[i]; dx[i] = (Math.abs(p - m) / (p + m)) * 100; }
    }
    const adxArr = RMAarr(dx, 14);
    for (let i = 0; i < n - 1; i++) adx[i + 1] = adxArr[i];
  }
  return { ma20, ma60, ma120, ma250, macdHist, rsi6, bollLower, adx };
}

// 真实回测：逐日判定短期信号标签，统计该标签出现后未来 H 个交易日的前瞻收益，验证信号含义
// winRate/avgReturnPct 仅统计「可操作的偏多信号」（超卖待反弹 / 偏强），benchmarkWinRate 为全样本前瞻上涨概率
function computeBacktest(results) {
  const valid = results.filter((r) => r.measured && r.navs && r.navs.length >= 250);
  const H = 5; // 前瞻窗口（交易日）
  const SIG_LONGS = ['偏强', '超卖待反弹']; // 可操作的偏多信号
  const labelStats = {};
  const groupAgg = {};
  const G = { longCount: 0, longWins: 0, longSumFwd: 0, allCount: 0, allWins: 0 };
  for (const f of valid) {
    const s = computeSeries(f.navs);
    const ga = groupAgg[f.group] = groupAgg[f.group] || { longCount: 0, longWins: 0, longSumFwd: 0 };
    for (let i = 30; i < f.navs.length - H; i++) {
      if (s.ma20[i] == null || s.macdHist[i] == null || s.rsi6[i] == null || s.bollLower[i] == null || s.adx[i] == null) continue;
      const lab = computeTrendSignal({ close: f.navs[i], ma20: s.ma20[i], ma250: s.ma250[i], macd: s.macdHist[i], rsi6: s.rsi6[i], bollLower: s.bollLower[i], adx: s.adx[i] }).shortTerm;
      const fwd = f.navs[i + H] / f.navs[i] - 1;
      labelStats[lab] = labelStats[lab] || { count: 0, sumFwd: 0, wins: 0 };
      labelStats[lab].count++; labelStats[lab].sumFwd += fwd; if (fwd > 0) labelStats[lab].wins++;
      G.allCount++; if (fwd > 0) G.allWins++;
      if (SIG_LONGS.includes(lab)) {
        G.longCount++; if (fwd > 0) G.longWins++; G.longSumFwd += fwd;
        ga.longCount++; if (fwd > 0) ga.longWins++; ga.longSumFwd += fwd;
      }
    }
  }
  const bySignalForward = Object.keys(labelStats).map((lab) => ({
    signal: lab,
    count: labelStats[lab].count,
    avgFwdReturnPct: +(labelStats[lab].sumFwd / labelStats[lab].count * 100).toFixed(2),
    winRate: labelStats[lab].wins / labelStats[lab].count
  }));
  const byGroup = Object.keys(groupAgg).map((g) => {
    const a = groupAgg[g];
    return {
      group: g, name: GROUP_META[g].name,
      sampleSignals: a.longCount,
      winRate: a.longCount ? a.longWins / a.longCount : 0,
      avgReturnPct: a.longCount ? +(a.longSumFwd / a.longCount * 100).toFixed(2) : 0
    };
  });
  const summary = {
    signalName: '短期信号前瞻验证',
    holdDays: H,
    sampleSignals: G.longCount,
    winRate: G.longCount ? G.longWins / G.longCount : 0,
    avgReturnPct: G.longCount ? +(G.longSumFwd / G.longCount * 100).toFixed(2) : 0,
    benchmarkWinRate: G.allCount ? G.allWins / G.allCount : 0,
    bySignalForward,
    validFunds: valid.length
  };
  if (process.env.DEBUG_BT) {
    const labCounts = {};
    for (const k of Object.keys(labelStats)) labCounts[k] = labelStats[k].count;
    console.error('[debug-bt] labelCounts=', labCounts, ' G=', JSON.stringify(G), ' validFunds=', valid.length);
  }
  return { summary, byGroup };
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
async function fetchNavSeries(code, target = 400) {
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
        dates, navs,
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

  // ── 净值曲线数据（真实） ──
  const navResults = results
    .filter((r) => r.measured && r.navs && r.navs.length >= 5)
    .map((r) => ({ code: r.code, name: r.name, group: r.group, dates: r.dates, nav: r.navs }));
  const navOut = {
    meta: {
      asOf,
      isDemo: false,
      source: '天天基金 F10 净值历史（api.fund.eastmoney.com），累计净值 LJJZ',
      note: '真实净值序列，直接用于净值曲线与多基金对比；QDII 有 T+1/T+2 披露延迟',
      generatedBy: 'pipeline.js v2 (real NAV)'
    },
    series: navResults
  };
  fs.writeFileSync(NAV_OUT, JSON.stringify(navOut, null, 2));

  // ── 回测数据（真实，基于历史净值的趋势跟随日频信号方向命中率） ──
  const backtest = computeBacktest(results);
  backtest.asOf = asOf;
  backtest.strategy = '逐日判定短期信号标签，统计该标签出现后未来 5 个交易日(forward 5d)的累计收益，验证信号的前瞻含义；winRate/avgReturnPct 仅统计可操作的偏多信号（超卖待反弹/偏强），benchmarkWinRate 为全样本前瞻上涨概率';
  backtest.note = '基于各基金真实历史净值的信号前瞻收益回测，含过拟合/幸存偏差与样本区间风险，不代表未来';
  backtest.disclaimer = '回测为技术信号的历史模拟，非未来收益保证，不构成投资建议';
  fs.writeFileSync(BT_OUT, JSON.stringify(backtest, null, 2));

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
  console.log(`[pipeline] 已写出 ${NAV_OUT}（真实净值序列 ${navResults.length} 只）`);
  console.log(`[pipeline] 已写出 ${BT_OUT}（回测命中率 ${(backtest.summary.winRate * 100).toFixed(1)}%，样本 ${backtest.summary.sampleSignals}，有效基金 ${backtest.summary.validFunds}）`);

  if (process.env.GH_TOKEN && process.env.AUTO_COMMIT) {
    try {
      require('child_process').execFileSync('bash', ['-c', `git add fund_signals.json fund_nav.json backtest.json && git commit -m "chore: daily signal update ${asOf}" && git push`], { stdio: 'inherit' });
    } catch (e) { console.warn('[pipeline] 提交失败：', e.message); }
  }
}

// 读取上一版组信号用于整组失败降级
let prevGroups = {};
try { prevGroups = JSON.parse(fs.readFileSync(OUT, 'utf8')).groups || {}; } catch {}

main().catch((e) => { console.error('[pipeline] 致命错误:', e); process.exit(1); });
