var glob = {};

// Does not work.
glob.browserInit = function() {
  window.console.log('Start glob.browserInit()');
  var d = document.getElementById('inner-div');
  var b = document.createElement('browser');
  b.width = '800';
  b.height = '600';
  b.src = 'http://www.google.com';
  d.appendChild(b);
};

// Works.
glob.browserInitInnerHtml = function() {
  var d = document.getElementById('inner-div');
  d.innerHTML =
    '<browser src="http://www.google.com" width="800" height="600"></browser>';
};

// Does not work.
glob.browserInitBody = function() {
  window.console.log('Start glob.browserInit()');
  var b = document.createElement('browser');
  b.width = '800';
  b.height = '600';
  b.src = 'http://www.google.com';
  document.body.appendChild.appendChild(b);
};

onload = glob.browserInit;
//onload = glob.browserInitInnerHtml;
//onload = glob.browserInitBody;
