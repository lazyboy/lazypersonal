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
  //this.onData([{'name':'one'},{'name':'foobar'}]);
  lazy.sendUpstream(1, {'value': ''});
};

lazy.views.Bulk.prototype.onData = function(files) {
  window.console.log('view.onData');
  lazy.util.renderJ(this.el_, 'templates.bulk.rows',
      {'rows': files});
};

