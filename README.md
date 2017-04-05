# eslint-bamboo-formatter
[![view on npm](http://img.shields.io/npm/v/eslint-bamboo-formatter.svg?style=flat)](https://www.npmjs.org/package/eslint-bamboo-formatter)
[![npm module downloads per month](http://img.shields.io/npm/dm/eslint-bamboo-formatter.svg?style=flat)](https://www.npmjs.org/package/eslint-bamboo-formatter)
[![Dependency status](https://david-dm.org/voidberg/eslint-bamboo-formatter.svg?style=flat)](https://david-dm.org/voidberg/eslint-bamboo-formatter)

> A reporter for eslint which produces a report compatible with Atlassian Bamboo Mocha Test Parser.

## Installation

```sh
npm install eslint-bamboo-formatter
```

## Usage

### With [ESLint CLI](http://eslint.org/docs/user-guide/command-line-interface):

```sh
eslint file.js -f node_modules/eslint-bamboo-formatter/reporter.js
```

### With [Gulp ESLint](https://github.com/adametry/gulp-eslint):

```js
var eslint   = require('gulp-eslint');
var reporter = require('eslint-bamboo-formatter');

gulp.src(['js/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format(reporter));
```

### Output

By default, the reporter writes to `eslint.json`. The file name can be changed by setting the `ESLINT_FILE` environment variable.
Warnings are not reported by default. If you want to report warnings as errors, set the environment variable `ESLINT_WARNING_AS_ERROR`.

## License

[MIT](https://github.com/voidberg/eslint-bamboo-formatter/blob/master/LICENSE)
