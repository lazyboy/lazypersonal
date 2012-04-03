lazy.log = {};

lazy.log.logElement_ = null;

lazy.log.init = function() {
  var d = lazy.util.$('log-element');
  if (!d) {
    d = document.createElement('div');
    d.id = 'log-element';
    document.body.appendChild(d);
  }
  lazy.log.logElement_ = d;
};

lazy.log.debug = function(var_args) {
  var msg = Array.prototype.join.apply(arguments, ' ');
  lazy.log.logElement_.innerHTML +=
      lazy.templates.wrapDiv(msg, 'log-item');
};

// init
lazy.log.init();
