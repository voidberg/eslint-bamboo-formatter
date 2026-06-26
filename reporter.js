// Compatibility entry: keeps `-f node_modules/eslint-bamboo-formatter/reporter.js`
// working. The formatter itself lives in dist/ (built from src/ with tsup).
const mod = require('./dist/index.js');

module.exports = mod.default || mod;
