/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('main.html', {}, function () {});
});
