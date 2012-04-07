var lazy;

lazy = lazy || {};

lazy.core = {};

lazy.core.map_ = {};

/**
 * Loads a js file.
 * File can be specified with relative dir: etc/foo.js
 */
lazy.core.load = function(src) {
  // Does not work for synchronous loads.
  if (!lazy.core.map_[src]) {
    lazy.core.map_[src] = 1;
    var head = document.getElementsByTagName('head')[0];
    if (!head) {
      alert('I\'m dead');
      return;
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    head.appendChild(script);
  }
};

/**
 * Alerts if a package is not defined (yet).
 */
lazy.core.has = function(pack) {
  var namespaces = pack.split('.');
  window.console.log('namespace check: ' + namespaces.join('-'));
  var y = window;
  for (var i = 0; i < namespaces.length; ++i) {
    if (y[namespaces[i]] === undefined) {
      alert(pack + ' is not imported yet');
      throw 'Dead';
      return;
    }
    y = y[namespaces[i]];
  }
};

// http://phrogz.net/js/classes/OOPinJS2.html
Function.prototype.extends = function(par) {
  if (par.constructor == Function) {
    // Normal inheritance.
    this.prototype = new par;
    this.prototype.constructor = this;
    this.prototype.parent__ = par.prototype;
  } else {
    // Pure virtual inheritance.
    this.prototype = par;
    this.prototype.constructor = this;
    this.prototype.parent__ = par;
  }
  return this;
};

