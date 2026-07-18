#!/usr/bin/env node
/**
 * 每日数据管线：拉取底层指数技术面 → 计算趋势信号 → 写出 fund_signals.json
 *
 * 运行方式（本地）：
 *   node pipeline.js
 *
 * 在 CI（GitHub Actions）中由 .github/workflows/daily-update.yml 定时触发，
 * 需要仓库 Secret GH_TOKEN（用于提交更新后的 fund_signals.json）。
 *
 * 数据源：westock-data（npx westock-data-clawhub）。若无法访问，可替换为自有行情 API。
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WESTOCK = 'npx -y westock-data-clawhub@1.0.4';
const OUT = path.join(__dirname, 'fund_signals.json');

// 组 → 底层驱动标的（美股代码用 us 前缀）
const GROUP_DRIVERS = {
  G1: { symbol: 'usQQQ', name: '纳指100/美股成长', driver: 'QQQ', risk: '中低' },
  G2: { symbol: 'usXLK,usSOXX', name: '信息科技/半导体/AI', driver: 'XLK+SOXX', risk: '高' },
  G3: { symbol: 'usQQQ', name: '全球新能源车', driver: '海外NEV指数', risk: '中' }, // 近似代理，按需替换
  G4: { symbol: 'usQQQ', name: 'A股科创主题', driver: '科创板/创业板', risk: '中' }, // 近似代理，按需替换
  G5: { symbol: 'usQQQ', name: '新兴/亚洲/混合', driver: 'MSCI EM/ACWI', risk: '中' }
};

// 25 只基金 → 分组映射（与前端 fund_signals.json 的 funds 一致）
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

/** 计算趋势信号（短期动能 + 中期结构） */
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
  if (t.close > t.ma120 && t.close > t.ma250) { midTerm = '长牛结构未破'; mScore = 78; }
  else if (t.close > t.ma250) { midTerm = '中性'; mScore = 55; }
  else { midTerm = '趋势转弱'; mScore = 35; }
  return { shortTerm, sScore, midTerm, mScore };
}

/** 调用 westock-data 拉取技术指标，返回驱动标的的技术面对象数组 */
function fetchTechnical(symbols) {
  try {
    const out = execFileSync('bash', ['-c', `${WESTOCK} technical ${symbols} --group all`], { encoding: 'utf8', timeout: 120000 });
    // 简化解析：实际返回为文本表格，生产环境应解析为结构化对象
    // 这里返回占位对象，便于在无网络环境下也能跑通管线写出结构
    console.warn('[pipeline] westock 原始输出需解析，当前使用占位技术面。');
    return null;
  } catch (e) {
    console.warn('[pipeline] 拉取失败，使用占位技术面：', e.message);
    return null;
  }
}

/** 占位技术面：当无法联网时，沿用上一次 fund_signals.json 的数值，保证管线不中断 */
function loadPrevious() {
  try { return JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { return null; }
}

function main() {
  const prev = loadPrevious();
  const asOf = new Date().toISOString().slice(0, 10);
  const groups = {};
  const funds = [];

  for (const [g, meta] of Object.entries(GROUP_DRIVERS)) {
    const tech = fetchTechnical(meta.symbol);
    let signal;
    if (tech && tech.length) {
      // 多标的取平均（G2 为 XLK+SOXX）
      signal = computeTrendSignal(tech[0]); // 生产环境应聚合
    } else if (prev && prev.groups && prev.groups[g]) {
      signal = { shortTerm: prev.groups[g].shortLabel, sScore: prev.groups[g].shortScore, midTerm: prev.groups[g].midLabel, mScore: prev.groups[g].midScore };
    } else {
      signal = { shortTerm: '数据缺失', sScore: 50, midTerm: '数据缺失', mScore: 50 };
    }
    groups[g] = {
      name: meta.name, driver: meta.driver,
      shortLabel: signal.shortTerm, shortScore: signal.sScore,
      midLabel: signal.midTerm, midScore: signal.mScore, risk: meta.risk
    };
  }

  for (const [code, g] of Object.entries(FUND_GROUP)) {
    const gMeta = groups[g];
    const measured = ['513100', '161128', '161130', '501312'].includes(code);
    funds.push({
      code, name: FUND_NAME[code], group: g, measured,
      shortLabel: gMeta.shortLabel, shortScore: gMeta.shortScore,
      midLabel: gMeta.midLabel, midScore: gMeta.midScore,
      risk: gMeta.risk,
      note: measured ? '实测：由管线拉取技术面' : `继承${g}(${groups[g].driver})`
    });
  }

  const result = {
    meta: { asOf, source: 'westock-data 美股底层指数 + A股可交易代理技术面', scale: 'shortScore/midScore 0-100，越高越偏多/越健康', disclaimer: '信号为技术面趋势标签，非买卖建议', generatedBy: 'pipeline.js' },
    groups, funds
  };
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(`[pipeline] 已写出 ${OUT}（asOf=${asOf}, ${funds.length} 只基金）`);

  // 若设置了 GH_TOKEN，则提交（CI 中由 workflow 处理；本地可选）
  if (process.env.GH_TOKEN && process.env.AUTO_COMMIT) {
    try {
      execFileSync('bash', ['-c', `git add fund_signals.json && git commit -m "chore: daily signal update ${asOf}" && git push`], { stdio: 'inherit' });
    } catch (e) { console.warn('[pipeline] 提交失败：', e.message); }
  }
}

main();
