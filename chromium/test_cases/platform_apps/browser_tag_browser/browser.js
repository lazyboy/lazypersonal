namespace = namespace || {};

/** @constructor */
namespace.Browser = function() {
  this.tabstrips_ = [];
  this.curIdx_ = -1;
};

namespace.Browser.prototype.render = function() {
  // TODO(lazyboy): Multiple window.
};

namespace.Browser.prototype.init = function(div) {
  var tabstrip = new namespace.TabStrip();
  this.tabstrips_ = [tabstrip];
  tabstrip.init(this, div);
  this.curIdx_ = 0;
};

namespace.Browser.prototype.getDefaultContents = function() {
  var tabstrip = this.tabstrips_[this.curIdx_];
  if (!tabstrip) { ERR('No tabstrip'); return; }
  var tab = tabstrip.getCurrentTab();
  if (!tab) { ERR('No current tab'); return; }
  var contents = tab.getContents();
  if (!contents) { ERR('No current contents'); return; }
  return contents;
};
