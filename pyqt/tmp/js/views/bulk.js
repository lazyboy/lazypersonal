lazy.views = lazy.views || {};
lazy.core.has('lazy.View')

/**
 * Bulk add/edit view.
 */
lazy.views.Bulk = function(id) {
};
// @extends lazy.View
lazy.views.Bulk.extends(lazy.View);

lazy.views.Bulk.prototype.render = function(content) {
  this.el_.innerHTML = 'bulk\'s own render here ' + content;
};

