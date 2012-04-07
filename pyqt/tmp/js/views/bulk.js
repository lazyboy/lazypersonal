lazy.views = lazy.views || {};
lazy.core.has('lazy.View')

/**
 * Bulk add/edit view.
 */
lazy.views.Bulk = function(id) {
  // parent ctor call.
  lazy.View.call(this, id);
};

// @extends lazy.View
lazy.views.Bulk.extends(lazy.View);

lazy.views.Bulk.prototype.render = function(content) {
  //this.el_.innerHTML = 'bulk\'s own render here ' + content;
};

lazy.views.Bulk.prototype.start = function() {
  // get data.
  window.console.log('Bulk.start');
  //debug
  this.onData([{'name':'one'},{'name':'foobar'}]);
//  lazy.sendUpstream(1, {'value': ''});
};

lazy.views.Bulk.prototype.onData = function(files) {
  window.console.log('view.onData');
  var z = lazy.util.$('templatesBulkRows');
  if (!z) {
    window.console.log('bulk template func not found');
    return;
  }
  z = jQuery(z);
  //debugger;
  if (!z.tmpl) {
    window.console.log('elements do not have tmpl function');
    return;
  }

  // TODO: Use caching for template function.
  // jQuery way.
  //z.tmpl({rows: files}).appendTo(this.el_);


  // Regular way.
  var el = z.tmpl({'rows': files});
  // TODO: Bad way though.
  this.el_.innerHTML = el.html();


/*
  lazy.util.renderJ(this.el_, 'templates.bulk.rows',
      {'rows': files});
      */
};

