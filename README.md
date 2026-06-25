# eslint-bamboo-formatter
[![npm version](https://img.shields.io/npm/v/eslint-bamboo-formatter.svg?style=flat)](https://www.npmjs.com/package/eslint-bamboo-formatter)
[![npm downloads per month](https://img.shields.io/npm/dm/eslint-bamboo-formatter.svg?style=flat)](https://www.npmjs.com/package/eslint-bamboo-formatter)
[![CI](https://github.com/voidberg/eslint-bamboo-formatter/actions/workflows/ci.yml/badge.svg)](https://github.com/voidberg/eslint-bamboo-formatter/actions/workflows/ci.yml)

> A reporter for eslint which produces a report compatible with Atlassian Bamboo Mocha Test Parser.

## What it does

[Bamboo](https://www.atlassian.com/software/bamboo) is Atlassian's CI server. Its Mocha Test Parser reads test results from a Mocha-style JSON file. This formatter writes ESLint results in that format, with one entry per linted file, so lint failures show up as test results in your Bamboo build report.

## Installation

```sh
npm install --save-dev eslint-bamboo-formatter
```

## Usage

Run ESLint with the formatter from the [CLI](https://eslint.org/docs/latest/use/command-line-interface):

```sh
eslint file.js -f node_modules/eslint-bamboo-formatter/reporter.js
```

The formatter only reads ESLint's results, so it works the same whether your project uses the flat config (`eslint.config.js`) or the legacy `.eslintrc`.

## Configuration

Two environment variables control the output:

- `ESLINT_FILE`: path of the JSON file to write (default `eslint.json`).
- `ESLINT_WARNING_AS_ERROR`: when set, warnings are counted as failures. Warnings are ignored by default.

## License

[MIT](https://github.com/voidberg/eslint-bamboo-formatter/blob/master/LICENSE)
