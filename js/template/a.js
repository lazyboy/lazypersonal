/**
 * Author: lazyboybd@gmail.com
 * Description: Foo bar testing javascript file.
 */

function $(id) { return document.getElementById(id); }
function gf(div, c) { return div.getElementsByClassName(c)[0]; }
var ENABLE_TIMING = true;

var alerted = false;
function _log(message) {
  var args = [].splice.call(arguments, 0);
  var msg = args.join(' ');
  if (!window['console'] || !window['console']['log']) {
    if (!alerted) {
      alerted = true;
      alert('not loggable browser: ' + msg);
    }
    return;
  }
  window['console']['log'](msg);
}

function _log_to_div(var_arg) {
  var args = [].splice.call(arguments, 0);
  var msg = args.join(' ');
  var div = document.createElement('div');
  div.innerHTML = msg;
  $('logdiv').appendChild(div);
}

// Add bind to functions.
Function.prototype.bind = function(scope) {
  var thisFunc = this;
  var boundFunc = function() {
    thisFunc.apply(scope, arguments);
  };
  return boundFunc;
};

lb = {};
lb.util = {};

lb.util.getProperties = function(obj) {
  var ret = '';
  for (var elem in obj) {
    ret += elem + ', ';
  }
  return ret;
};

