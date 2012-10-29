namespace = namespace || {};

namespace.log = {};

namespace.log.error = function(var_args) {
  var msg = Array.prototype.join.call(arguments, ' ');
  window.console.error('Error: ' + msg);
};

namespace.log.msg = function(var_args) {
  var msg = Array.prototype.join.call(arguments, ' ');
  window.console.log(msg);
};

var LOG = namespace.log.msg;
var ERR = namespace.log.error;
