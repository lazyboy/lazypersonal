lazy = lazy || {};

lazy.App = function() {
  this.views_ = {};
  this.initCalled_ = false;
};

lazy.App.prototype.init = function() {
  this.initCalled_ = true;
  // Bulk add view.
  lazy.core.has('lazy.views.Bulk');
  this.views_['bulk'] = new lazy.views.Bulk('bulk');
};

lazy.App.prototype.start = function() {
  if (!this.initCalled_) {
    this.init();
  }
  var view = this.views_['bulk'];
  if (!view) {
    window.console.log('app cannot find view');
    return;
  }
  view.start();
};

lazy.App.prototype.onUpstreamEvent = function(t, jsonStr) {
  window.console.log('app.onUpstreamEvent');
  if (t == 1) {
    var view = this.views_['bulk'];
    if (!view) {
      window.console.log('app cannot find view');
      return;
    }
    /*
    var d = document.createElement('div');
    d.innerText = jsonStr;
    d.style['color'] = 'green';
    document.body.appendChild(d);
    */
    window.console.log('Before eval');
    var obj = eval(jsonStr);
    window.console.log('After eval');
    view.onData(obj);
  }
};

lazy.App.prototype.handle = function(e, t, p) {
  if (t == 1) {
    var view = this.views_['bulk'];
    if (!view) {
      window.console.log('bulk view not found to handle event');
      return;
    }
    view.handleEvent(e, t, p);
  }
};

