lazy = lazy || {};

lazy.RENDER_DIV_ID = 'render-div-id';

lazy.UPSTREAM_LISTENER_FUNC = '__lazy_py_listener';

lazy.app = new lazy.App();

lazy.render = function() {
  var div = document.createElement('div');
  div.id = lazy.RENDER_DIV_ID;
  document.body.appendChild(div);
};

lazy.onUpstreamEvent = function(t, jsonStr) {
  window.console.log('*******onUpstreamEvent')
  //var obj = eval(jsonStr);
  if (t == 1) {
    window.console.log('jsonStr is: ' + jsonStr);
    lazy.demoRenderList(jsonStr);
    lazy.app.onUpstreamEvent.apply(lazy.app, arguments);
  }
};

lazy.sendUpstream = function(t, jsonObj) {
  window.console.log('sendUpstream: ' + t);
  var slot = window['_abacus'] || _abacus;
  var ret = slot.fromDownstream(t, jsonObj);
  window.console.log('sent upstream, value = ' + ret);
};

lazy.demo = function() {
  lazy.render();

  var el = lazy.util.$('export-container');
  if (!el) { alert('export element not found'); return; }
  el.innerText = 'Rendered by main.js';

  // Test upstream message passing.
  var s = 'From downstream js';
  var slot = window['_abacus'];
  if (!slot) {
    alert('No connection to upstream');
  } else {
    var retValue = slot.receive(s);
    lazy.demoRender('[js]: sent to py, returned: ' + retValue);
  }
  //lazy.viewTest();

  // start app.
  lazy.app.init();
  lazy.app.start();
};

lazy.viewTest = function() {
  /** View test. */
  lazy.core.has('lazy.views.Bulk');
  var bulk = new lazy.views.Bulk('bulk testing');
  bulk.render('<div style="font-size: 100px;">wow, dynamic script</div>');
  bulk.show(true);

  lazy.core.has('lazy.View');
  var view = new lazy.View('testing-foo');
  view.render('<div style="font-size: 100px;">wow, dynamic script</div>');
  view.show(true);
};


lazy.demoRender = function(str) {
  lazy.util.$(lazy.RENDER_DIV_ID).innerHTML += '<div>' + str + '</div>';
};

lazy.demoRenderList = function(jsonStr) {
  var ar = eval(jsonStr);
  var r = '';
  for (var i = 0; i < ar.length; ++i) {
    var el = ar[i];
    r += '<div style="background-color: black; color: white">';
    r += 'name: ' + el['name'];
    r += '</div>';
  }
  lazy.demoRender(r);
};

// Yet to pass py param.
lazy.py_void_connection = function(str) {
  lazy.demoRender('[js]: ' + str);
};

lazy.onSubmit = function() {
  var inputElem = lazy.util.$('mytext');
  if (!inputElem) {
    window.console.log('Not found element, abort');
    return;
  }
  var value = inputElem.value;
  window.console.log('input.value = ' + value);

  lazy.sendUpstream(1, {'value': value});

};

window['__lazy_py_void_connection'] = lazy.py_void_connection;
window['__lazy_py_listener'] = lazy.onUpstreamEvent;
lazy.demo();
window.console.log('Writing to console!!!!!!!');
