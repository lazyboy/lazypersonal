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
    // Convert to jQuery element.
    tplScriptEl = jQuery(tplScriptEl);
    if (!tplScriptEl.tmpl || !tplScriptEl.template) {
      window.console.log(
          'E: tplScriptName is probably not a template func container');
      return;
    }
    namedTpl = 'callme' + tplScriptName.replace(/\./g, '');
    // Cached it as named template.
    /*
    tplScriptEl.template(namedTpl);
    lazy.util.tplNameCache_[tplScriptName] = namedTpl;
    window.console.log('Cached template of script: ' + tplScriptName +
        ' as named template: ' + namedTpl);
        */


    var te = tplScriptEl.tmpl(data);
    el.appendChild(te);
  }

  if (!el) {
    window.console.log('bogus element passed to render, skip');
    return;
  }



  $.tmpl(''+namedTpl, data).appendto(jQuery(el));

/*
  // Render it to an element.
  var renderedElement = $.tmpl(namedTpl, data);
  if (!opt_dontClear) {
    el.innerHTML = '';
  }
  window.console.log('render: ' + renderedElement);
  el.appendChild(renderedElement);
*/
};

