var LOG = function(var_args) {
  var msg = Array.prototype.join.call(arguments, ' ');
  window.console.log('msg: ' + msg);
};

var continueFunction = function() {
  LOG('continue');
};

var getTag = function() {
  var tag = document.querySelector('webview');
  if (!tag) {
    LOG('tag not found');
  }
  return tag;
};

onload = function() {
  document.getElementById('binp').onclick = window['__change_dimension__'];
  //document.getElementById('hinp').onsubmit = window['__change_dimension__'];
  //document.getElementById('winp').onsubmit = window['__change_dimension__'];
  //document.getElementById('fooform').onsubmit = window['__change_dimension__'];

  var tag = getTag();
  if (!tag) return;
  var guestSrc = 'data:text/html,' +
      '<html>' +
      '<head>' +
      '<style type="text/css">'+
      '  body {margin: 0; padding: 0;}' +
      '</style>' +
      '<script type="text/javascript">' +
//      '  window.setInterval(function() { window.console.log("heartbeat"); }, 2000);' +
      '</script>' +
      '</head>' +
      '<body bgcolor="red">' +
      '  <div style="width: 20px; height: 60px; background-color: blue">H</div>' +
      '  <div style="background-color: black; height: 1px;"></div>' +
      '  <div>Guest contents</div>' +
      '  <div><input type="button" value="click"/><div>' +
      '</body>' +
      '</html>';
  tag.setAttribute('src', guestSrc);
  window.setTimeout(continueFunction, 0);
};

onresize = function() {
  var W = document.documentElement.clientWidth;
  var H = document.documentElement.clientHeight;
  //LOG('w', W, 'h', H);
  var tag = getTag();
  if (!tag) return;
  var tagH = Math.max(10, H-120);
  //LOG('set Height:', tagH);
  tag.style.height = tagH + 'px';
  var tagW = Math.max(10, W-120);
  tag.style.width = tagW + 'px';
};

window['__change_dimension__'] = function() {
  LOG('__change_dimension__');
  var tag = getTag();
  if (!tag) return;
  var w = document.getElementById('winp').value + 'px';
  var h = document.getElementById('hinp').value + 'px';
  LOG('w:', w, 'h:', h);
  tag.style.width = w;
  tag.style.height = h;
};
