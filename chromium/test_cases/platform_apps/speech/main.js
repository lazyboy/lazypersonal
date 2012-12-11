window.onload = function() {
  window.console.log('onload');
  var el = document.getElementById('sid');
  if (!el) { window.console.log('element not found'); return; }
  el.onspeechchange = function() { window.console.log('**** onspeechchange'); }
};
