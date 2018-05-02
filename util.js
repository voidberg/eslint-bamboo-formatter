var decodeXML = require("entities").decodeXML;

function format(result) {
  var formatted = '';
  var msg = [];
  var counter = 1;

  if (result.errorCount === 1) {
    formatted = '1 Failure: ';
  } else {
    formatted = result.errorCount + ' Failures: ';
  }

  result.messages.forEach(function iterator(message) {
    msg.push(counter + '. line ' + message.line + ', column ' + message.column + ': ' + decodeXML(message.message));
    counter++;
  });

  formatted += msg.join('\n');

  return formatted;
}

module.exports = {
  format: format,
};
