(function() {
  "use strict";
  var y = 'z';
  //delete y; // Fails in strict.
  var o = {a: 'myvalue', b: 'other_value'};
  delete o.a; // Works in both strict and non-strict.
  //delete o; // Fails in strict.
  window.onload = function() {
    window.console.log('document loaded');
    document.getElementById('contents').innerHTML = 'inner contents';
  };
})();
