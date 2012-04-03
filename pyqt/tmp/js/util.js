lazy.util = {};

lazy.util.$ = function(id) { return document.getElementById(id); };

lazy.util.renderElement = function(el, content) {
  if (el) {
    el.innerHTML = content;
  } else {
    lazy.log.debug('Element not found to render');
  }
};

