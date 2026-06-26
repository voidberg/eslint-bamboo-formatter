import { describe, it, expect, vi } from 'vitest';
import { ESLint } from 'eslint';
import { buildReport } from './index';

async function lint(code: string, label: string): Promise<ESLint.LintResult[]> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: {
      rules: {
        'no-var': 'error',
        'prefer-const': 'error',
        semi: ['error', 'always'],
        'no-unused-vars': 'warn',
      },
    },
  });

  // Lint under the cwd so the file isn't treated as "outside base path", then
  // stabilize the reported path so snapshots don't depend on the machine cwd.
  const results = await eslint.lintText(code, { filePath: `${label}.js` });
  return results.map((result) => ({ ...result, filePath: `/src/${label}.js` }));
}

// Serialize with a fixed clock so the stats.start / stats.end timestamps are stable.
function reportJson(results: ESLint.LintResult[], asError?: boolean): string {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  try {
    return JSON.stringify(buildReport(results, asError), null, 2);
  } finally {
    vi.useRealTimers();
  }
}

describe('bamboo report', () => {
  it('reports a file with errors as a failure', async () => {
    const results = await lint('var x = 1\nvar y = 2\n', 'errors');
    expect(reportJson(results)).toMatchSnapshot();
  });

  it('treats a warning-only file as a pass by default', async () => {
    const results = await lint('const unused = 1;\n', 'warnings');
    expect(reportJson(results)).toMatchSnapshot();
  });

  it('reports a clean file as a pass', async () => {
    const results = await lint('const x = 1;\nconsole.log(x);\n', 'clean');
    expect(reportJson(results)).toMatchSnapshot();
  });

  it('counts warnings as failures when warningAsError is set', async () => {
    const results = await lint('const unused = 1;\n', 'warn');
    const report = buildReport(results, true);

    expect(report.stats.failures).toBe(1);
    expect(report.stats.passes).toBe(0);
    expect(report.failures[0].errorCount).toBe(1);
  });
});
