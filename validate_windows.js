// 验证：1) app.js init() 在 DOM 桩中无异常；2) 窗口切片/最大回撤逻辑在真实数据上数值合理
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = __dirname;
// ---- 真实数据 + 数据层 ----
const realdataSrc = fs.readFileSync(path.join(DIR, "js/realdata.js"), "utf8");
const holdingsSrc = fs.readFileSync(path.join(DIR, "js/holdings.js"), "utf8");
const dataSrc = fs.readFileSync(path.join(DIR, "js/data.js"), "utf8");
const appSrc = fs.readFileSync(path.join(DIR, "js/app.js"), "utf8");

// ---- 稳定 DOM 桩（getElementById 返回同一实例，innerHTML 可回读）----
function noop() { return undefined; }
const registry = {};
function makeEl() {
  const store = {
    style: {},
    dataset: {},
    _html: "",
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); },
      remove(c) { this._s.delete(c); },
      contains(c) { return this._s.has(c); },
      toggle(c, f) { if (f === undefined) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); } else if (f) this._s.add(c); else this._s.delete(c); },
    },
    addEventListener() {},
    removeEventListener() {},
    appendChild() {},
    removeChild() {},
    querySelectorAll() { return []; },
    querySelector() { return makeEl(); },
    getAttribute() { return null; },
    setAttribute() {},
    focus() {}, click() {}, remove() {},
    getContext() {
      return {
        createLinearGradient() { return { addColorStop: noop }; },
        fillRect: noop, beginPath: noop, moveTo: noop, lineTo: noop, stroke: noop, fill: noop,
        scale: noop, clearRect: noop, translate: noop, save: noop, restore: noop,
        arc: noop, rect: noop, closePath: noop, setTransform: noop,
      };
    },
    getBoundingClientRect() { return { width: 300, height: 150, top: 0, left: 0, right: 300, bottom: 150, x: 0, y: 0 }; },
    canvas: { width: 300, height: 150 },
  };
  return new Proxy(store, {
    get(t, p) {
      if (p in t) return t[p];
      if (p === "innerHTML") return t._html;
      if (p === "textContent") return t._text || "";
      if (typeof p === "symbol") return undefined;
      return noop;
    },
    set(t, p, v) {
      if (p === "innerHTML") t._html = v;
      else if (p === "textContent") t._text = v;
      else t[p] = v;
      return true;
    },
  });
}
const documentStub = {
  getElementById(id) { if (!registry[id]) registry[id] = makeEl(); return registry[id]; },
  createElement() { return makeEl(); },
  querySelectorAll() { return []; },
  querySelector() { return makeEl(); },
  addEventListener(type, cb) { if (type === "DOMContentLoaded") documentStub._init = cb; },
  _init: null,
};
const sandbox = {
  window: {},
  document: documentStub,
  console: console,
  Math: Math,
  Date: Date,
  JSON: JSON,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  requestAnimationFrame: (cb) => cb(),
  setTimeout: (cb) => cb(),
  addEventListener: noop,
  removeEventListener: noop,
  Chart: function () { return { destroy: noop, update: noop, data: {}, options: {} }; },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

vm.createContext(sandbox);
vm.runInContext(realdataSrc, sandbox, { filename: "realdata.js" });
vm.runInContext(holdingsSrc, sandbox, { filename: "holdings.js" });
vm.runInContext(dataSrc, sandbox, { filename: "data.js" });
vm.runInContext(appSrc, sandbox, { filename: "app.js" });

// 触发 init
if (documentStub._init) documentStub._init();
console.log("[1] init() 执行完毕，无异常");

// 读取汇总表 DOM
const summaryHtml = registry["windowSummary"] ? registry["windowSummary"]._html : "";
const infoHtml = registry["chartInfo"] ? registry["chartInfo"]._html : "";
const rows = (summaryHtml.match(/data-key="([^"]+)"/g) || []).length;
console.log("[2] 区间表现汇总渲染行数:", rows, "(期望 7)");
// 精确抓取每行第 3 列（最大回撤）的负值，避免把负收益混进来
const rowBlocks = summaryHtml.split(/<tr[^>]*>/).slice(1);
const maxDDs = rowBlocks.map((rb) => {
  const tds = rb.split(/<td[^>]*>/).slice(1);
  const ddCell = tds[2] || "";
  const m = ddCell.match(/-(\d+\.\d+)%/);
  return m ? parseFloat(m[1]) : NaN;
}).filter((n) => !isNaN(n));
console.log("[3] 汇总表最大回撤值（7 区间）:", maxDDs.map((x) => x.toFixed(2) + "%").join(", "));
console.log("[4] chartInfo 含『最大回撤』:", infoHtml.includes("最大回撤"));
console.log("[5] chartInfo 含『成立以来』或『近1年』:", /成立以来|近1年/.test(infoHtml));

// ---- 复刻窗口/回撤逻辑，对真实数据做数值校验 ----
const TIME_WINDOWS = [
  { key: "since", label: "成立以来", months: null },
  { key: "5y", label: "近5年", months: 60 },
  { key: "3y", label: "近3年", months: 36 },
  { key: "1y", label: "近1年", months: 12 },
  { key: "6m", label: "近半年", months: 6 },
  { key: "3m", label: "近3月", months: 3 },
  { key: "1m", label: "近1月", months: 1 },
];
function parseDate(s) { const p = String(s).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); }
function addMonths(date, n) { return new Date(date.getFullYear(), date.getMonth() + n, date.getDate()); }
function getWindowSlice(fund, key) {
  const data = fund.data; if (!data || !data.length) return [];
  const last = data[data.length - 1]; const lastDate = parseDate(last.date);
  const w = TIME_WINDOWS.find((x) => x.key === key) || TIME_WINDOWS[3];
  let startIdx = 0;
  if (w.months !== null) { const start = addMonths(lastDate, -w.months); let i = 0; while (i < data.length && parseDate(data[i].date) < start) i++; startIdx = i; }
  if (key === "since" && fund.inception) { const inc = parseDate(fund.inception); let i = 0; while (i < data.length && parseDate(data[i].date) < inc) i++; startIdx = Math.max(startIdx, i); }
  return data.slice(startIdx);
}
// 与 app.js 真实逻辑保持一致：使用累计净值（复权）acc 计算收益与回撤
const valOf = (d) => (d.acc != null ? d.acc : d.nav);
function computeMetrics(slice) {
  if (!slice || !slice.length) return null;
  const first = slice[0], last = slice[slice.length - 1];
  const cumReturn = ((valOf(last) - valOf(first)) / valOf(first)) * 100;
  let peak = valOf(slice[0]), maxDD = 0;
  for (const d of slice) { const v = valOf(d); if (v > peak) peak = v; const dd = (peak - v) / peak * 100; if (dd > maxDD) maxDD = dd; }
  const changes = slice.map((d) => d.change || 0);
  const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
  const variance = changes.reduce((a, b) => a + (b - mean) * (b - mean), 0) / changes.length;
  const vol = Math.sqrt(variance) * Math.sqrt(252);
  return { cumReturn, maxDD, vol, startDate: first.date, endDate: last.date, count: slice.length };
}

const FUNDS = sandbox.FUNDS;
console.log("\n[6] 抽样校验（基金 / 成立以来收益 / 成立以来最大回撤 / 近1年最大回撤）:");
["513100", "017436", "539002", "017093", "007345"].forEach((code) => {
  const f = FUNDS.find((x) => x.code === code);
  const ms = computeMetrics(getWindowSlice(f, "since"));
  const m1 = computeMetrics(getWindowSlice(f, "1y"));
  console.log(`  ${code} ${f.name}: 成立${ms.startDate}~${ms.endDate} 收益=${ms.cumReturn.toFixed(1)}% 回撤=${ms.maxDD.toFixed(1)}% | 近1年回撤=${m1.maxDD.toFixed(1)}%`);
});

// 断言
let ok = true;
if (rows !== 7) { ok = false; console.log("FAIL: 汇总表行数应为7"); }
if (!maxDDs.every((x) => x >= 0 && x <= 100)) { ok = false; console.log("FAIL: 最大回撤越界"); }
if (!infoHtml.includes("最大回撤")) { ok = false; console.log("FAIL: chartInfo 缺最大回撤"); }
console.log("\n结果:", ok ? "PASS ✅" : "FAIL ❌");
process.exit(ok ? 0 : 1);
