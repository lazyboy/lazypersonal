lazy.util = {};

lazy.util.$ = function(id) { return document.getElementById(id); };

lazy.util.renderElement = function(el, content) {
  if (el) {
    el.innerHTML = content;
  } else {
    lazy.log.debug('Element not found to render');
  }
};

/** @map<string, string> */
lazy.util.tplNameCache_ = {};

/** Render an element using jquery template. */
lazy.util.renderJ = function(el, tplScriptName, data, opt_dontClear) {
  var namedTpl = lazy.util.tplNameCache_[tplScriptName];
  if (!namedTpl) { // compile and add to cache.
    var tplScriptEl = lazy.util.$(tplScriptName);
    if (!tplScriptEl) {
      window.console.log('E: cannot find template script for: ' + tplScriptName);
      return;
    }
    namedTpl = 'lazytemplates.' + tplScriptName;
    // Save the name in map.
    lazy.util.tplNameCache_[tplScriptName] = namedTpl;
    window.console.log('Cached template of script: ' + tplScriptName +
        ' as named template: ' + namedTpl);
    // Create the template and store in jQuery cache.
    jQuery.template(namedTpl, tplScriptEl);
    window.console.log('I: compiled');
  } else {
    window.console.log('I: already compiled template, reuse');
  }

  if (!el) {
    window.console.log('bogus element passed to render, skip');
    return;
  }

  // Render it to an element.
  var renderedElement = $.tmpl(namedTpl, data);
  if (!opt_dontClear) {
    el.innerHTML = '';
  }
  el.innerHTML += renderedElement.html();
};

lazy.util.two_ = function(ii) {
  var ret = '' + ii
  if (ii < 10) ret = '0' + ret;
  return ret;
};

lazy.util.toDateStr = function(t) {
  var d = new Date(t);
  return d.getFullYear() + '/' +
      lazy.util.two_(d.getMonth()) + '/' +
      lazy.util.two_(d.getDate()) + ' - ' +
      lazy.util.two_(d.getHours()) + ':' +
      lazy.util.two_(d.getMinutes());
};

