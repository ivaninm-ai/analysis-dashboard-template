// Chinese is the default interface language. These tests keep every interface string
// translated (a missing key would silently show English) and check that generated
// task text follows the owner's language. Other test files run in English.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ZH from '../app/shared/i18n-zh.mjs';
import { tr, tl, setLocale, normaliseLocale, useWorkerLocale, sentences } from '../app/shared/i18n.mjs';
import { ENTITIES, TASK_RULES } from '../app/shared/model.mjs';
import { readCsv, sheetify } from './helpers/csv.mjs';
import { applyTableMapping } from '../app/shared/mapping.mjs';
import { computeMetrics } from '../app/shared/metrics.mjs';
import { generateSuggestions } from '../app/shared/tasks.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const placeholders = s => [...s.matchAll(/\{(\d+)\}/g)].map(m => m[1]).sort().join(',');
const sourceFiles = () => [
  ...['app/app.js', 'app/setup-ui.js', 'app/file-readers.js'],
  ...readdirSync(path.join(root, 'app/shared')).filter(f => f.endsWith('.mjs') && !f.startsWith('i18n')).map(f => `app/shared/${f}`),
  ...readdirSync(path.join(root, 'worker')).filter(f => f.endsWith('.mjs')).map(f => `worker/${f}`),
];

test('every tr()/tl() text in the dashboard and worker has a Chinese translation with the same placeholders', () => {
  const missing = [], mismatched = [];
  let count = 0;
  for (const file of sourceFiles()) {
    const src = readFileSync(path.join(root, file), 'utf8');
    for (const m of src.matchAll(/\bt[rl]\(\s*'((?:[^'\\]|\\.)*)'/g)) {
      const key = m[1].replace(/\\(.)/g, (_, c) => (c === 'n' ? '\n' : c)).trim();
      count++;
      if (!(key in ZH)) missing.push(`${file}: ${key}`);
      else if (placeholders(key) !== placeholders(ZH[key])) mismatched.push(`${file}: ${key}`);
    }
  }
  assert.ok(count > 600, `expected the interface text to be wrapped (found ${count})`);
  assert.deepEqual(missing, [], 'untranslated interface text');
  assert.deepEqual(mismatched, [], 'placeholders differ between English and Chinese');
});

test('field descriptions, row meanings and task-rule names shown in the dashboard are translated', () => {
  const needed = [];
  for (const spec of Object.values(ENTITIES)) {
    needed.push(spec.row_meaning);
    for (const f of Object.values(spec.fields)) if (f.doc) needed.push(f.doc);
  }
  for (const rule of Object.values(TASK_RULES)) needed.push(rule.title);
  assert.deepEqual(needed.filter(k => !(k in ZH)), []);
});

test('language setting: Chinese by default, English on request, Malay briefs keep English screens', () => {
  assert.equal(normaliseLocale(''), 'zh-CN');
  assert.equal(normaliseLocale('zh-CN'), 'zh-CN');
  assert.equal(normaliseLocale('en-MY'), 'en');
  assert.equal(normaliseLocale('ms'), 'en');
  setLocale('zh-CN');
  assert.equal(tl('Prepare source'), '准备来源（Prepare source）');
  assert.equal(tl('+ Add task'), '+ 新增待办（Add task）');
  assert.equal(tr('data as of {0}', '2026-08-30'), '数据截至 2026-08-30');
  assert.equal(tr('No such interface text'), 'No such interface text', 'unknown text falls back to English');
  assert.equal(sentences('第一句。', '', '第二句。'), '第一句。第二句。');
  setLocale('en');
  assert.equal(tl('Prepare source'), 'Prepare source');
  assert.equal(sentences('One.', '', 'Two.'), 'One. Two.');
  const previous = process.env.DASHBOARD_LANGUAGE;
  delete process.env.DASHBOARD_LANGUAGE;
  assert.equal(useWorkerLocale(undefined), 'zh-CN', 'worker default before a business profile exists');
  assert.equal(useWorkerLocale('en'), 'en');
  process.env.DASHBOARD_LANGUAGE = 'en';
  assert.equal(useWorkerLocale('zh-CN'), 'en', 'maintainer override wins');
  if (previous === undefined) delete process.env.DASHBOARD_LANGUAGE; else process.env.DASHBOARD_LANGUAGE = previous;
});

test('task suggestions are written in the owner language; keys and dates do not change', () => {
  const pkg = JSON.parse(readFileSync(path.join(root, 'config/examples/betterspace-b2b.setup-package.json'), 'utf8'));
  const dir = path.join(root, 'test/fixtures/betterspace/b2b/day1');
  const records = {};
  for (const t of pkg.tables) records[t.entity] = applyTableMapping(t, sheetify(readCsv(path.join(dir, `${t.sheet_name}.csv`))), pkg).records;
  const metrics = computeMetrics(records, '2026-08-30', { periodStart: '2026-08-01', periodEnd: '2026-08-30' });
  setLocale('zh-CN');
  const zh = generateSuggestions(records, metrics, '2026-08-30', pkg.policies, 'RM');
  setLocale('en');
  const en = generateSuggestions(records, metrics, '2026-08-30', pkg.policies, 'RM');
  assert.deepEqual(zh.map(s => s.task_key), en.map(s => s.task_key));
  assert.deepEqual(zh.map(s => s.suggested_date), en.map(s => s.suggested_date));
  const pay = zh.find(s => s.task_key === 'payment_follow_up:BS-012');
  assert.match(pay.title, /^跟进 BS-012 的收款/);
  assert.match(pay.reason, /未收（已收 RM/);
  assert.match(pay.reason, /已逾期/);
  assert.ok(zh.every(s => /[一-鿿]/.test(s.title) && /[一-鿿]/.test(s.reason)), 'every generated task is in Chinese');
  assert.match(en.find(s => s.task_key === 'payment_follow_up:BS-012').title, /^Follow up payment for BS-012/);
});
