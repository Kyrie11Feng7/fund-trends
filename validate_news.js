const fs = require("fs");
const vm = require("vm");
const sandbox = {};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.console = console;
sandbox.Date = Date;
sandbox.Math = Math;
sandbox.JSON = JSON;
sandbox.parseFloat = parseFloat;
sandbox.Number = Number;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("js/realdata.js", "utf8"), sandbox);
vm.runInContext(fs.readFileSync("js/data.js", "utf8"), sandbox);

const NEWS = sandbox.NEWS_EVENTS;
const FUNDS = sandbox.FUNDS;
console.log("事件数量:", NEWS.length);

let ok = true;
NEWS.forEach((n, i) => {
  const hasSrc = !!n.source;
  const hasDate = /^\d{4}-\d{2}-\d{2}$/.test(n.date);
  const validCat = ["货币政策", "经济数据", "地缘政治", "科技产业", "监管政策", "市场情绪"].includes(n.category);
  const validSent = ["positive", "negative", "neutral"].includes(n.sentiment);
  if (!hasSrc || !hasDate || !validCat || !validSent) ok = false;
  console.log(
    `#${i} ${n.date} [${n.category}/${n.sentiment}] src=${hasSrc ? "Y" : "N"} "${n.title.slice(0, 22)}"`
  );
});

const dates = NEWS.map((n) => n.date);
const sortedDesc = [...dates].sort((a, b) => b.localeCompare(a));
console.log("按日期降序排列正确:", JSON.stringify(dates) === JSON.stringify(sortedDesc));

const codes = new Set(FUNDS.map((f) => f.code));
const bad = [];
NEWS.forEach((n) => n.affectedFunds.forEach((c) => { if (!codes.has(c)) bad.push(c); }));
console.log("指向不存在的基金代码:", bad.length ? bad : "无");

console.log("全部字段校验:", ok ? "通过" : "存在问题");
