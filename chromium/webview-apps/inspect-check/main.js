var checkContentWindow = function() {
  var browser1 = document.getElementById('browser1');
  if (!browser1) {
    window.console.log('<browser> element not found, abort');
    return;
  }
  //var cb = browser1.canGoBack();
  //var cf = browser1.canGoForward();
  //window.console.log('canGoBack: ' + cb + ', canGoForward: ' + cf);

  //var w = browser1.contentWindow;
  //window.console.log('contentWindow: ' + w);
};
window.setTimeout(checkContentWindow, 4000);

onload = function() {
  var b = document.getElementById('browser1');
  var isTag = !!b && ('contentWindow' in b);
  if (!isTag) {
    window.console.log('webview tag not found');
    b = document.getElementById('browser2');
    if (!b) {
      window.console.log('object tag not found');
      return;
    }
  }

  var gSrc =
      '<body>' +
      '  <div>This is guest</div>' +
      '  <div><img src="tia.png" width="27" height="23"/></div>' +
      '  <div><img src="http://deployment.googleapps.com/_/rsrc/1326052805284/Home/user-resources/google-icons-and-logos/apps-32.png"/></div>' +
      '  <input type="text" value="foobar"/>' +
      '  <script>' +
      '    window.console.log("console.log message from guest");' +
      '  </script>' +
      '</body>';
  window.console.log('Setting src for guest, isTag: ' + isTag);
  if (isTag) {
    b.setAttribute('src', 'data:text/html,' + gSrc);
  } else {
    b.src = 'data:text/html,' + gSrc;
  }
};
