/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {}, function () {});
  window.setTimeout(function() {
    // Check if this works.
    window.console.log('Log from test.js');
  }, 3000);
});
