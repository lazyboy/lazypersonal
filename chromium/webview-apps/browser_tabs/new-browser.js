var glob = {};

window.onresize = function() {
  var browser = namespace._my_browser_;
  if (!browser) { ERR('browser not found.'); return; }
  var contents = browser.getDefaultContents();
  if (contents) {
    glob.doLayout(contents.getElement(), contents.getIdx());
  }
};

glob.initializeNewTabContents = function(idx, div) {
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
  // TODO(lazyboy): A bit weird that we need to use different partition
  // for different tabs, fix this (Otherwise killing one tab would kill all?).
  browserHolder.innerHTML =
    '<webview id="bb-' + idx + '"' +
    ' src="http://www.google.com/"' +
    ' partition="persist:' + idx + '"' +
    ' style="width:500px; height: 500px;"></webview>';

  // Needs to be async at this point.
  // TODO(lazyboy): Fix this, probably the way we are adding webview into markup
  // above is to blame?
  setTimeout(function() {
    new glob.initializeTabContentsAsyncStates(div, boilerplateClone, idx);
  }, 0);
};

glob.initializeTabContentsAsyncStates = function(div, boilerplateClone, idx) {
  LOG('glob.browserInitAsyncStates');
  var webview = document.getElementById('bb-' + idx);
  if (!webview) { ERR('<webview> element not found, die'); return; }

  this.containerDiv = boilerplateClone;
  var containerDiv = boilerplateClone;
  this.isLoading = false;
  var self = this;

  // Tricky part, reparent stuff.
  // TODO(lazyboy): Fix. Do we still need this?
  webview.parentNode.removeChild(webview);
  boilerplateClone.appendChild(webview);
  glob.doLayout(div, idx);

  // Set up click handlers for chrome of the browser.
  containerDiv.querySelector('#back').onclick = function() {
    webview.back();
  };

  containerDiv.querySelector('#forward').onclick = function() {
    webview.forward();
  };

  containerDiv.querySelector('#home').onclick = function() {
    glob.navigateTo(boilerplateClone, 'http://www.google.com/');
  };

  containerDiv.querySelector('#reload').onclick = function(e) {
    if (self.isLoading) {
      webview.stop();
    } else {
      webview.reload();
    }
  };
  containerDiv.querySelector('#reload').addEventListener(
      'webkitAnimationIteration',function(e) {
        if (!self.isLoading) {
          self.containerDiv.classList.remove('loading');
        }
      });
  containerDiv.querySelector('#terminate').onclick = function() {
    webview.terminate();
  };

  containerDiv.querySelector('#location-form').onsubmit = function(e) {
    e.preventDefault();
    glob.navigateTo(containerDiv,
        containerDiv.querySelector('#location').value);
  };

  // Set up event listeners.
  LOG('Set up event listeners.');
  webview.addEventListener('exit', glob.handleExit.bind(this));
  webview.addEventListener('loadstart', glob.handleLoadStart.bind(this));
  webview.addEventListener('loadstop', glob.handleLoadStop.bind(this));
  webview.addEventListener('loadabort', glob.handleLoadAbort.bind(this));
  webview.addEventListener('loadredirect', glob.handleLoadRedirect.bind(this));
  webview.addEventListener('loadcommit', glob.handleLoadCommit.bind(this));
};

glob.handleExit = function(e) {
  LOG('handleExit: ' + e.type);
  glob.resetExitedState(this.containerDiv);
  this.containerDiv.classList.add('exited');
  if (e.type == 'abnormal') {
    this.containerDiv.classList.add('crashed');
  } else if (e.type == 'killed') {
    this.containerDiv.classList.add('killed');
  }
};

glob.resetExitedState = function(containerDiv) {
  containerDiv.classList.remove('exited');
  containerDiv.classList.remove('crashed');
  containerDiv.classList.remove('killed');
};

glob.handleLoadCommit = function(e) {
  LOG('handleLoadCommit');
  glob.resetExitedState(this.containerDiv);
  if (!e.isTopLevel) {
    return;
  }

  this.containerDiv.querySelector('#location').value = e.url;

  var webview = this.containerDiv.querySelector('webview');
  if (!webview) {
    ERR('Fatal: <webview> not found in container from loadcommit');
    return;
  }
  this.containerDiv.querySelector('#back').disabled = !webview.canGoBack();
  this.containerDiv.querySelector('#forward').disabled =
      !webview.canGoForward();
};

glob.handleLoadStart = function(e) {
  LOG('handleLoadStart');
  this.containerDiv.classList.add('loading');
  this.isLoading =  true;
  glob.resetExitedState(this.containerDiv);
  if (!e.isTopLevel) {
    return;
  }
  this.containerDiv.querySelector('#location').value = e.url;
};

glob.handleLoadStop = function(e) {
  LOG('handleLoadStop');
  // We don't remove the loading class immediately, instead we let the animation
  // finish, so that the spinner doesn't jerkily reset back to the 0 position.
  this.isLoading = false;
};

glob.handleLoadAbort = function(e) {
  LOG('loadAbort');
  LOG('  url: ' + e.url);
  LOG('  isTopLevel: ' + e.isTopLevel);
  LOG('  type: ' + e.type);
};

glob.handleLoadRedirect = function(e) {
  glob.resetExitedState(this.containerDiv);
  if (!e.isTopLevel) {
    return;
  }
  this.containerDiv.querySelector('#location').value = e.newUrl;
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

  var sadWebview = container.querySelector('#sad-webview');
  sadWebview.style.width = windowWidth + 'px';
  sadWebview.style.height = windowHeight * 2/3 + 'px';
  sadWebview.style.paddingTop = windowHeight/3 + 'px';
};

