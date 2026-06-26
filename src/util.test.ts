import { describe, it, expect } from 'vitest';
import type { ESLint } from 'eslint';
import { format } from './util';

type Partial = Pick<ESLint.LintResult, 'errorCount' | 'messages'>;

describe('format', () => {
  it('uses the singular prefix for a single failure', () => {
    const result = {
      errorCount: 1,
      messages: [{ line: 2, column: 3, message: 'Unexpected var' }],
    } as Partial;

    expect(format(result)).toBe(
      '1 Failure: 1. line 2, column 3: Unexpected var'
    );
  });

  it('uses the plural prefix and numbers each message', () => {
    const result = {
      errorCount: 2,
      messages: [
        { line: 1, column: 1, message: 'first' },
        { line: 5, column: 9, message: 'second' },
      ],
    } as Partial;

    expect(format(result)).toBe(
      '2 Failures: 1. line 1, column 1: first\n2. line 5, column 9: second'
    );
  });

  it('decodes XML-escaped characters in messages', () => {
    const result = {
      errorCount: 1,
      messages: [
        { line: 1, column: 1, message: 'use &quot;x&quot; &amp; &#39;y&#39;' },
      ],
    } as Partial;

    expect(format(result)).toBe(
      '1 Failure: 1. line 1, column 1: use "x" & \'y\''
    );
  });
});
