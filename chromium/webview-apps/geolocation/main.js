onload = function() {
  window.console.log('Embedder loaded');
  var webview = document.getElementById('browser1');
  if (!webview) {
    console.log('No webview');
    return;
  }
  webview.addEventListener('permissionrequest', function(e) {
    console.log('Embedder permissionrequest');
    var reason = e.reason;
    console.log('reason: ' + e.reason);
    console.log('Allow from embedder');
    e.allow();
    //console.log('Deny from embedder');
    //e.deny();
  });
};

