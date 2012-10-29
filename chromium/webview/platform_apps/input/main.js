var checkContentWindow = function() {
  var browser1 = document.getElementById('browser1');
  if (!browser1) {
    window.console.log('<browser> element not found, abort');
    return;
  }
  var cb = browser1.canGoBack();
  var cf = browser1.canGoForward();
  window.console.log('canGoBack: ' + cb + ', canGoForward: ' + cf);

  var w = browser1.contentWindow;
  window.console.log('contentWindow: ' + w);
};
window.setTimeout(checkContentWindow, 4000);
