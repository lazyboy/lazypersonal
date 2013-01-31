namespace = namespace || {};


/**
 * @constructor
 *
 * Represents (the only?) tab strip in the the browser.
 */
namespace.TabStrip = function() {
  this.tabs_ = [];
  this.initCalled_ = false;
  this.curTabIdx_ = -1;
  this.idx_ = namespace.TabStrip.IDX++;

  // DOM Elements.
  this.div_ = null;
  this.parent_ = null;
  this.addNewTabButton_ = null;
};

namespace.TabStrip.IDX = 1;

namespace.TabStrip.prototype.init = function(browser, div, opt_url) {
  if (this.initCalled_) ERR('Init already called, you might die.');
  if (!div) ERR('No div in TabStrip.init');

  this.initCalled_ = true;

  this.div_ = div;
  this.stripDiv_ = namespace.util.createDiv(
      'tabstrip-' + this.idx_, 'one-tabstrip', this.div_);
  this.addNewTabButton_ = namespace.util.createDiv(
      'addnew-', 'tab-ntp', this.stripDiv_);
  //this.addNewTabButton_.innerText = '+';
  this.addNewTabButton_.onclick = this.onNewTabButton_.bind(this);

  this.contentsContainerDiv_ = namespace.util.createDiv(
      'contents-container-' + this.idx_,
      'one-contents-container',
      this.div_);

  this.parent_ = browser;
  var tab = this.addNewTab(opt_url);

  tab.setCurrent(true);
};

namespace.TabStrip.prototype.addNewTab = function(opt_url) {
  LOG('TabStrip.addNewTab, opt_url:', opt_url);
  var tab = new namespace.Tab();
  tab.init(this);
  LOG('curTabIdx_', this.curTabIdx_);

  this.tabs_.push(tab);
  this.prevTabIdx_ = this.curTabIdx_;
  this.curTabIdx_ = this.tabs_.length - 1;

  if (!this.div_) ERR('TabStrip has no div :(');
  var tabDiv = tab.getElement();

  // LAME.
  this.stripDiv_.insertBefore(tabDiv, this.addNewTabButton_);

  var tabContents = tab.getContents();
  this.contentsContainerDiv_.appendChild(tabContents.getElement());

  tabDiv.classList.add('scale-initvalue');
  var animEndFunc = function(e) {
    LOG('animEndFunc-NTP');
    tabDiv.removeEventListener('webkitAnimationEnd', animEndFunc);
    tabDiv.style.webkitTransformOriginY = '';
    tabDiv.style.webkitAnimation = '';
  };
  tabDiv.addEventListener('webkitAnimationEnd', animEndFunc);
  tabDiv.style.webkitTransformOriginY = '100%';
  tabDiv.style.webkitAnimation = 'spawnTab 0.1s ease-in';

  return tab;
};

namespace.TabStrip.prototype.getCurrentTab = function() {
  if (this.curTabIdx_ < 0 || this.curTabIdx_ >= this.tabs_.length)
    ERR('Curious curTabIdx_ in getCurrentTab', this.curTabIdx_);
  return this.tabs_[this.curTabIdx_];
};

/** @private */
namespace.TabStrip.prototype.onNewTabButton_ = function() {
  LOG('NTP button clicked');
  var tab = this.addNewTab();

  if (this.prevTabIdx_ != -1) this.tabs_[this.prevTabIdx_].setCurrent(false);
  tab.setCurrent(true);
};

namespace.TabStrip.prototype.closeTab = function(tab_id) {
  // LAME.
  LOG('Close tab inner /w tab_id:', tab_id);
  if (this.tabs_.length <= 1) {
    LOG('Refuse to close the only tab.'); return;
  }
  var delIdx = -1;
  for (var i = 0; i < this.tabs_.length; ++i) {
    if (this.tabs_[i].getIdx() == tab_id) {
      LOG('Remove tab at idx', i);
      delIdx = i;
    }
  }
  if (delIdx == -1) {
    ERR('Tab not found to close'); return;
  }

  var closedCurrentTab = false;
  if (this.curTabIdx_ == delIdx) {
    closedCurrentTab = true;
  }
  var tabToDelete = this.tabs_[delIdx];

  var self = this;
  var el = tabToDelete.getElement();
  LOG('Close animating...');
  var self = this;
  var animEndFunc = function(e) {
    LOG('animEndFunc-XTP');
    el.removeEventListener('webkitAnimationEnd', animEndFunc);
    el.style.webkitTransformOriginY = '';
    el.style.webkitAnimation = '';

    self.tabs_.splice(delIdx, 1);
    tabToDelete.dispose();
    //el.parentNode.removeChild(el);
    delete tabToDelete;


    // Set the last tab as current tab.
    if (closedCurrentTab) {
      self.curTabIdx_ = self.tabs_.length - 1;
      if (self.curTabIdx_ < 0 || self.curTabIdx_ >= self.tabs_.length) {
        ERR('Impossibru curTabIdx_ after closeTab', self.curTabIdx_);
      }
      self.tabs_[self.curTabIdx_].setCurrent(true);
    } else {
      // Update curTabIdx_.
      if (delIdx < self.curTabIdx_) --self.curTabIdx_;
    }

    // TODO: Animate!
  };
  el.style.webkitTransformOriginY = '100%';
  el.addEventListener('webkitAnimationEnd', animEndFunc);
  el.style.webkitAnimation = 'destroyTab 0.2s ease-out';
};

namespace.TabStrip.prototype.getIndexOfTab = function(tab_id) {
  // LAME.
  for (var i = 0; i < this.tabs_.length; ++i)
    if (this.tabs_[i].getIdx() == tab_id) return i;
  return -1;
};

namespace.TabStrip.prototype.selectTab = function(tab_id) {
  LOG('TabStrip.selectTab', tab_id);
  var curTabId = this.tabs_[this.curTabIdx_].getIdx();
  if (curTabId != tab_id) {
    var oldIdx = this.curTabIdx_;
    var newIdx = this.getIndexOfTab(tab_id);
    if (newIdx == -1) { ERR('Bogus TabStrip.selectTab call, tab_id:', tab_id); return }
    this.curTabIdx_ = newIdx;
    LOG('swap set', newIdx, 'remove', oldIdx);
    this.tabs_[newIdx].setCurrent(true);
    this.tabs_[oldIdx].setCurrent(false);
  } else LOG('same');
};

// ---- ANIM
namespace.TabStrip.prototype.swapRight = function(idx) {
  var pos = -1;
  for (var i = 0; i < this.tabs_.length; ++i) {
    if (idx == this.tabs_[i].getIdx()) {
      pos = i; break;
    }
  }
  if (pos >= this.tabs_.length - 1) {
    LOG('No swap, already rightmost');
    return false;
  }
  var tab1 = this.tabs_[pos];
  var tab2 = this.tabs_[pos + 1];
  LOG('SwapRight, idx:', tab1.getIdx(), ',', tab2.getIdx());
  // swap pos and pos + 1
  var el1 = this.tabs_[pos].getElement();
  var el2 = this.tabs_[pos + 1].getElement();
  var animEndFunc = function(e) {
    LOG('**** webkitAnimationEndRight');
    el2.style.webkitAnimation = '';
    el2.removeEventListener('webkitAnimationEnd', animEndFunc);

    // Swap children.
    el2.parentNode.removeChild(el2);
    el1.parentNode.insertBefore(el2, el1);
  };
  el2.addEventListener('webkitAnimationEnd', animEndFunc);
  el2.style.webkitAnimation = 'moveTabLeft 0.1s ease-out';

  if (this.curTabIdx_ == pos) {
    this.curTabIdx_ = pos + 1;
  } else if (this.curTabIdx_ == pos + 1) {
    this.curTabIdx_ = pos;
  }
  this.tabs_[pos] = tab2;
  this.tabs_[pos + 1] = tab1;
  return true;
};

namespace.TabStrip.prototype.swapLeft = function(idx) {
  var pos = -1;
  for (var i = 0; i < this.tabs_.length; ++i) {
    if (idx == this.tabs_[i].getIdx()) {
      pos = i; break;
    }
  }
  if (pos <= 0) {
    LOG('No swap, already leftmost');
    return false;
  }
  var tab1 = this.tabs_[pos];
  var tab2 = this.tabs_[pos - 1];
  LOG('Swap idx:', tab1.getIdx(), ',', tab2.getIdx());
  // swap pos and pos - 1
  var el2 = this.tabs_[pos].getElement();
  var el1 = this.tabs_[pos - 1].getElement();

  var animEndFunc = function(e) {
    LOG('**** webkitAnimationEndLeft');
    el2.style.webkitAnimation = '';
    el1.removeEventListener('webkitAnimationEnd', animEndFunc);

    // Swap children.
    el2.parentNode.removeChild(el2);
    el1.parentNode.insertBefore(el2, el1);
  };
  el1.addEventListener('webkitAnimationEnd', animEndFunc);
  el1.style.webkitAnimation = 'moveTabRight 0.1s ease-out';

  if (this.curTabIdx_ == pos) {
    this.curTabIdx_ = pos - 1;
  } else if (this.curTabIdx_ == pos - 1) {
    this.curTabIdx_ = pos;
  }
  this.tabs_[pos] = tab2;
  this.tabs_[pos - 1] = tab1;
  return true;
};
