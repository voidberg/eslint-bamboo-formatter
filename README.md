# eslint-bamboo-formatter

[![Latest release on NPM](https://img.shields.io/npm/v/eslint-bamboo-formatter.svg)](https://www.npmjs.com/package/eslint-bamboo-formatter)
[![npm module downloads per month](https://img.shields.io/npm/dm/eslint-bamboo-formatter.svg?style=flat)](https://www.npmjs.org/package/eslint-bamboo-formatter)
[![Build states](https://github.com/voidberg/eslint-bamboo-formatter/workflows/CI/badge.svg)](https://github.com/voidberg/eslint-bamboo-formatter/actions?query=workflow%3A%22CI%22+branch%3Amain++)
[![MIT License](https://img.shields.io/npm/l/eslint-bamboo-formatter.svg)](https://opensource.org/licenses/MIT)

> A reporter for eslint which produces a report compatible with Atlassian Bamboo Mocha Test Parser.

## What it does

Bamboo's Mocha Test Parser reads test results from a Mocha-style JSON file. This formatter writes ESLint results in that format, with one entry per linted file, so lint failures show up as test results in your Bamboo build report.

## Installation

```sh
npm install --save-dev eslint-bamboo-formatter
```

Requires Node.js 20.19 or newer.

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

## Example output

Linting one file with an error and one clean file produces:

```json
{
  "stats": {
    "tests": 2,
    "passes": 1,
    "failures": 1,
    "duration": 0,
    "start": "2026-06-25T12:00:00.000Z",
    "end": "2026-06-25T12:00:00.000Z"
  },
  "failures": [
    {
      "title": "bad.js",
      "fullTitle": "/src/bad.js",
      "duration": 0,
      "errorCount": 1,
      "error": "1 Failure: 1. line 2, column 5: Unexpected var, use let or const instead."
    }
  ],
  "passes": [
    {
      "title": "good.js",
      "fullTitle": "/src/good.js",
      "duration": 0,
      "errorCount": 0
    }
  ],
  "skipped": []
}
```

## Development

The formatter is written in TypeScript under `src/` and built with [tsup](https://tsup.egoist.dev/) to dual ESM/CJS with type declarations. The published `reporter.js` is a thin CommonJS entry that re-exports the build.

```sh
npm install
npm run build      # bundle to dist/ (ESM + CJS + .d.ts)
npm test           # run the vitest suite
npm run lint       # eslint flat config
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write
```

The Bamboo report format is pinned by snapshot tests, which generate realistic results through ESLint's Node API. Keep them green when touching the output.

## License

[MIT](https://github.com/voidberg/eslint-bamboo-formatter/blob/main/LICENSE)
