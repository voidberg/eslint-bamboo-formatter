import { writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { ESLint } from 'eslint';
import { format } from './util';

const filename = process.env.ESLINT_FILE || 'eslint.json';
const warningAsError = Boolean(process.env.ESLINT_WARNING_AS_ERROR);

interface Failure {
  title: string;
  fullTitle: string;
  duration: number;
  errorCount: number;
  error: string;
}

interface Pass {
  title: string;
  fullTitle: string;
  duration: number;
  errorCount: number;
}

interface MochaReport {
  stats: {
    tests: number;
    passes: number;
    failures: number;
    duration: number;
    start: Date;
    end: Date;
  };
  failures: Failure[];
  passes: Pass[];
  skipped: never[];
}

export function buildReport(
  results: ESLint.LintResult[],
  asError: boolean = warningAsError
): MochaReport {
  const output: MochaReport = {
    stats: {
      tests: 0,
      passes: 0,
      failures: 0,
      duration: 0,
      start: new Date(),
      end: new Date(),
    },
    failures: [],
    passes: [],
    skipped: [],
  };

  results.forEach((result) => {
    const errorCount = asError
      ? result.errorCount + result.warningCount
      : result.errorCount;

    output.stats.tests += 1;

    if (errorCount) {
      output.stats.failures += 1;
      output.failures.push({
        title: basename(result.filePath),
        fullTitle: result.filePath,
        duration: 0,
        errorCount,
        error: format(result),
      });
    } else {
      output.stats.passes += 1;
      output.passes.push({
        title: basename(result.filePath),
        fullTitle: result.filePath,
        duration: 0,
        errorCount: 0,
      });
    }
  });

  return output;
}

const reporter = (results: ESLint.LintResult[]): void => {
  try {
    writeFileSync(
      filename,
      JSON.stringify(buildReport(results), null, 2),
      'utf-8'
    );
    process.exit();
  } catch {
    process.exit(1);
  }
};

export default reporter;
