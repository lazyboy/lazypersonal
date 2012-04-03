var lazy = {};

lazy.$ = function(id) { return document.getElementById(id); };

lazy.RENDER_DIV_ID = 'render-div-id';

lazy.render = function() {
  var div = document.createElement('div');
  div.id = lazy.RENDER_DIV_ID;
  document.body.appendChild(div);
};

lazy.demo = function() {
  lazy.render();

  var el = lazy.$('export-container');
  if (!el) { alert('export element not found'); return; }
  el.innerText = 'Rendered by main.js';

  // Test upstream message passing.
  var s = 'From downstream js';
  var slot = window['_abacus'] || _abacus;
  if (!slot) {
    alert('No connection to upstream');
  } else {
    var retValue = slot.receive(s);
    lazy.demoRender('[js]: sent to py, returned: ' + retValue);
  }

};

lazy.demoRender = function(str) {
  lazy.$(lazy.RENDER_DIV_ID).innerHTML += '<div>' + str + '</div>';
};

// Yet to pass py param.
lazy.py_void_connection = function(str) {
  lazy.demoRender('[js]: ' + str);
};

window['__lazy_py_void_connection'] = lazy.py_void_connection;
lazy.demo();
