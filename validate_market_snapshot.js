// 端到端验证：真实市场快照接入 + 涨跌归因动态计算
// 用最小 DOM 桩加载 data.js / market_snapshot.js / holdings.js / app.js，触发 init()，检查渲染。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = __dirname;
const read = (p) => fs.readFileSync(path.join(DIR, p), "utf8");

// ---- 最小 DOM 桩 ----
const registry = {};
function makeEl(id) {
  return {
    id,
    _html: "",
    _text: "",
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    set innerHTML(v) { this._html = v; },
    get innerHTML() { return this._html; },
    set textContent(v) { this._text = v; },
    get textContent() { return this._text; },
    addEventListener() {},
    querySelectorAll() { return []; },
    querySelector() { return null; },
    scrollIntoView() {},
    getBoundingClientRect() { return { width: 200, height: 40 }; },
    getContext() {
      return new Proxy({}, { get: () => () => ({ addColorStop() {} }) });
    },
    dataset: {},
    appendChild() {},
    closest() { return null; },
  };
}
const listeners = {};
const documentStub = {
  getElementById(id) {
    if (!registry[id]) registry[id] = makeEl(id);
    return registry[id];
  },
  querySelector() { return makeEl("q"); },
  querySelectorAll() { return []; },
  addEventListener(type, cb) { listeners[type] = cb; },
  createElement() { return makeEl("c"); },
};

const sandbox = {
  window: {},
  document: documentStub,
  console,
  setTimeout,
  clearTimeout,
  requestAnimationFrame: (cb) => cb(),
  devicePixelRatio: 1,
  addEventListener() {},
  scrollY: 0,
  scrollTo() {},
  Chart: class {
    constructor() { this.data = { labels: [], datasets: [] }; this.options = {}; }
    update() {}
  },
};
sandbox.window = sandbox; // app.js 用 window.MARKET_SNAPSHOT 等
sandbox.global = sandbox;
vm.createContext(sandbox);

function loadScript(rel) {
  const code = read(rel);
  vm.runInContext(code, sandbox, { filename: rel });
}

// 顺序加载（与 index.html 一致）
loadScript("js/realdata.js");
loadScript("js/data.js");
loadScript("js/market_snapshot.js");
loadScript("js/holdings.js");
loadScript("js/app.js");

// 触发 DOMContentLoaded -> init()
if (listeners["DOMContentLoaded"]) listeners["DOMContentLoaded"]();

// ---- 断言 ----
let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("[PASS]", name); }
  else { fail++; console.log("[FAIL]", name); }
}

const idxHtml = registry["indicesGrid"] ? registry["indicesGrid"]._html : "";
const sentHtml = registry["sentimentBar"] ? registry["sentimentBar"]._html : "";
const snap = sandbox.window.MARKET_SNAPSHOT;

// 1. 指数卡渲染 7 项且使用真实快照（不应出现旧的示意值 488.35）
check("指数网格渲染 7 张卡", (idxHtml.match(/index-card/g) || []).length === 7);
check("指数使用真实纳指100(非示意488.35)", idxHtml.includes("纳斯达克100") && !idxHtml.includes("488.35"));
check("指数含恒生科技真实值", idxHtml.includes("4,623.17") || idxHtml.includes("4623.17"));
check("市场快照含 19 只个股涨跌幅", snap && Object.keys(snap.stockChanges).length === 19);

// 2. 情绪条使用真实 10Y / 黄金 / 原油
check("情绪条含真实美债10年(4.52%)", sentHtml.includes("4.52%"));
check("情绪条含真实黄金($…/oz)", sentHtml.includes("/oz"));
check("情绪条含真实原油($…/bbl)", sentHtml.includes("/bbl"));

// 3. 涨跌归因：用真实个股涨跌幅动态计算（纯数据校验，复刻 renderAttribution 逻辑）
const sc = snap.stockChanges;
const H = sandbox.window.FUND_HOLDINGS;
function computeAttribution(code) {
  const h = H[code];
  if (!h || !h.stocks || !h.stocks.length) return { up: [], down: [], empty: true };
  const up = [], down = [];
  h.stocks.forEach((s) => {
    const isA = s.market === 0 || s.market === 1;
    if (isA && sc[s.code] != null) {
      const change = sc[s.code];
      const contrib = (s.weight * change) / 100;
      (change >= 0 ? up : down).push({ name: s.name, weight: s.weight, change, contrib });
    }
  });
  up.sort((a, b) => b.contrib - a.contrib);
  down.sort((a, b) => a.contrib - b.contrib);
  return { up, down, empty: !up.length && !down.length };
}
const a345 = computeAttribution("007345");
check("富国科技创新A 有真实归因(A股持仓)", !a345.empty && a345.down.length > 0);
const xjxc = a345.down.find((d) => d.name === "中际旭创");
const h345xjxc = H["007345"].stocks.find((s) => s.code === "300308");
const expectedContrib = (h345xjxc.weight * sc["300308"]) / 100;
check("中际旭创贡献=权重×涨跌幅(动态校验)", xjxc && Math.abs(xjxc.contrib - expectedContrib) < 0.001);
const a530 = computeAttribution("513100"); // ETF，无 A股持仓
check("纳指100ETF(纯海外)走说明分支", a530.empty);
const realAttrFunds = Object.keys(H).filter((c) => !computeAttribution(c).empty);
console.log("[INFO] 可真实归因的基金数:", realAttrFunds.length, "->", realAttrFunds.join(","));

// 4. 滚动跳转目标修复：app.js 内应引用 #chart 而非 #trend
const appSrc = read("js/app.js");
check("相关基金跳转目标为 #chart(非#trend)", appSrc.includes('getElementById("chart")') && !appSrc.includes('getElementById("trend")'));

// 5. periodReturn 用复权 acc（data.js 已改）
check("data.js periodReturn 使用 acc", read("js/data.js").includes("val(latest)"));

console.log(`\n结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
