lazy = lazy || {};

lazy.RENDER_DIV_ID = 'render-div-id';

lazy.app = new lazy.App();

lazy.demo = function() {
  // Create demo placeholder element.
  var div = document.createElement('div');
  div.id = lazy.RENDER_DIV_ID;
  document.body.appendChild(div);

  var el = lazy.util.$('export-container');
  if (!el) { alert('export element not found'); return; }
  el.innerText = 'Rendered by main.js';


  // start app.
  lazy.app.start();
};

lazy.demoRender = function(str) {
  lazy.util.$(lazy.RENDER_DIV_ID).innerHTML += '<div>' + str + '</div>';
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

// ------- BEG py connections -------
lazy.PY_RECV_UPSTREAM_FUNC_NAME = '__lazy_py_downwards';
lazy.PY_SEND_UPSTREAM_FUNC = window['__lazy_py_upwards'];

lazy.onUpstreamEvent = function(t, jsonStr) {
  window.console.log('*******onUpstreamEvent')
  //var obj = eval(jsonStr);
  if (t == 1) {
    //window.console.log('jsonStr is: ' + jsonStr);
    lazy.app.onUpstreamEvent.apply(lazy.app, arguments);
  }
};

lazy.sendUpstream = function(t, jsonObj) {
  window.console.log('sendUpstream: ' + t);
  var slot = lazy.PY_SEND_UPSTREAM_FUNC;
  if (!slot) {
    window.console.log('Cannot send upstream, no slot');
    return;
  }
  var ret = slot.fromJs(t, jsonObj);
  window.console.log('sent upstream, value = ' + ret);
};

window[lazy.PY_RECV_UPSTREAM_FUNC_NAME] = lazy.onUpstreamEvent;
// ------- EOF py connections -------

lazy.demo();
window.console.log('Writing to console!!!!!!!');
