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
  for (var i = 0; i < files.length; ++i) {
    files[i]['et'] = 1;
    files[i]['ep'] = i;
    window.console.log('mtime: ' + files[i]['mtime']);
    var mtimeStr = lazy.util.toDateStr(
        1000 * files[i]['mtime']);
    window.console.log('formatted: ' + mtimeStr);
    files[i]['formattedMtime'] = mtimeStr;
  }
  lazy.util.renderJ(this.el_, 'templates.bulk.rows',
      {'rows': files});
};

lazy.views.Bulk.prototype.handleEvent = function(e, t, p) {
  var id = p['ep'];
  window.console.log('bulk event click id: ' + id);
};
