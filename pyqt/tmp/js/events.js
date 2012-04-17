lazy.e = {};

lazy.e.handle = function(e, t, p) {
  lazy.app.handle(e, t, p);
};

window['_evt_'] = lazy.e.handle;
