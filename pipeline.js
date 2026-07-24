#!/usr/bin/env node
/**
 * 每日数据管线 v2：拉取每只基金真实净值（天天基金公开接口）→ 计算技术面趋势信号 → 写出 fund_signals.json
 *
 * 运行方式（本地）：
 *   INSECURE_TLS=1 node pipeline.js                    # 仅沙箱代理拦截 TLS 时需显式开启；生产/CI 默认开启校验
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

// 默认开启 TLS 证书校验（生产 / CI 安全基线）。
// 仅当显式设置 INSECURE_TLS=1 时（沙箱代理会拦截 TLS）才临时关闭，并打出告警。
if (process.env.INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('[pipeline] ⚠️ 已按 INSECURE_TLS=1 关闭 TLS 校验（仅限沙箱代理，生产环境请勿使用）');
}

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
  G5: { name: '新兴/亚洲/混合', driver: 'MSCI 新兴/亚洲股', risk: '中' },
  // 拓宽覆盖（P2-5）：宽基 / 债券 / 黄金
  G6: { name: '宽基指数', driver: '沪深300/中证500/创业板', risk: '中低' },
  G7: { name: '债券', driver: '中债国债', risk: '低' },
  G8: { name: '黄金', driver: '国内黄金现货', risk: '中' }
};

// ───────────────────────────── 拓宽覆盖的新基金（P2-5） ─────────────────────────────
const EXTRA_FUNDS = {
  '510300': { group: 'G6', name: '华泰柏瑞沪深300ETF', enName: 'Huatai-PB CSI300 ETF', type: '宽基指数型', manager: '华泰柏瑞基金', track: '沪深300指数', inception: '2012-05-04' },
  '510500': { group: 'G6', name: '南方中证500ETF', enName: 'Southern CSI500 ETF', type: '宽基指数型', manager: '南方基金', track: '中证500指数', inception: '2013-02-06' },
  '159915': { group: 'G6', name: '易方达创业板ETF', enName: 'EFund ChiNext ETF', type: '宽基指数型', manager: '易方达基金', track: '创业板指数', inception: '2011-09-20' },
  '511010': { group: 'G7', name: '国泰上证5年期国债ETF', enName: 'Guotai Treasury ETF', type: '债券型', manager: '国泰基金', track: '中债国债总财富指数', inception: '2013-03-05' },
  '518880': { group: 'G8', name: '华安黄金ETF', enName: 'HuaAn Gold ETF', type: '黄金主题', manager: '华安基金', track: '国内黄金现货', inception: '2013-07-18' }
};

// ───────────────────────────── 指数温度定义（P0-1 真实温度） ─────────────────────────────
// secid 为东方财富行情标识；温度由真实日收盘价历史分位计算（替代原示例 PE）
// 温度数据源优先级：sina（A股指数/ETF，稳定）> proxyFund（用真实基金净值代理美股指数）> secid（东方财富，CI 可达）
const INDEX_DEFS = [
  { key: 'ndx', title: '纳斯达克100', proxyFund: '513100', asset: 'equity', market: 'us', note: '美股科技龙头晴雨表（纳斯达克100ETF 净值代理）' },
  { key: 'spx', title: '标普信息科技', proxyFund: '161128', asset: 'equity', market: 'us', note: '美股科技大盘（标普500信息科技指数）' },
  { key: 'hs300', title: '沪深300', sina: 'sh000300', asset: 'equity', market: 'cn', note: 'A股大盘蓝筹' },
  { key: 'cyb', title: '创业板指', sina: 'sz399006', asset: 'equity', market: 'cn', note: 'A股成长风格' },
  { key: 'zz500', title: '中证500', sina: 'sh000905', asset: 'equity', market: 'cn', note: 'A股中小盘' },
  { key: 'gold', title: '黄金ETF', sina: 'sh518880', asset: 'gold', market: 'cn', note: '避险资产 / 抗通胀' }
];

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
// 合并拓宽覆盖的新基金到主映射（声明后即可安全合并）
Object.assign(FUND_GROUP, Object.fromEntries(Object.entries(EXTRA_FUNDS).map(([c, v]) => [c, v.group])));
Object.assign(FUND_NAME, Object.fromEntries(Object.entries(EXTRA_FUNDS).map(([c, v]) => [c, v.name])));

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

// 拉取文本（HTML 页面，如费率/跟踪误差页），用于正则提取
async function getText(url, headers) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
  });
}

// 分页拉取某基金净值序列，目标累计 target 条；返回升序 {dates[], navs[]}（navs 用累计净值）
async function fetchNavSeries(code, target = 400) {
  const hdrs = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://fundf10.eastmoney.com/', 'Accept': 'application/json' };
  const dates = [], navs = [], dwjzs = [];
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
      const dw = parseFloat(r.DWJZ);
      dwjzs.push(isNaN(dw) ? nav : dw);
    }
    if (list.length < PAGE) break; // 到底
    page++;
    await new Promise((r) => setTimeout(r, 120)); // 轻量限速，避免触发风控
  }
  // 接口返回降序（最新在前），反转成升序（最旧在前）
  dates.reverse(); navs.reverse(); dwjzs.reverse();
  return { dates, navs, dwjzs };
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

// ───────────────────────────── P0-1 真实指数温度（基于真实收盘价历史分位） ─────────────────────────────
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// 新浪 K 线（A股指数/ETF，稳定）：返回 {dates, closes, chg(%)}
async function fetchSinaKline(symbol) {
  const url = `https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=${symbol}&scale=240&ma=no&datalen=1300`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const txt = await getText(url, { 'User-Agent': 'Mozilla/5.0' });
      if (!txt) throw new Error('empty');
      const arr = JSON.parse(txt);
      if (!Array.isArray(arr) || !arr.length) throw new Error('no data');
      const dates = [], closes = [], chg = [];
      for (const k of arr) {
        const c = parseFloat(k.close);
        if (isNaN(c)) continue;
        dates.push(k.day); closes.push(c); chg.push(0);
      }
      for (let i = 1; i < closes.length; i++) chg[i] = (closes[i] / closes[i - 1] - 1) * 100;
      if (closes.length < 60) throw new Error('too few');
      return { dates, closes, chg };
    } catch (e) {
      if (attempt < 2) await sleep(800);
    }
  }
  return null;
}

// 用基金真实净值历史作为指数温度代理（美股指数在沙箱不可达时的真实替代）
function fetchFundKline(code) {
  try {
    const json = JSON.parse(fs.readFileSync(NAV_OUT, 'utf8'));
    const s = json.series && json.series.find((x) => x.code === code);
    if (!s || !s.nav || s.nav.length < 30) return null;
    const closes = s.nav, dates = s.dates;
    const chg = closes.map((c, i) => (i > 0 ? (c / closes[i - 1] - 1) * 100 : 0));
    return { dates, closes, chg };
  } catch (e) { return null; }
}

// 东方财富 K 线（美股指数，CI 环境可达；沙箱常被限频，作为兜底，带重试）
async function fetchKline(secid, beg = '20200101') {
  const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&fields1=f1%2Cf2%2Cf3&fields2=f51%2Cf2%2Cf3&klt=101&fqt=1&beg=${beg}&end=20500101`;
  const hdrs = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://quote.eastmoney.com/' };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const j = await getJSON(url, hdrs);
      const kl = j && j.data && j.data.klines;
      if (!kl || !kl.length) throw new Error('empty');
      const dates = [], closes = [], chg = [];
      for (const line of kl) {
        const p = line.split(',');
        const c = parseFloat(p[1]);
        if (isNaN(c)) continue;
        dates.push(p[0]); closes.push(c); chg.push(parseFloat(p[2]) || 0);
      }
      if (closes.length < 60) throw new Error('too few');
      return { dates, closes, chg };
    } catch (e) {
      if (attempt < 2) await sleep(800);
    }
  }
  return null;
}

// 当前价位在历史上的分位（0-100）：小于当前价的比例
function percentileRank(arr, v) {
  if (!arr.length) return 50;
  let below = 0;
  for (const x of arr) if (x < v) below++;
  return (below / arr.length) * 100;
}
function tempBand(t) {
  if (t < 30) return { band: '低估', color: '#00d68f' };
  if (t < 50) return { band: '正常偏低', color: '#7bc043' };
  if (t < 70) return { band: '正常偏高', color: '#f7b500' };
  return { band: '高估', color: '#ff5252' };
}
function dcaLevel(t) {
  if (t < 30) return { level: '偏低区间', text: '温度<30%，处于历史偏低区间，可适度增加定投金额（仅供参考，非投资建议）' };
  if (t < 50) return { level: '中性区间', text: '温度30-50%，处于历史中性区间，可按基准金额定投（仅供参考，非投资建议）' };
  if (t < 70) return { level: '偏高区间', text: '温度50-70%，处于历史偏高区间，可考虑减少定投金额（仅供参考，非投资建议）' };
  return { level: '偏高区间', text: '温度>70%，处于历史偏高区间，建议谨慎或分批兑现（仅供参考，非投资建议）' };
}

async function generateIndexTemperature() {
  const items = [];
  for (const def of INDEX_DEFS) {
    let kl = null, srcLabel = '';
    if (def.sina) { kl = await fetchSinaKline(def.sina); srcLabel = '新浪K线:' + def.sina; }
    else if (def.proxyFund) { kl = fetchFundKline(def.proxyFund); srcLabel = '基金净值代理:' + def.proxyFund; }
    else if (def.secid) { kl = await fetchKline(def.secid); srcLabel = '东方财富K线:' + def.secid; }
    if (!kl || kl.closes.length < 60) { console.warn(`  [temp ${def.key}] 数据源不足(${srcLabel})，跳过`); continue; }
    const closes = kl.closes, dates = kl.dates, chg = kl.chg;
    const cur = closes[closes.length - 1];
    const lastDate = dates[dates.length - 1];
    const lastChg = chg[chg.length - 1];
    const tempAll = percentileRank(closes, cur);
    const windowed = (years) => {
      const need = Math.floor(years * 242);
      return percentileRank(closes.slice(Math.max(0, closes.length - need)), cur);
    };
    const ddOf = (years) => {
      const need = Math.floor(years * 242);
      const sub = closes.slice(Math.max(0, closes.length - need));
      let peak = -Infinity, mdd = 0;
      for (const v of sub) { if (v > peak) peak = v; const d = (v / peak - 1) * 100; if (d < mdd) mdd = d; }
      return mdd;
    };
    const band = tempBand(tempAll);
    const dca = dcaLevel(tempAll);
    items.push({
      key: def.key, title: def.title, subtitle: def.note, asset: def.asset, market: def.market,
      value: cur, change: +lastChg.toFixed(2),
      temperature: +tempAll.toFixed(1),
      tempBand: band.band, tempColor: band.color,
      percentiles: { y1: +windowed(1).toFixed(1), y3: +windowed(3).toFixed(1), y5: +windowed(5).toFixed(1) },
      drawdown: { current: +ddOf(1).toFixed(2), y5: +ddOf(5).toFixed(2) },
      dca,
      updateTime: lastDate,
      source: srcLabel + '；分位温度为当前价位在历史区间的百分位',
      note: '分位温度基于真实价格序列计算，非券商 PE 口径；仅反映"价格贵贱"，不构成买卖建议'
    });
    console.log(`  [temp ${def.key}] 来源=${srcLabel} 价位=${cur} 温度=${tempAll.toFixed(1)} 区间=${band.band}`);
  }
  const out = {
    meta: {
      asOf: items.length ? items[items.length - 1].updateTime : new Date().toISOString().slice(0, 10),
      source: 'A股指数/ETF 取新浪真实日K线；美股指数取对应 ETF 真实净值（均为真实价格序列）',
      method: '分位温度 = 当前价位在对应历史区间（1/3/5年）中的百分位；越高越贵',
      note: '真实数据，替代原示例 PE；定投档位由温度推导'
    },
    items
  };
  fs.writeFileSync(path.join(__dirname, 'index_temperature.json'), JSON.stringify(out, null, 2));
  console.log(`[pipeline] 已写出 index_temperature.json（${items.length} 个指数，真实温度）`);
  return out;
}

// ───────────────────────────── P1-4 费率与跟踪误差（F10 HTML 正则提取） ─────────────────────────────
async function fetchFundMeta(code) {
  const hdrs = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'http://fundf10.eastmoney.com/' };
  let mgmt = null, cust = null, track = null;
  try {
    const html = await getText(`https://fundf10.eastmoney.com/jjfl_${code}.html`, hdrs);
    const m = html.match(/管理费率<\/td><td[^>]*>([\d.]+)%/);
    const c = html.match(/托管费率<\/td><td[^>]*>([\d.]+)%/);
    if (m) mgmt = parseFloat(m[1]);
    if (c) cust = parseFloat(c[1]);
  } catch (e) { /* 跳过 */ }
  try {
    const html2 = await getText(`https://fundf10.eastmoney.com/tszf_${code}.html`, hdrs);
    let t = html2.match(/跟踪误差<\/td><td[^>]*>([\d.]+)%/);
    if (!t) t = html2.match(/跟踪误差[^\d]{0,40}?([\d.]+)%/);
    if (t) track = parseFloat(t[1]);
  } catch (e) { /* 跳过 */ }
  return { code, mgmtFee: mgmt, custFee: cust, trackErr: track };
}

async function generateFundMeta(codes) {
  const list = await pool(codes, (code) => fetchFundMeta(code), 6);
  const byCode = {};
  list.forEach((m) => { if (m && m.code) byCode[m.code] = { mgmtFee: m.mgmtFee, custFee: m.custFee, trackErr: m.trackErr }; });
  // 真实跟踪误差：基金净值日收益 vs 标的指数日收益，年化 std（替代 404 的 tszf 页面）
  const teMap = await computeTrackingError();
  Object.keys(teMap).forEach((code) => {
    if (byCode[code]) {
      byCode[code].trackErr = teMap[code].trackErr;
      byCode[code].trackErrNote = teMap[code].trackErrNote;
    }
  });
  const out = {
    meta: {
      asOf: new Date().toISOString().slice(0, 10),
      source: '天天基金 F10 费率页面（fundf10.eastmoney.com），管理/托管费率与跟踪误差（指数/ETF）',
      note: '跟踪误差仅指数/ETF 适用，主动基金为 null'
    },
    byCode
  };
  fs.writeFileSync(path.join(__dirname, 'fund_meta.json'), JSON.stringify(out, null, 2));
  const withTrack = Object.values(byCode).filter((x) => x.trackErr != null).length;
  console.log(`[pipeline] 已写出 fund_meta.json（${Object.keys(byCode).length} 只，含跟踪误差 ${withTrack} 只）`);
  return out;
}

// ───────────────────────────── 真实跟踪误差（P1-4 补全） ─────────────────────────────
// 基金净值日收益 vs 标的指数日收益，年化 std = std(diff) * sqrt(252)
const TRACK_BENCH = {
  '510300': 'sh000300', // 沪深300ETF -> 沪深300
  '510500': 'sh000905', // 中证500ETF -> 中证500
  '159915': 'sz399006', // 创业板ETF -> 创业板指
  '518880': 'sh518880', // 黄金ETF -> 黄金ETF市价
  '511010': 'sh000012'  // 国债ETF -> 上证国债指数
};
const NO_BENCH = {
  '513100': '纳指100 无独立可比对标指数（沙箱不可达），无法计算',
  '161128': '标普信息科技 无独立可比对标指数（沙箱不可达），无法计算'
};

async function computeTrackingError() {
  let navJson;
  try { navJson = JSON.parse(fs.readFileSync(NAV_OUT, 'utf8')); } catch (e) { return {}; }
  const seriesArr = navJson.series || [];
  const byCodeMap = {};
  seriesArr.forEach((s) => { byCodeMap[s.code] = s; });
  const out = {};
  for (const [code, reason] of Object.entries(NO_BENCH)) {
    out[code] = { trackErr: null, trackErrNote: reason };
  }
  for (const [code, sym] of Object.entries(TRACK_BENCH)) {
    const f = byCodeMap[code];
    if (!f || !f.dates || !f.nav || f.dates.length < 30) {
      out[code] = { trackErr: null, trackErrNote: '净值数据不足' };
      continue;
    }
    const bench = await fetchSinaKline(sym);
    if (!bench || bench.dates.length < 30) {
      out[code] = { trackErr: null, trackErrNote: `标的 ${sym} 行情不可达` };
      continue;
    }
    const benchMap = {};
    bench.dates.forEach((d, i) => { benchMap[d] = bench.closes[i]; });
    const diffs = [];
    for (let i = 1; i < f.dates.length; i++) {
      const d = f.dates[i], pd = f.dates[i - 1];
      if (!(d in benchMap) || !(pd in benchMap)) continue;
      const fr = f.nav[i] / f.nav[i - 1] - 1;
      const br = benchMap[d] / benchMap[pd] - 1;
      if (!isFinite(fr) || !isFinite(br)) continue;
      diffs.push(fr - br);
    }
    if (diffs.length < 20) {
      out[code] = { trackErr: null, trackErrNote: '对齐样本不足' };
      continue;
    }
    const mean = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const variance = diffs.reduce((a, b) => a + (b - mean) ** 2, 0) / diffs.length;
    const annual = Math.sqrt(variance) * Math.sqrt(252) * 100;
    out[code] = {
      trackErr: +annual.toFixed(3),
      trackErrNote: `年化跟踪误差（净值 vs ${sym}，约 ${diffs.length} 个交易日）`
    };
    console.log(`[track] ${code} -> ${annual.toFixed(3)}% (n=${diffs.length})`);
  }
  return out;
}

// ───────────────────────────── 资讯自动滚动更新（P2-3 时效补全） ─────────────────────────────
// 新浪财经滚动新闻（沙箱可达），规则化分类与情绪标签（自动·仅供参考）
const NEWS_LIDS = ['2515', '2513', '2516', '2517', '2518', '2519'];

async function fetchSinaNews() {
  const items = [];
  const seen = new Set();
  for (const lid of NEWS_LIDS) {
    const url = `https://feed.mix.sina.com.cn/api/roll/get?pageid=153&lid=${lid}&k=&num=12&page=1`;
    try {
      const txt = await getText(url, { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://finance.sina.com.cn/' });
      const o = JSON.parse(txt);
      const arr = (o.result && o.result.data) || [];
      for (const it of arr) {
        const title = it.title || '';
        if (!title || seen.has(title)) continue;
        seen.add(title);
        const ctime = parseInt(it.ctime, 10);
        if (!ctime) continue;
        const dt = new Date(ctime * 1000);
        const dateCN = `${dt.getMonth() + 1}月${dt.getDate()}日`;
        const date = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        const hh = String(dt.getHours()).padStart(2, '0');
        const mm = String(dt.getMinutes()).padStart(2, '0');
        const summary = (it.intro || it.summary || it.stitle || '').replace(/\s+/g, ' ').trim();
        const url2 = it.url || it.wapurl || '';
        items.push({ title, summary, date, dateCN, time: `${hh}:${mm}`, url: url2, source: '新浪财经' });
      }
    } catch (e) { console.warn(`[news] lid ${lid} 失败：${e.message}`); }
    await sleep(300);
  }
  return items;
}

function classifyNewsItem(n) {
  const t = (n.title + ' ' + n.summary);
  const has = (...kw) => kw.some((k) => t.includes(k));
  let category = '内地';
  if (has('港股', '恒生', 'H股')) category = '港股';
  else if (has('美股', '纳斯达克', '标普', '道指', '美债', '美联储', '美国', '特朗普')) category = '国际';
  else if (has('地产', '楼市', '房地产', '房贷', '房企')) category = '地产';
  else if (has('政策', '央行', '国务院', '政治局', '两会', '财政', '货币', 'GDP', 'CPI', 'PMI', '宏观', '降息', '加息')) category = '宏观政策';
  else if (has('A股', '沪', '深', '创业板', '科创', '指数', '基金', 'ETF', '公募', '股市', '板块')) category = '金融市场';
  let sentiment = 'neutral';
  if (has('利好', '上涨', '大涨', '回暖', '复苏', '增长', '新高', '超预期', '上调', '盈利', '反弹', '创新高')) sentiment = 'positive';
  else if (has('利空', '下跌', '大跌', '暴跌', '风险', '危机', '下调', '亏损', '下滑', '违约', '降温', '承压')) sentiment = 'negative';
  return { category, sentiment };
}

async function generateNewsDeep() {
  const raw = await fetchSinaNews();
  if (!raw.length) {
    console.warn('[news] 未抓到新闻，保留旧 js/news_deep.js');
    return;
  }
  const list = raw.slice(0, 45).map((n) => {
    const c = classifyNewsItem(n);
    return {
      category: c.category,
      date: n.date,
      dateCN: n.dateCN,
      time: n.time,
      title: n.title,
      summary: n.summary.slice(0, 400),
      soWhat: '',
      relatedFunds: [],
      source: n.source,
      url: n.url,
      sentiment: c.sentiment,
      auto: true
    };
  });
  const header = [
    '// 自动生成：新浪财经滚动新闻（每日 pipeline 抓取）',
    '// 分类与情绪标签为规则启发式（自动·仅供参考，非投资建议）；抓取于 ' + new Date().toISOString().slice(0, 10),
    'window.NEWS_DEEP = ' + JSON.stringify(list, null, 2) + ';'
  ];
  fs.writeFileSync(path.join(__dirname, 'js', 'news_deep.js'), header.join('\n'));
  console.log(`[pipeline] 已写出 js/news_deep.js（${list.length} 条，新浪财经实时抓取）`);
}

// ───────────────────────────── 科技 ETF 榜单每日刷新（近20日涨跌） ─────────────────────────────
// 静态字段(size/valPct/disc)来自 etf_board_seed.json 快照；chg20d 每日基于真实净值重算
const ETF_SEED_PATH = path.join(__dirname, 'etf_board_seed.json');

function computeChg20d(navs) {
  if (!navs || navs.length < 21) return null;
  const last = navs[navs.length - 1];
  const prev = navs[navs.length - 21]; // 20 个交易日前
  if (!isFinite(last) || !isFinite(prev) || prev === 0) return null;
  return +((last / prev - 1) * 100).toFixed(2);
}

async function generateEtfBoard() {
  let seed;
  try { seed = JSON.parse(fs.readFileSync(ETF_SEED_PATH, 'utf8')); }
  catch (e) { console.warn('[etf] 缺少 etf_board_seed.json，跳过榜单刷新'); return; }
  const regions = Object.keys(seed).filter((k) => Array.isArray(seed[k]));
  const out = {};
  let refreshed = 0, kept = 0;
  for (const rk of regions) {
    out[rk] = await pool(seed[rk], async (item) => {
      const code6 = item.code.replace(/^[a-z]+/, ''); // sz159941 -> 159941
      try {
        const { navs } = await fetchNavSeries(code6, 25);
        const c = computeChg20d(navs);
        if (c != null) { refreshed++; return Object.assign({}, item, { chg20d: c }); }
      } catch (e) { /* 保留快照值 */ }
      kept++;
      return item;
    }, 4);
  }
  const asOf = new Date().toISOString().slice(0, 10);
  out.date = asOf;                                   // 近20日涨跌刷新日期
  out.snapshotDate = seed.date || '2026-07-18';      // 规模/估值/折溢价快照日期
  out.source = '近20日涨跌：天天基金真实净值（每日刷新）；规模/估值/折溢价：腾讯自选股（' + (seed.date || '2026-07-18') + ' 快照）';
  const header = [
    '// 科技 ETF 榜单（每日 pipeline 刷新 近20日涨跌 chg20d）',
    '// chg20d = 基于天天基金真实净值的近20交易日区间涨跌%；规模/估值百分位/折溢价维持快照',
    '// 生成于 ' + asOf + '；静态字段来源 etf_board_seed.json'
  ].join('\n');
  fs.writeFileSync(path.join(__dirname, 'js', 'etf_board.js'), header + '\nwindow.ETF_BOARD = ' + JSON.stringify(out, null, 2) + ';\n');
  console.log(`[pipeline] 已写出 js/etf_board.js（${regions.map((r) => out[r].length).join('+')} 只，chg20d 刷新 ${refreshed} / 沿用快照 ${kept}，date=${asOf}）`);
}

// ───────────────────────────── P2-5 新增基金 sparkline 数据（realdata_extra.js） ─────────────────────────────
function emitRealDataExtra(extraByCode) {
  // 列式压缩：date->YYYYMMDD整数，省 dateCN（运行时推导），与 realdata.js 同格式，控制体积
  const compact = {};
  Object.keys(extraByCode).forEach((code) => {
    const arr = extraByCode[code] || [];
    const d = [], nav = [], acc = [], ch = [];
    arr.forEach((p) => {
      const m = String(p.date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
      d.push(m ? parseInt(m[1] + m[2] + m[3], 10) : 0);
      nav.push(p.nav); acc.push(p.acc); ch.push(p.change);
    });
    compact[code] = [d, nav, acc, ch];
  });
  const body = `// 自动生成：全部基金的近期真实净值（每日 pipeline 刷新），与 realdata.js 旧快照增量合并
// 由 pipeline.js 生成；加载顺序须在 realdata.js 之后、data.js 之前
// 列式压缩格式（date->YYYYMMDD整数, dateCN 运行时推导），解压后形状与 REAL_FUND_DATA 一致
// 合并规则：已有历史(realdata.js)保留，仅追加更新日期的净值；无历史的基金整段写入
(function () {
  window.REAL_FUND_DATA = window.REAL_FUND_DATA || {};
  var RAW = ${JSON.stringify(compact)};
  for (var code in RAW) {
    if (!RAW.hasOwnProperty(code)) continue;
    var c = RAW[code], d = c[0], nav = c[1], acc = c[2], ch = c[3];
    var arr = new Array(d.length);
    for (var i = 0; i < d.length; i++) {
      var num = d[i], s = String(num);
      var date = s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8);
      var dateCN = (Math.floor(num / 100) % 100) + '月' + (num % 100) + '日';
      arr[i] = { date: date, dateCN: dateCN, nav: nav[i], acc: acc[i], change: ch[i] };
    }
    var old = window.REAL_FUND_DATA[code];
    if (old && old.length) {
      // 增量合并：只把比旧快照末日更新的净值 push 进原数组（保持引用，data.js 已持有）
      var last = old[old.length - 1].date;
      for (var j = 0; j < arr.length; j++) {
        if (arr[j].date > last) old.push(arr[j]);
      }
    } else {
      window.REAL_FUND_DATA[code] = arr;
    }
  }
})();
`;
  fs.writeFileSync(path.join(__dirname, 'js', 'realdata_extra.js'), body);
  console.log(`[pipeline] 已写出 js/realdata_extra.js（${Object.keys(extraByCode).length} 只基金近期净值，前端与 realdata.js 增量合并）`);
}

// ───────────────────────────── 主流程 ─────────────────────────────
async function main() {
  const asOf = new Date().toISOString().slice(0, 10);
  const codes = Object.keys(FUND_GROUP);
  console.log(`[pipeline] 开始拉取 ${codes.length} 只基金真实净值（天天基金接口）…`);

  const results = await pool(codes, async (code) => {
      const g = FUND_GROUP[code];
      try {
        const { dates, navs, dwjzs } = await fetchNavSeries(code);
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
        dates, navs, dwjzs,
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

  // ── 每日净值增量数据（原 P2-5 仅 EXTRA 基金，现覆盖全部基金） ──
  // 关键修复（2026-07-24）：趋势分析用的 25 只核心科技基金净值在 js/realdata.js
  // （建站时静态快照）中，此前每日管线从不刷新它们，导致「每日涨跌不更新」。
  // 现把全部基金的近期净值输出到 realdata_extra.js，前端与旧快照增量合并。
  const extraByCode = {};
  for (const r of results) {
    if (!r.measured || !r.dwjzs || r.dwjzs.length < 5) continue;
    const arr = [];
    for (let i = 0; i < r.dates.length; i++) {
      const nav = r.dwjzs[i];
      const prev = i > 0 ? r.dwjzs[i - 1] : nav;
      const change = i > 0 ? (nav / prev - 1) * 100 : 0;
      const parts = r.dates[i].split('-');
      arr.push({
        date: r.dates[i],
        dateCN: `${parseInt(parts[1])}月${parseInt(parts[2])}日`,
        nav, acc: r.navs[i], change: +change.toFixed(2)
      });
    }
    extraByCode[r.code] = arr;
  }

  // ── 真实指数温度（P0-1）/ 费率与跟踪误差（P1-4）/ 新基金 sparkline（P2-5） ──
  await generateIndexTemperature();
  const allCodes = Object.keys(FUND_GROUP); // 含拓宽覆盖的新基金
  await generateFundMeta(allCodes);
  await generateNewsDeep(); // 新浪财经滚动新闻实时抓取
  if (Object.keys(extraByCode).length) emitRealDataExtra(extraByCode);
  await generateEtfBoard(); // 科技 ETF 榜单：近20日涨跌每日基于真实净值刷新

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

  if (process.env.GH_TOKEN) {
    try {
      require('child_process').execFileSync('bash', ['-c', `git add fund_signals.json fund_nav.json backtest.json index_temperature.json fund_meta.json js/realdata_extra.js js/news_deep.js js/etf_board.js && git commit -m "chore: daily signal update ${asOf}" && git push`], { stdio: 'inherit' });
    } catch (e) { console.warn('[pipeline] 提交失败：', e.message); }
  }
}

// 读取上一版组信号用于整组失败降级
let prevGroups = {};
try { prevGroups = JSON.parse(fs.readFileSync(OUT, 'utf8')).groups || {}; } catch {}

main().catch((e) => { console.error('[pipeline] 致命错误:', e); process.exit(1); });
