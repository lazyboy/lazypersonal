lazy = lazy || {};

lazy.App = function() {
  this.views_ = {};
};

lazy.App.prototype.init = function() {
  // Bulk add view.
  lazy.core.has('lazy.views.Bulk');
  this.views_['bulk'] = new lazy.views.Bulk('bulk');
};

lazy.App.prototype.start = function() {
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
    view.onData(eval(jsonStr));
  }
};

