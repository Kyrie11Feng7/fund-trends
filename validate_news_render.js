// -*- coding: utf-8 -*-
const fs = require("fs");
const vm = require("vm");

function noop() {}
function makeCtx() {
  return {
    fillRect: noop, clearRect: noop, beginPath: noop, moveTo: noop, lineTo: noop,
    stroke: noop, fill: noop, arc: noop, closePath: noop, save: noop, restore: noop,
    translate: noop, scale: noop, rotate: noop, setLineDash: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    fillText: noop, measureText: () => ({ width: 10 }),
    getImageData: () => ({ data: [] }), putImageData: noop, drawImage: noop,
  };
}
const elements = {};
function makeEl(id) {
  if (elements[id]) return elements[id];
  const el = {
    _html: "",
    style: {},
    dataset: {},
    classList: { add: noop, remove: noop, contains: () => false, toggle: noop },
    set innerHTML(v) { this._html = v; },
    get innerHTML() { return this._html; },
    getContext: () => makeCtx(),
    canvas: { width: 300, height: 150 },
    getBoundingClientRect: () => ({ width: 300, height: 150, top: 0, left: 0, right: 300, bottom: 150, x: 0, y: 0 }),
    appendChild: noop, removeChild: noop, addEventListener: noop,
    removeEventListener: noop, setAttribute: noop, getAttribute: () => null,
    querySelector: () => makeEl(id + "_q"), querySelectorAll: () => [],
    focus: noop, click: noop, remove: noop, setProperty: noop,
    width: 300, height: 150,
  };
  elements[id] = el;
  return el;
}

const sandbox = {};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.console = console;
sandbox.document = {
  getElementById: (id) => makeEl(id),
  querySelector: (s) => makeEl("qs_" + s),
  querySelectorAll: () => [],
  addEventListener: (ev, fn) => { if (ev === "DOMContentLoaded") sandbox.__init = fn; },
  createElement: () => makeEl("created"),
};
sandbox.window.addEventListener = (ev, fn) => { if (ev === "DOMContentLoaded") sandbox.__init = fn; };
sandbox.addEventListener = sandbox.window.addEventListener;
sandbox.Chart = function () { return { destroy: noop, update: noop, data: {}, options: {} }; };
sandbox.requestAnimationFrame = (fn) => fn();
sandbox.setTimeout = (fn) => fn();
sandbox.Date = Date; sandbox.Math = Math; sandbox.JSON = JSON;
sandbox.parseFloat = parseFloat; sandbox.Number = Number; sandbox.String = String;
sandbox.localStorage = { getItem: () => null, setItem: noop };

vm.createContext(sandbox);
try {
  vm.runInContext(fs.readFileSync("js/realdata.js", "utf8"), sandbox);
  vm.runInContext(fs.readFileSync("js/holdings.js", "utf8"), sandbox);
  vm.runInContext(fs.readFileSync("js/data.js", "utf8"), sandbox);
  vm.runInContext(fs.readFileSync("js/app.js", "utf8"), sandbox);
  if (sandbox.__init) sandbox.__init();
} catch (e) {
  console.log("INIT 抛错（若发生在 fund 卡片迷你图属桩限制，不影响新闻渲染）:", e.message);
}

const html = elements["newsTimeline"] ? elements["newsTimeline"].innerHTML : "";
console.log("newsTimeline 渲染长度:", html.length);
console.log("包含『可核实来源』:", html.includes("可核实来源"));
console.log("包含首条事件标题:", html.includes("美国6月CPI同比回落至3.5%"));
console.log("包含末条事件标题:", html.includes("美国5月非农"));
console.log("片段预览:", html.slice(0, 400).replace(/\n/g, " "));
