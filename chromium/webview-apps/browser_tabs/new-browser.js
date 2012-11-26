var glob = {};
window.onresize = function() {
  var browser = namespace._my_browser_;
  if (!browser) { ERR('Where is the browser'); return; }
  var contents = browser.getDefaultContents();
  if (contents) {
    glob.doLayout(contents.getElement(), contents.getIdx());
  }
};

glob.browserInit = function(idx, div) {
  var boilerplate = document.getElementById('browser-boilerplate');
  if (!boilerplate) {
    ERR('boilerplate element not found');
    return;
  }
  var boilerplateClone = boilerplate.cloneNode(true);
  boilerplateClone.id = '';
  div.appendChild(boilerplateClone);
  boilerplateClone.style.position = 'relative';

  var browserHolder = div.querySelector('#browser-holder');
  if (!browserHolder) {
    ERR('browserHolder not found, abort');
    return;
  }
  browserHolder.innerHTML =
    '<webview id="bb-' + idx + '"' +
    ' src="http://www.google.com"' +
    ' style="width:500px; height: 500px;"></webview>';
  setTimeout(function() { glob.initStep2(div, boilerplateClone, idx); }, 0);
};


glob.initStep2 = function(div, boilerplateClone, idx) {
  LOG('glob.initStep2...');
  var b = boilerplateClone;

  //var browser = b.querySelector('webview');
  //var browser = document.body.querySelector('webview');
  var browser = document.getElementById('bb-'+idx);
  if (!browser) { ERR('<browser> element not found, die'); return; }
  /*
  browser.src = 'http://www.google.com';
  browser.width = '400';
  browser.height = '400';
  */

  // WHA???
  browser.parentNode.removeChild(browser);
  boilerplateClone.appendChild(browser);
  glob.doLayout(div, idx);

  window.setTimeout(
    function() { glob.initStep3(div, boilerplateClone, idx); }, 0);
};

glob.initStep3 = function(div, boilerplateClone, idx) {
  LOG('glob.initStep3...');
  var b = boilerplateClone;
  var browser = document.getElementById('bb-'+idx);
  b.querySelector('#back').onclick = function() { browser.back(); };
  b.querySelector('#forward').onclick = function() { browser.forward(); };
  b.querySelector('#reload').onclick = function() { browser.reload(); };
  b.querySelector('#terminate').onclick = function() { browser.terminate(); };

  b.querySelector('#home').onclick = function() {
    glob.navigateTo(b, 'http://www.google.com/');
  };
  b.querySelector('#location-form').onsubmit = function(e) {
    e.preventDefault();
    glob.navigateTo(b, b.querySelector('#location').value);
  };

  var y = browser.addEventListener('loadcommit', function(e) {
    div.classList.remove('crashed');
    if (!e.isTopLevel) return;
    b.querySelector('#location').value = e.url;
  });
  LOG('loadcommit add value:', y);

  browser.addEventListener('exit', function(event) {
    console.log(event.type);
    div.classList.add('crashed');
  });
  browser.addEventListener('loadstart', function(e) {
    div.classList.remove('crashed');
    if (!e.isTopLevel)  return;
    b.querySelector('#location').value = e.url;
  });
  browser.addEventListener('loadabort', function(e) {
    console.log('loadabort');
    console.log('  url: ' + e.url);
    console.log('  isTopLevel: ' + e.isTopLevel);
    console.log('  type: ' + e.type);
  });
  browser.addEventListener('loadredirect', function(e) {
    div.classList.remove('crashed');
    if (!e.isTopLevel) return;
    b.querySelector('#location').value = e.newUrl;
  });
};

glob.navigateTo = function(container, url) {
  container.classList.remove('crashed');
  container.querySelector('webview').src = url;
};

glob.doLayout = function(container, idx) {
  LOG('idx:', idx);
  var w = document.body.clientWidth;
  var h = document.body.scrollHeight;
  LOG('H:', h);
  document.body.querySelector('#root').style.height = h + 'px';

  var browser = document.getElementById('bb-'+idx);
  //var browser = container.querySelector('webview');
  var controls = container.querySelector('#controls');
  var controlsHeight = controls.offsetHeight;
  var windowWidth = container.offsetWidth;
  // boo.
  var tabHeight = 24;
  var windowHeight = container.offsetHeight - tabHeight - controlsHeight;
  LOG('layout to: ', windowWidth, windowHeight);

  // WHY?
  //browser.width = windowWidth;
  //browser.height = windowHeight - controlsHeight;
  //browser.setAttribute('width', windowWidth);
  //browser.setAttribute('height', windowHeight);
  browser.style.width = windowWidth + 'px';
  browser.style.height = windowHeight + 'px';

  var sadBrowser = container.querySelector('#sad-browser');
  sadBrowser.style.width = windowWidth + 'px';
  sadBrowser.style.height = windowHeight * 2/3 + 'px';
  sadBrowser.style.paddingTop = windowHeight/3 + 'px';
};

