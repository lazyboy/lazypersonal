var lazy = {};

lazy.$ = function(id) { return document.getElementById(id); };

lazy.demo = function() {
  var el = lazy.$('export-container');
  if (!el) { alert('export element not found'); return; }
  el.innerText = 'Rendered by main.js';
};

lazy.demo();