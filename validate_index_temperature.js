// 端到端验证：指数温度卡片渲染
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = __dirname;
const read = (p) => fs.readFileSync(path.join(DIR, p), "utf8");

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
sandbox.window = sandbox;
sandbox.global = sandbox;
vm.createContext(sandbox);

function loadScript(rel) {
  const code = read(rel);
  vm.runInContext(code, sandbox, { filename: rel });
}

loadScript("js/realdata.js");
loadScript("js/data.js");
loadScript("js/market_snapshot.js");
loadScript("js/holdings.js");
loadScript("js/index_temperature.js");
loadScript("js/app.js");

if (listeners["DOMContentLoaded"]) listeners["DOMContentLoaded"]();

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log("[PASS]", name); }
  else { fail++; console.log("[FAIL]", name); }
}

const tempHtml = registry["indexTemperatureGrid"] ? registry["indexTemperatureGrid"]._html : "";
const snap = sandbox.window.MARKET_SNAPSHOT;
const sent = sandbox.window.MARKET_SENTIMENT;

const cardCount =
  (tempHtml.match(/class="temp-card"/g) || []).length +
  (tempHtml.match(/class="temp-card temp-card-vix"/g) || []).length;
check("渲染 3 张指数温度卡片", cardCount === 3);

check("VIX 卡片存在", tempHtml.includes("VIX 恐慌指数"));
check("纳指100 卡片存在", tempHtml.includes("纳斯达克100"));
check("标普500 卡片存在", tempHtml.includes("标普500"));

const vix = sent && sent.vix ? Number(sent.vix).toFixed(2) : null;
check("VIX 卡片回填真实值", vix && tempHtml.includes(vix));

const ndx = snap && snap.indices.find((i) => i.key === "ndx");
check("纳指100 卡片回填真实点位", ndx && tempHtml.includes(ndx.value.toLocaleString("en-US", { maximumFractionDigits: 2 })));

const spx = snap && snap.indices.find((i) => i.key === "spx");
check("标普500 卡片回填真实点位", spx && tempHtml.includes(spx.value.toLocaleString("en-US", { maximumFractionDigits: 2 })));

check("VIX 彩色刻度条存在", tempHtml.includes("vix-scale-bar"));
check("VIX 刻度段数 >= 5", (tempHtml.match(/vix-segment/g) || []).length >= 5);
check("VIX 表情与状态存在", tempHtml.includes("vix-scale-emoji") && tempHtml.includes("vix-current-state"));

check("历史分位区域存在", tempHtml.includes("percentile-section"));
check("历史分位条目 >= 3", (tempHtml.match(/percentile-item/g) || []).length >= 3);

check("跌幅区域存在", tempHtml.includes("drawdown-row"));
check("跌幅盒子 >= 2", (tempHtml.match(/drawdown-box/g) || []).length >= 2);

check("提示块存在", tempHtml.includes("temp-tips"));
check("底部来源声明存在", tempHtml.includes("index-temperature-source") || registry["indexTemperatureSource"]._text.length > 0);

check("示例数据标注诚实", tempHtml.includes("示例数据") || tempHtml.includes("待接入真实估值数据源"));

console.log(`\n结果: ${pass} 通过 / ${fail} 失败`);
process.exit(fail > 0 ? 1 : 0);
