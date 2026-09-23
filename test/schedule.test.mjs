import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { startFakeEnv, ROOT } from './helpers/fake-env.mjs';

test('CLI emits skipped/success/failed outputs and keeps source records out of public workflow summaries', async () => {
  const env = await startFakeEnv();
  const dir = mkdtempSync(path.join(tmpdir(), 'dashboard-schedule-'));
  const out = path.join(dir, 'output.txt'), summary = path.join(dir, 'summary.txt');
  try {
    const ws = await env.createWorkspace();
    const source = await env.createSourceFromFixture('b2b', 'day1');
    await env.importPackage(ws, env.loadPackage('b2b'));
    await env.bindSource(ws, 'main', source, 'PRIVATE CLIENT NAME');
    const run = async extra => new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ['worker/run.mjs', 'import', ...extra], { cwd: ROOT, env: { ...process.env, GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify(env.credentials), DASHBOARD_WORKSPACE_ID: ws, REFRESH_HOURS_UTC: 'off', GITHUB_OUTPUT: out, GITHUB_STEP_SUMMARY: summary } });
      let stdout = ''; child.stdout.on('data', d => { stdout += d; }); child.stderr.on('data', d => { stdout += d; });
      child.on('error', reject); child.on('close', code => resolve({ code, stdout }));
    });
    const skipped = await run(['--scheduled']);
    assert.equal(skipped.code, 0); assert.match(readFileSync(out, 'utf8'), /import_status=skipped/);
    assert.equal((await env.read(ws, 'Snapshots')).length, 0);
    const success = await run([]);
    assert.equal(success.code, 0); assert.match(readFileSync(out, 'utf8'), /import_status=success/);
    await env.admin('share', { id: source, principal: env.credentials.client_email, role: null });
    const failed = await run([]);
    assert.equal(failed.code, 1); assert.match(readFileSync(out, 'utf8'), /import_status=failed/);
    assert.doesNotMatch(success.stdout + failed.stdout + readFileSync(summary, 'utf8'), /PRIVATE CLIENT|BetterSpace|BS-001|91,090|91090/);
    // The output is consumed by the actual workflow condition, not exit status alone.
    const workflow = readFileSync(path.join(ROOT, '.github/workflows/import.yml'), 'utf8');
    assert.match(workflow, /id: refresh/);
    assert.match(workflow, /steps\.refresh\.outputs\.import_status == 'success'/);
    assert.match(workflow, /steps\.refresh\.outputs\.import_status == 'unchanged'/);
  } finally {
    await env.close();
    for (const file of [out, summary]) if (existsSync(file)) unlinkSync(file);
    rmdirSync(dir);
  }
});
