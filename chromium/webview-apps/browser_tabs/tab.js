namespace = namespace || {};

/** @constructor */
namespace.Tab = function() {
  this.title_ = 'about:blank';
  this.div_ = null;
  this.parent_ = null;
  this.initCalled_ = false;
  this.idx_ = namespace.Tab.IDX++;
};

namespace.Tab.IDX = 30;

namespace.Tab.prototype.setTitle = function(title) {
  this.title_ = title;
};

namespace.Tab.prototype.getTitle = function() {
  return '('+this.idx_+')'+this.title_;
};

namespace.Tab.prototype.getElement = function() {
  if (!this.div_) {
    var d = document.createElement('div');
    /*
    d.className = 'one-tab';
    d.setAttribute('draggable', true);
    d.onclick = this.selectTab_.bind(this);

    var closeButton = namespace.util.createDiv(
        '', 'one-tabclosebutton', d);
    closeButton.innerText = 'X';
    closeButton.onclick = this.onCloseClick_.bind(this);
    d.appendChild(closeButton);

    var titleDiv = document.createElement('div');
    titleDiv.className = 'one-tab-title';
    titleDiv.innerText = this.getTitle();
    d.appendChild(titleDiv);
    */

    d.className = 'innertab tab';
    d.onclick = this.selectTab_.bind(this);
    d.setAttribute('draggable', true);
    d.onmouseover = this.onMouseOver_.bind(this);
    d.onmouseout = this.onMouseOut_.bind(this);
    d.innerHTML =
        '<div class="middle2">' + this.getTitle() + '</div>' +
        '<div class="leftb2"></div>' +
        '<div class="rightb2"></div>' +
        '<div class="close16-button">' +
        '  <div class="close16-button-rotate"></div>' +
        '</div>';
    var closeButton = d.getElementsByClassName('close16-button')[0];
    if (!closeButton) { ERR('Close button not genereated.'); return null; }
    closeButton.onclick = this.onCloseClick_.bind(this);

    /// TEMP
    this.div_ = d;


    // drag.
    this.div_.addEventListener('dragstart', this.dragStart.bind(this), false);
    this.div_.addEventListener('drag', this.drag.bind(this), false);
    this.div_.addEventListener('dragend', this.dragEnd.bind(this), false);
  }
  return this.div_;
};

namespace.Tab.prototype.init = function(strip) {
  if (this.initCalled_) {
    namespace.log.error('Init already called, you might die.');
  }
  this.initCalled_ = true;

  this.parent_ = strip;
  LOG('create con');
  this.contents_ = new namespace.Contents(this, this.parent_);
  this.contents_.init();
};

namespace.Tab.prototype.getContents = function() {
  return this.contents_;
};

namespace.Tab.prototype.getInsertableDiv = function() {
  var div = this.getDiv();
  if (div.parentNode) div.parentNode.removeChild(div);
  return div;
};

namespace.Tab.prototype.onCloseClick_ = function(e) {
  LOG('Tab onCloseClick_');
  this.parent_.closeTab(this.idx_);
  e.stopPropagation();
};

namespace.Tab.prototype.getIdx = function() { return this.idx_; };

namespace.Tab.prototype.dispose = function() {
  LOG('Dispose tab /w idx', this.idx_);
  this.getContents().dispose();
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

namespace.Tab.prototype.setCurrent = function(show) {
  if (show) {
    LOG('setCurrent tab', this.idx_);
    // FIXME
    this.div_.classList.add('current');
    this.switchInnerClass_(true /* add */, 'current');
    this.getContents().show(show);
  } else {
    LOG('remove setCurrent tab', this.idx_);
    // FIXME
    this.div_.classList.remove('current');
    this.switchInnerClass_(false /* add */, 'current');
    this.getContents().show(show);
  }
};

namespace.Tab.prototype.selectTab_ = function() {
  LOG('Tab.selectTab_');
  this.parent_.selectTab(this.idx_);
};
namespace.Tab.prototype.onMouseOver_ = function(e) {
  //LOG('onMouseOver_');
  this.switchInnerClass_(true, 'hovered');
};
namespace.Tab.prototype.onMouseOut_ = function(e) {
  //LOG('onMouseOut_');
  this.switchInnerClass_(false, 'hovered');
};
namespace.Tab.prototype.switchInnerClass_ = function(add, className) {
  var func = add ? 'add' : 'remove';
  this.div_.getElementsByClassName('middle2')[0].classList[func](className);
  this.div_.getElementsByClassName('leftb2')[0].classList[func](className)
  this.div_.getElementsByClassName('rightb2')[0].classList[func](className);
};

// --- DRAG.
namespace.Tab.prototype.dragStart = function(e) {
  this.startX_ = e.x;
  LOG('startX_', this.startX_);
  this.fakeEl_ = this.div_.cloneNode(true);
  this.fakeEl_.style.position = 'absolute';
  this.fakeEl_.style.left = this.div_.offsetLeft + 'px';
  this.fakeEl_.style.top = this.div_.offsetTop + 'px';
  this.fakeEl_.style.width = this.div_.offsetWidth + 'px';
  // HACK: Remove 2px border hack.
  // FIXME
  this.fakeEl_.style.height = (this.div_.offsetHeight - 2) + 'px';
  this.fakeLeft_ = this.div_.offsetLeft;

  this.W_ = this.div_.offsetWidth / 2 + 4;
  this.orgW_ = this.div_.offsetWidth;
  this.nxtX_ = this.W_;
  this.prvX_ = -this.W_;

  this.div_.style.opacity = '0.0';
  //e.dataTransfer.setData('text', '+' + this.idx_);

  var p = this.div_.parentNode;
  var fakeEl = this.fakeEl_;

  // Cannot rettach and drag the same thing apparently.
  window.setTimeout(function() { p.appendChild(fakeEl); }, 0);
  //this.div_.parentNode.appendChild(this.fakeEl_);
};
namespace.Tab.prototype.drag = function(e) {
  var dx = e.x - this.startX_;
  if (!e.x && !e.y) {
    // This is dragEnd.
    this.fakeEl_.parentNode.removeChild(this.fakeEl_);
    this.fakeEl_ = null;
    this.div_.style.opacity = '1.0';
    this.parent_.selectTab(this.getIdx());
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (dx > this.nxtX_) {
    LOG('move too much to right');
    if (this.parent_.swapRight(this.idx_)) {
      this.nxtX_ += this.orgW_;
      this.prvX_ += this.orgW_;
    }
  } else if (dx < this.prvX_) {
    if (this.parent_.swapLeft(this.idx_)) {
      this.nxtX_ -= this.orgW_;
      this.prvX_ -= this.orgW_;
    }
  }

  //LOG('dx', dx, 'e:', e.x, ',', e.y);
  //this.div_.style.left = dx + 'px';
  var nx = this.fakeLeft_ + dx;
  // TODO: Make transform with a animation function?
  //this.fakeEl_.style.left = nx + 'px';
  this.fakeEl_.style.webkitTransform =
      'translate3d(' + dx + 'px, 0, 0)';

  //e.preventDefault();
};
namespace.Tab.prototype.dragEnd = function(e) {
  LOG('dragEnd');
  this.div_.style.position = 'relative';
  //this.div_.style.visibility = 'visible';
  if (this.fakeEl_) {
    this.fakeEl_.parentNode.removeChild(this.fakeEl_);
    this.fakeEl_ = null;
  }
  //e.preventDefault();
};

