const { decodeXML } = require('entities');

function format(result) {
  const prefix = result.errorCount === 1
    ? '1 Failure: '
    : `${result.errorCount} Failures: `;

  const messages = result.messages.map((message, index) => (
    `${index + 1}. line ${message.line}, column ${message.column}: ${decodeXML(message.message)}`
  ));

  return prefix + messages.join('\n');
}

module.exports = { format };
