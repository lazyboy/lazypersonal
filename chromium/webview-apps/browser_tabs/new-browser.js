var glob = {};
window.onresize = function() {
  var browser = namespace._my_browser_;
  if (!browser) { ERR('browser not found.'); return; }
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

  // Needs to be async at this point.
  setTimeout(function() { glob.browserInitAsyncStep2(div, boilerplateClone, idx); }, 0);
//  glob.browserInitAsyncStep2(div, boilerplateClone, idx);
};


glob.browserInitAsyncStep2 = function(div, boilerplateClone, idx) {
  LOG('glob.browserInitAsyncStep2');
  var webview = document.getElementById('bb-'+idx);
  if (!webview) { ERR('<webview> element not found, die'); return; }

  // Tricky part, reparent stuff.
  // TODO(lazyboy): Fix. Do we still need this?
  webview.parentNode.removeChild(webview);
  boilerplateClone.appendChild(webview);
  glob.doLayout(div, idx);

  // Set up click handlers in chrome.
  boilerplateClone.querySelector('#back').onclick = function() { webview.back(); };
  boilerplateClone.querySelector('#forward').onclick = function() { webview.forward(); };

  var reloadButton = boilerplateClone.querySelector('#reload');
  var isLoading = false;
  reloadButton.onclick = function(e) {
    LOG('#reload');
    webview.reload();
  };
  /*
  reloadButton.addEventListener('webkitAnitmationIteration', function(e) {
    if (!isLoading) {
    }
  });
  */
  boilerplateClone.querySelector('#terminate').onclick = function() { webview.terminate(); };

  boilerplateClone.querySelector('#home').onclick = function() {
    glob.navigateTo(boilerplateClone, 'http://www.google.com/');
  };
  boilerplateClone.querySelector('#location-form').onsubmit = function(e) {
    e.preventDefault();
    glob.navigateTo(boilerplateClone, boilerplateClone.querySelector('#location').value);
  };

  // Set up event listeners.
  LOG('Set up event listeners.');
  webview.addEventListener('loadcommit', function(e) {
    div.classList.remove('crashed');
    if (!e.isTopLevel) return;
    boilerplateClone.querySelector('#location').value = e.url;
  });

  webview.addEventListener('exit', function(event) {
    console.log(event.type);
    div.classList.add('crashed');
  });
  webview.addEventListener('loadstart', function(e) {
    div.classList.remove('crashed');
    if (!e.isTopLevel)  return;
    boilerplateClone.querySelector('#location').value = e.url;
  });
  webview.addEventListener('loadabort', function(e) {
    console.log('loadabort');
    console.log('  url: ' + e.url);
    console.log('  isTopLevel: ' + e.isTopLevel);
    console.log('  type: ' + e.type);
  });
  webview.addEventListener('loadredirect', function(e) {
    div.classList.remove('crashed');
    if (!e.isTopLevel) return;
    boilerplateClone.querySelector('#location').value = e.newUrl;
  });
};

glob.navigateTo = function(container, url) {
  container.classList.remove('crashed');
  container.querySelector('webview').src = url;
};

glob.doLayout = function(container, idx) {
  LOG('doLayout: ' + idx);
  var w = document.body.clientWidth;
  var h = document.body.scrollHeight;
  LOG('W:', w, 'H:', h);

  document.body.querySelector('#root').style.height = h + 'px';
  var browser = document.getElementById('bb-' + idx);
  var controls = container.querySelector('#controls');
  var controlsHeight = controls.offsetHeight;
  var windowWidth = container.offsetWidth;
  // boo.
  var tabHeight = 24;
  var windowHeight = container.offsetHeight - tabHeight - controlsHeight;
  LOG('layout to: ', windowWidth, windowHeight);

  browser.style.width = windowWidth + 'px';
  browser.style.height = windowHeight + 'px';

  var sadBrowser = container.querySelector('#sad-browser');
  sadBrowser.style.width = windowWidth + 'px';
  sadBrowser.style.height = windowHeight * 2/3 + 'px';
  sadBrowser.style.paddingTop = windowHeight/3 + 'px';
};

