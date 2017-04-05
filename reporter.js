var fs = require('fs');
var path = require('path');
var util = require('./util');

var filename = process.env.ESLINT_FILE || 'eslint.json';
var warningAsError = process.env.ESLINT_WARNING_AS_ERROR || false;

module.exports = function reporter(results) {
  var output = {
    stats: {
      tests: 0,
      passes: 0,
      failures: 0,
      duration: 0,
      start: new global.Date(),
      end: new global.Date(),
    },
    failures: [],
    passes: [],
    skipped: [],
  };

  results.forEach(function iterator(result) {
    var errorCount = warningAsError ? (result.errorCount + result.warningCount) : result.errorCount;

    output.stats.tests++;

    if (errorCount) {
      output.stats.failures++;
      output.failures.push({
        title: path.basename(result.filePath),
        fullTitle: result.filePath,
        duration: 0,
        errorCount: errorCount,
        error: util.format(result),
      });
    } else {
      output.stats.passes++;
      output.passes.push({
        title: path.basename(result.filePath),
        fullTitle: result.filePath,
        duration: 0,
        errorCount: 0,
      });
    }
  });

  fs.writeFileSync(filename, JSON.stringify(output, null, 2), 'utf-8');

  // console.log(results);

  // var lintReporter = new LintReporter();
  // var data = lintReporter.runReport(results, true, false);
  //
  // return templateUtils.applyTemplates(data);
};
