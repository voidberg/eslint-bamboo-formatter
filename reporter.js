const fs = require('fs');
const path = require('path');
const util = require('./util');

const filename = process.env.ESLINT_FILE || 'eslint.json';
const warningAsError = process.env.ESLINT_WARNING_AS_ERROR || false;

module.exports = function reporter(results) {
  const output = {
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
    const errorCount = warningAsError
      ? result.errorCount + result.warningCount
      : result.errorCount;

    output.stats.tests += 1;

    if (errorCount) {
      output.stats.failures += 1;
      output.failures.push({
        title: path.basename(result.filePath),
        fullTitle: result.filePath,
        duration: 0,
        errorCount,
        error: util.format(result),
      });
    } else {
      output.stats.passes += 1;
      output.passes.push({
        title: path.basename(result.filePath),
        fullTitle: result.filePath,
        duration: 0,
        errorCount: 0,
      });
    }
  });

  try {
    fs.writeFileSync(filename, JSON.stringify(output, null, 2), 'utf-8');
    process.exit();
  } catch {
    process.exit(1);
  }
};
