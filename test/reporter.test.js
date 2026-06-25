const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const reporterPath = path.resolve(__dirname, '..', 'reporter.js');

function runReporter(results, env) {
  const outFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ebf-')), 'eslint.json');
  const script = `require(${JSON.stringify(reporterPath)})(${JSON.stringify(results)});`;
  execFileSync(process.execPath, ['-e', script], {
    env: Object.assign({}, process.env, env, { ESLINT_FILE: outFile }),
  });
  return JSON.parse(fs.readFileSync(outFile, 'utf8'));
}

test('separates passing and failing files', () => {
  const out = runReporter([
    {
      filePath: '/project/src/bad.js',
      errorCount: 2,
      warningCount: 1,
      messages: [
        { line: 1, column: 1, message: 'first' },
        { line: 4, column: 7, message: 'second' },
      ],
    },
    {
      filePath: '/project/src/good.js',
      errorCount: 0,
      warningCount: 0,
      messages: [],
    },
  ]);

  assert.equal(out.stats.tests, 2);
  assert.equal(out.stats.passes, 1);
  assert.equal(out.stats.failures, 1);

  assert.equal(out.failures.length, 1);
  assert.equal(out.failures[0].title, 'bad.js');
  assert.equal(out.failures[0].fullTitle, '/project/src/bad.js');
  assert.equal(out.failures[0].duration, 0);
  assert.equal(out.failures[0].errorCount, 2);
  assert.equal(
    out.failures[0].error,
    '2 Failures: 1. line 1, column 1: first\n2. line 4, column 7: second',
  );

  assert.equal(out.passes.length, 1);
  assert.equal(out.passes[0].title, 'good.js');
  assert.equal(out.passes[0].fullTitle, '/project/src/good.js');
  assert.equal(out.passes[0].errorCount, 0);

  assert.deepEqual(out.skipped, []);
});

test('warnings only count as failures when ESLINT_WARNING_AS_ERROR is set', () => {
  const results = [{
    filePath: '/p/warn.js',
    errorCount: 0,
    warningCount: 2,
    messages: [
      { line: 1, column: 1, message: 'w1' },
      { line: 2, column: 1, message: 'w2' },
    ],
  }];

  const without = runReporter(results, {});
  assert.equal(without.stats.failures, 0);
  assert.equal(without.stats.passes, 1);

  const withFlag = runReporter(results, { ESLINT_WARNING_AS_ERROR: 'true' });
  assert.equal(withFlag.stats.failures, 1);
  assert.equal(withFlag.stats.passes, 0);
  assert.equal(withFlag.failures[0].errorCount, 2);
});
