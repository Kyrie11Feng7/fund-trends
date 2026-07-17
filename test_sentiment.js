/**
 * 端到端验证：用万能 DOM 桩加载真实数据 + app.js，触发 init()，
 * 检查市场情绪详解板块（renderSentimentDetail）的数值注入、标签着色、指针定位是否正确。
 */
const fs = require("fs");

function noop() { return undefined; }
const NUM_PROPS = new Set([
  "width", "height", "top", "left", "right", "bottom",
  "clientWidth", "clientHeight", "offsetWidth", "offsetHeight",
  "scrollWidth", "scrollHeight", "naturalWidth", "naturalHeight",
  "length", "x", "y",
]);
function makeEl() {
  const store = {
    style: {},
    classList: { add: noop, remove: noop, contains: () => false, toggle: noop },
    dataset: {},
  };
  return new Proxy(store, {
    get(t, p) {
      if (p in t) return t[p];
      if (typeof p === "symbol") return undefined;
      if (typeof p === "string" && NUM_PROPS.has(p)) return 0;
      if (p === "getContext") return () => makeEl();
      if (p === "canvas") return makeEl();
      if (p === "createLinearGradient" || p === "createRadialGradient") return () => ({ addColorStop: noop });
      if (p === "getBoundingClientRect") return () => ({ width: 300, height: 150, top: 0, left: 0, right: 300, bottom: 150, x: 0, y: 0 });
      if (p === "appendChild" || p === "removeChild") return () => {};
      if (p === "addEventListener") return noop;
      if (p === "querySelectorAll") return () => [];
      if (p === "querySelector") return () => makeEl();
      if (p === "getAttribute") return () => null;
      if (p === "setAttribute") return noop;
      if (p === "focus" || p === "click" || p === "remove" || p === "setProperty") return noop;
      return noop; // 未知属性当作 no-op 方法，调用安全
    },
    set(t, p, v) { t[p] = v; return true; },
  });
}

const els = {};
global.document = {
  getElementById: (id) => { if (!els[id]) els[id] = makeEl(); return els[id]; },
  addEventListener: (ev, cb) => { if (ev === "DOMContentLoaded") global.__init = cb; },
  querySelectorAll: () => [],
  querySelector: () => makeEl(),
  createElement: () => makeEl(),
};
global.window = global;
global.addEventListener = noop;
global.removeEventListener = noop;
global.Chart = function () { return { destroy: noop, update: noop }; };
global.requestAnimationFrame = (cb) => cb();

function tryEval(file) {
  const src = fs.readFileSync(file, "utf8");
  try { eval(src); }
  catch (e) { console.log(`EVAL ERROR in ${file}:`, e.message); throw e; }
}

try {
  tryEval("js/realdata.js");
  tryEval("js/holdings.js");
  tryEval("js/data.js");
  tryEval("js/app.js");
  if (global.__init) global.__init();
  console.log(">>> INIT OK (无运行时错误)\n");
} catch (e) {
  console.log(">>> INIT ERROR:", e.message);
  console.log(e.stack.split("\n").slice(0, 6).join("\n"));
}

function show(id) {
  const e = els[id];
  if (!e) return "MISSING";
  return e.textContent !== undefined ? e.textContent : "[set]";
}
console.log("恐惧贪婪指数:");
console.log("  fgValue     =", show("fgValue"));
console.log("  fgTag       =", show("fgTag"), "| class =", els["fgTag"] && els["fgTag"].className);
console.log("  fgPointer   =", els["fgPointer"] && els["fgPointer"].style.left);
console.log("  fgDesc      =", show("fgDesc"));
console.log("VIX 恐慌指数:");
console.log("  vixValue    =", show("vixValue"));
console.log("  vixTag      =", show("vixTag"), "| class =", els["vixTag"] && els["vixTag"].className);
console.log("  vixPointer  =", els["vixPointer"] && els["vixPointer"].style.left);
console.log("  vixDesc     =", show("vixDesc"));
console.log("数据来源:");
console.log("  sentDataDate   =", show("sentDataDate"));
console.log("  sentDataSource =", show("sentDataSource"));
