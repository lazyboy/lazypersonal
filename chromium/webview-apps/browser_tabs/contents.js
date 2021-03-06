namespace = namespace || {};

/**
 * @constructor
 * 
 * Holds the contents for a tab.
 */
namespace.Contents = function(tab, tabstrip) {
  LOG('namespace.Contents ctor');
  this.tab_ = tab;
  this.tabstrip_ = tabstrip;
  this.div_ = null;
  this.idx_ = namespace.Contents.IDX++;
};

namespace.Contents.IDX = 20;

namespace.Contents.prototype.init = function() {
  this.div_ = namespace.util.createDiv('contents' + this.idx_, 'one-contents');
  // ACTUAL <WEBVIEW> content goes here.
  // Creates a tab + chrome + contents holder.
  glob.initializeNewTabContents(this.idx_, this.div_);
};

namespace.Contents.prototype.getIdx = function() {
  return this.idx_
};

namespace.Contents.prototype.getElement = function() {
  if (!this.div_) ERR('Contents getElement empty div.');
  return this.div_;
};

namespace.Contents.prototype.show = function(visible) {
  LOG('Contents.show:',visible,this.idx_);
  var b = document.getElementById('bb-'+this.idx_);
  if (!b) {
    ERR('browser not found on contents.show');
    return;
  }
  if (visible) {
    this.div_.style.position = 'relative';
    this.div_.style.top = '';
    //this.div_.style.left = '';
    this.div_.style.visibility = 'visible';
  }
  else {
    this.div_.style.position = 'absolute';
    this.div_.style.top = '-2000px;';
    //this.div_.style.left = '-1000px';
    this.div_.style.visibility = 'hidden';
  }
  //b.style.visibility = visible ? '' : 'hidden';
};

namespace.Contents.prototype.dispose = function() {
  LOG('Dispose contents /w idx', this.idx_);
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

