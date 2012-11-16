window.console.log('main.js loaded.');

var runExp2 = function() {
  window.console.log('runExp2');
  var el = document.getElementById('browser1');
  if (!el) {
    window.console.log('element not found\n');
    return;
  }
  window.console.log('Attaching permission request event handler');
  el.addEventListener('permissionrequest', function(e) {
    window.console.log('On permission request from embedder');
    window.console.log('permission type: ' + e.type);
    e.allow();
  });
  /*
  window.console.log('Attaching *custom* permission request event handler');
  el.addCustomEventListener('permissionRequest', function(e) {
    window.console.log('On permission request from embedder');
    window.console.log('permission type: ' + e.type);
    e.allow();
  });
  */
};

window.setTimeout(runExp2, 5000);
