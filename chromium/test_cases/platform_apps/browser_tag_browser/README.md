# Browser Tag with Tabs

Original browser tag example from here:
http://github.com/GoogleChrome/chrome-app-samples/tree/master/browser-tag

I've added tabbing on top of the app.

Sample that shows how to use the [browser tag](http://developer.chrome.com/trunk/apps/app_external.html#browsertag)
in an app to create a mini browser.

The app's main window contains a `<browser>` that is sized to fit most of it
(via the `width` and `height` attributes). The location bar is used to
update its `src` attribute.

The browser is the preferred way for you to load web content into your app. It
runs in a separate process and has its own storage, ensuring the security and
reliability of your application.

## Resources

* [Browser](http://developer.chrome.com/trunk/apps/app_external.html#browsertag)
* [Permissions](http://developer.chrome.com/trunk/apps/manifest.html#permissions)

