const test = require('node:test');
const assert = require('node:assert/strict');
const { format } = require('../util');

test('single error uses the singular prefix', () => {
  const out = format({
    errorCount: 1,
    messages: [{ line: 2, column: 5, message: 'Unexpected var' }],
  });
  assert.equal(out, '1 Failure: 1. line 2, column 5: Unexpected var');
});

test('multiple errors use the plural prefix and number each message', () => {
  const out = format({
    errorCount: 3,
    messages: [
      { line: 1, column: 1, message: 'a' },
      { line: 2, column: 2, message: 'b' },
      { line: 3, column: 3, message: 'c' },
    ],
  });
  assert.equal(
    out,
    '3 Failures: 1. line 1, column 1: a\n2. line 2, column 2: b\n3. line 3, column 3: c',
  );
});

test('decodes XML-escaped characters in messages', () => {
  const out = format({
    errorCount: 1,
    messages: [{ line: 1, column: 1, message: 'Strings must use &quot; not &#39;' }],
  });
  assert.equal(out, '1 Failure: 1. line 1, column 1: Strings must use " not \'');
});
