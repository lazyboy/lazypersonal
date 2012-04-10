var lazy;
lazy = {};

lazy.ww = function(str) { window.console.log(str); };

lazy.ac = function(el, id, req, rend) {
  this.el_ = el;
  this.id_ = id;
  this.resEl_ = el.parentNode.getElementsByClassName('res-helper')[0];
  lazy.ww('init selectedIdx_ to -1');
  this.selectedIdx_ = -1;
};

lazy.ac.instances_ = {};

lazy.ac.prototype.reset = function() {
  this.selectedIdx_ = -1;
  this.el_.value = '';
  this.render_([]);
};

lazy.ac.prototype.render_ = function(ar) {
  this.results_ = ar;
  if (!ar.length) {
    lazy.ww('results clear');
    this.resEl_.innerHTML = '';
    this.resEl_.style.display = 'none';
    return;
  }
  lazy.ww('render call');
  this.resEl_.style.display = '';

  // TODO: this would call rend interface.
  this.resEl_.innerHTML = '';
  for (var i = 0; i < ar.length; ++i) {
    var nom = ar[i]['name'], id = ar[i]['id'];
    var tpl = document.getElementById('ac-row-gen').cloneNode(true);
    tpl.style.display = '';
    lazy.ww('render ' + i + ': ' + nom, ', ' + id);
    tpl.getElementsByClassName('ac-res-str')[0].innerText = nom;
    tpl.getElementsByClassName('ac-res-id')[0].innerText = id;
    this.resEl_.appendChild(tpl);
  }
  this.setSelected_(0);
};

lazy.ac.prototype.onResult_ = function(ar) {
  lazy.ww('onResult_');
  this.render_(ar);
};

lazy.ac.prototype.setSelected_ = function(idx) {
  if (!this.results_ || !this.results_.length) {
    lazy.ww('nothing to do here');
    return;
  }
  if (idx < 0 || idx >= this.results_.length) {
    lazy.ww('out of range');
    return;
  }

  this.selectedIdx_ = -1;
  var els = this.resEl_.getElementsByClassName('css-ac-row-gen');
  lazy.ww('rows found: ' + els.length);
  for (var i = 0; i < els.length; ++i) {
    if (i == idx) {
      lazy.ww('set selected: ' + i);
      this.selectedIdx_ = i;
      els[i].className += ' ac-row-selected';
    } else {
      els[i].className = els[i].className.replace(' ac-row-selected', '');
    }
  }
};

lazy.ac.prototype.setSelectedDelta_ = function(delta) {
  if (!this.results_ || !this.results_.length) {
    lazy.ww('no results, bail out');
    return;
  }
  if (this.selectedIdx_ < 0) {
    lazy.ww('selectedIdx_ is: ' + this.selectedIdx_);
    return;
  }
  var n = this.results_.length;
  var nxt = this.selectedIdx_ + delta;
  while (nxt < 0) nxt += n;
  while (nxt >= n) nxt -= n;
  //lazy.ww('nxt: ' + nxt);
  this.setSelected_(nxt);
};

lazy.ac.prototype.sendAdd_ = function() {
  var res = this.results_[this.selectedIdx_];
  lazy.ww('added this: ' + res['id'] + ', ' + res['name']);
  this.reset();
};

lazy.ac.prototype.onTunnel = function(e, t) {
  if (t == 1) { // enter
    lazy.ww('focus');
    if (!this.el_.value) {
      this.render_([]);
    } else {
      if (this.results_) { // picking up last results?
        this.render_(this.results_);
      }
    }
  } else if (t == 2) { // keyup
    var keyCode = e.keyCode;
    lazy.ww('keypress: ' + e.keyCode);

    if (keyCode == 9) { // tab
      e.preventDefault();
      this.setSelectedDelta_(1);
      return false;
    } else if (keyCode == 38) { // up
      e.preventDefault();
      this.setSelectedDelta_(-1);
      return false;
    } else if (keyCode == 40) { // dn
      e.preventDefault();
      this.setSelectedDelta_(1);
      return false;
    } else if (keyCode == 13) { // return
      e.preventDefault();
      // we have the selection
      this.sendAdd_();
      return false;
    }
  } else if (t == 3 || t == 6) {
    if (t == 6) { // onsearch, used for x click detection only.
      // only used for clearing search
      var value = this.el_.value;
      if (value && value != '') {
        // this is triggered for some evt other than clicking x, bail out.
        return;
      }
    }
    var keyCode = e.keyCode;
    if (keyCode == 9 || keyCode == 38 || keyCode == 40 || keyCode == 13) {
      lazy.ww('skip keyup');
      return false;
    }
    var value = this.el_.value;
    // TODO: this would call req interface.
    var self = this;
    window.setTimeout(function() {
      var resAr = [];
      for (var i = 0; i < 5; ++i) {
        resAr.push({id: 'zzz' + i, name: value + 'foobar' + i});
      }
      self.onResult_(resAr);
    }, 0);
  } else if (t == 4) { // blur
    lazy.ww('blur');
    this.resEl_.style.display = 'none';
  } else {
    window.console.log('unknown type in tunnel'); return;
  }
};


lazy.ac.tunnel = function(e, el, t) {
  window.console.log('lazy.ac.tunnel');
  var id = el.id;
  if (!id) { window.console.log('element must have a unique id'); return; }
  var ii = lazy.ac.instances_[id];
  if (!ii) { window.console.log('failed to get ac instance'); return; }
  ii.onTunnel(e, t);
};

lazy.ac.addButton = function() {
};

lazy.ac.attach = function(el) {
  if (!el) { window.console.log('bogus element'); return; }
  var id = el.id;
  if (!id) { window.console.log('element must have a unique id'); return; }
  lazy.ww('attaching');
  lazy.ac.instances_[id] = new lazy.ac(el, id);
};

lazy.ac.init = function() {
  lazy.ac.attach(document.getElementById('ac-input'));
};

lazy.ac.panik = function(e, el) {
};

window['_tunnel'] = lazy.ac.tunnel;
window['_add'] = lazy.ac.addButton;
window['_acselect'] = lazy.ac.panik;
