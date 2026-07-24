/**
 * 验证 realdata.js(旧快照) + realdata_extra.js(每日增量) 的前端合并结果
 * 模拟浏览器加载顺序：realdata.js -> realdata_extra.js
 * 校验点：
 *  1. 核心科技基金（如 513100/017436）末条日期比旧快照更新（增量追加生效）
 *  2. 合并后日期严格递增、无重复
 *  3. EXTRA 基金（510300 等）整段存在
 *  4. data.js 持有的数组引用不被替换（原地 push）
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {}, document: undefined, console };
ctx.window.window = ctx.window;
vm.createContext(ctx);

function runScript(file) {
  const code = fs.readFileSync(path.join(__dirname, 'js', file), 'utf8');
  vm.runInContext(code.replace(/\bwindow\b/g, 'window'), ctx, { filename: file });
}

// 1) 加载旧快照
runScript('realdata.js');
const R = ctx.window.REAL_FUND_DATA;
const before = {};
const refs = {};
for (const code of Object.keys(R)) {
  before[code] = { len: R[code].length, last: R[code][R[code].length - 1].date };
  refs[code] = R[code]; // 记录引用（模拟 data.js 持有）
}
console.log('[before] realdata.js 基金数 =', Object.keys(R).length);
console.log('[before] 513100 末日 =', before['513100'] && before['513100'].last);

// 2) 加载每日增量
runScript('realdata_extra.js');

let fail = 0;
const checkCodes = ['513100', '017436', '161128', '270023', '008253'];
for (const code of checkCodes) {
  const arr = R[code];
  if (!arr) { console.error('FAIL 缺失', code); fail++; continue; }
  const last = arr[arr.length - 1].date;
  const grew = before[code] ? arr.length > before[code].len : true;
  const newer = before[code] ? last > before[code].last : true;
  const sameRef = before[code] ? refs[code] === arr : true;
  // 日期严格递增
  let mono = true;
  for (let i = 1; i < arr.length; i++) if (arr[i].date <= arr[i - 1].date) { mono = false; break; }
  const ok = grew && newer && sameRef && mono;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${code}: ${before[code] ? before[code].last : '(无旧数据)'} -> ${last}, +${before[code] ? arr.length - before[code].len : arr.length} 条, 引用${sameRef ? '保持' : '被替换'}, 递增${mono ? 'OK' : '异常'}`);
}
// EXTRA 基金存在性
for (const code of ['510300', '510500', '159915', '511010', '518880']) {
  const arr = R[code];
  const ok = arr && arr.length >= 5;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} EXTRA ${code}: ${arr ? arr.length + ' 条, 末日 ' + arr[arr.length - 1].date : '缺失'}`);
}
console.log(fail === 0 ? '\n全部校验通过 ✔' : `\n${fail} 项失败 ✘`);
process.exit(fail === 0 ? 0 : 1);
