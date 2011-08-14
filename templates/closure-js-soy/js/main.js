goog.provide('douche.main');

goog.require('douche.soy'); // Test soy.
goog.require('douche.Ids'); // Test other file import.
goog.require('goog.userAgent'); // Test library import.

douche.main.LOGLEVEL = 1;

$ = function(id) {
  return document.getElementById(id);
};

douche.main = function() {
  //alert('entry point');
  var content = douche.soy.main();
  $('content').innerHTML = content;
};

/** @type {douche.app} */
douche.main.app;

douche.main.start = function() {
  douche.main.GECKO = goog.userAgent.GECKO;
  // Check if soys are compiled properly.
  var test = douche.soy.mainSoyTemplate();
};

//window['_event_'] = douche.ev.handleEvent;
window.onload = douche.main.start;

