import { decodeXML } from 'entities';
import type { ESLint } from 'eslint';

export function format(
  result: Pick<ESLint.LintResult, 'errorCount' | 'messages'>
): string {
  const prefix =
    result.errorCount === 1 ? '1 Failure: ' : `${result.errorCount} Failures: `;

  const messages = result.messages.map(
    (message, index) =>
      `${index + 1}. line ${message.line}, column ${message.column}: ${decodeXML(message.message)}`
  );

  return prefix + messages.join('\n');
}
