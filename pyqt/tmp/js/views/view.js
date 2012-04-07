lazy = lazy || {};

/**
 * Constructs a simple view.
 */
lazy.View = function(id) {
  this.el_ = document.createElement('div');
  this.el_.id = 'view-' + id;
  document.body.appendChild(this.el_);
};

lazy.View.prototype.el_;

/** Renders the view. */
lazy.View.prototype.render = function(content) {
  this.el_.innerHTML = content;
};

/** Shows/hides the view. */
lazy.View.prototype.show = function(value) {
  this.el_.style.display = value ? '' : 'none';
};

