function encode(str) {
  var pair;
  var string = str;
  // Taken from jshint-reporter-bamboo
  var pairs = {
    '&:': '&amp;',
    '"': '&quot;',
    '\'': '&apos;',
    '<': '&lt;',
    '>': '&gt;',
  };

  for (pair in pairs) {
    if (typeof (string) !== 'undefined') {
      string = string.replace(new RegExp(pair, 'g'), pairs[pair]);
    }
  }
  return string || '';
}

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
    msg.push(counter + '. line ' + message.line + ', column ' + message.column + ': ' + encode(message.message));
    counter++;
  });

  formatted += msg.join('\n');

  return formatted;
}

module.exports = {
  encode: encode,
  format: format,
};
