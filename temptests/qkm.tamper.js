// ==UserScript==
// @id             iitc-plugin-key-management@teo96
// @name           IITC plugin: Quicker key management
// @category       Info
// @version        0.0.1
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// -updateURL      https://secure.jonatkins.com/iitc/release/plugins/portals-list.meta.js
// -downloadURL    https://secure.jonatkins.com/iitc/release/plugins/portals-list.user.js
// @description    [jonatkins-2013-07-31-231326] Display an ingress app like key management item list, left/right no navigate, up/down to add/remove keys.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

// Note that this plugin has implicit dependency upon:
// a. window.plugin.portalslist
// b. window.
function wrapper() {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};



// PLUGIN START ////////////////////////////////////////////////////////

/* whatsnew
* 0.0.1 : initial release, shows screen like ingress app for quicker key management. Keys are listed alphabetically for now. left/right to previous/next key, up/down to increase/decrease key count.
*/ 

// use own namespace for plugin
window.plugin.keymanagement = function() {};
    
window.plugin.keymanagement.show = function() {
  var hasPortalsListPlugin = !!window.plugin.portalslist;
  var hasKeysPlugin = !!window.plugin.keys;
  
  if (!hasPortalsListPlugin || !hasKeysPlugin) {
    var req = []; if (!hasPortalsListPlugin) req.push('Portals list plugin [portalslist]'); if (!hasKeysPlugin) req.push('Keys plugin [keys]');
    alert('Following plugins is required to run keymanagement: \n' + req.join('\n'));
    return;
  }
    
  if (!window.plugin.portalslist.getPortals()) {
    alert('No portals to show');
    return;
  }
  var portals = window.plugin.portalslist.listPortals;
  portals.sort(function(a, b) { return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1 });
  var n = portals.length;
  var html = '';
  $.each(portals, function(ind, portal) {
    html += '<div>' + portal.name + '</div>';
  });
    
  var getPortalViewHtml = function(idx) {
    console.log('getPortalViewHtml: ' + idx);
    var currentPortal = portals[idx];
    console.log('idx: ' + idx + ', currentPortal: ' + currentPortal);
    var name = currentPortal.name;
    var guid = currentPortal.guid;
    var img = currentPortal.img;
    var level = currentPortal.level;
    var keysCount = plugin.keys.keys[guid] || 0;
    console.log('keysCount: ' + keysCount);
    ///return 'name: ' + name + ', guid: ' + guid;
    
    //console.log('team = ' + currentPortal.team);
    //var gTeam = (currentPortal.team == 'ALIENS' || currentPortal.team == 'ENLIGHTENED') ?
    //    TEAM_ENL : (currentPortal.team == 'RESISTANCE' ? TEAM_RES : TEAM_NONE);
    var team = currentPortal.team;

    var html = '';
    //html += '<div>[' + (idx+1) + ' of ' + n + ']</div>';
    html += '<div id="plugin-keys-ext-count" style="font-size: 14px;">[' + keysCount + ']</div>';
    return html +
      '<div class="' + TEAM_TO_CSS[team] + '">' +
      '<h3 class="title">'+escapeHtmlSpecialChars(name)+'</h3>' +
      '<div class="imgpreview"' + ' style="background-image: url('+img+')">' +
      '<span id="level" style="margin-top: 8px;">' + Math.floor(level) + '</span>' +
//      '<img class="hide" src="' + img + '"/></div>' +
      '</div>';
  };
  
  dialog({
    html: '<div id="foobar">' + /*html + */'</div><div class="testing-class portaldetails" style="text-align: center">' +
          '<div style="font-size: 14px; font-family: \"coda\",arial,helvetica,sans-serif;">' + getPortalViewHtml(0) + '</div>' +
          '</div>',
    dialogClass: 'ui-dialog-portalslist',
    title: 'Portal list: ' + window.plugin.portalslist.listPortals.length + ' ' + (window.plugin.portalslist.listPortals.length == 1 ? 'portal' : 'portals'),
    id: 'portal-list',
    width: 400,
    modal: true
  });
  var dialogs = $('.ui-modal');
  if (!dialogs.length) {
    alert('no dialog');
    return;
  }
    
  var curIdx = 0;
  var getCurrentGuid = function() { return portals[curIdx].guid; };
  var updateCurrent = function() {
    var updatedHtml = getPortalViewHtml(curIdx);
    $('.testing-class').eq(0).html(updatedHtml);
    window.selectedPortal = getCurrentGuid();
  };
    
  var hackAddKey = function(guid, addCount) {
    console.log('hackAddKey');
    var oldCount = plugin.keys.keys[guid];
    var newCount = Math.max((oldCount || 0) + addCount, 0);
    console.log('guid: ' + guid + ', oldCount: ' + oldCount + ', newCount: ' + newCount);
    if (oldCount !== newCount) {
      if(newCount === 0) {
        delete plugin.keys.keys[guid];
        plugin.keys.updateQueue[guid] = null;
      } else {
        plugin.keys.keys[guid] = newCount;
        plugin.keys.updateQueue[guid] = newCount;
      }
      // Update our UI.
      $('#plugin-keys-ext-count').html('[' + newCount + ']');

      plugin.keys.storeLocal(plugin.keys.KEY);
      plugin.keys.storeLocal(plugin.keys.UPDATE_QUEUE);
      //plugin.keys.updateDisplayCount();
      window.runHooks('pluginKeysUpdateKey', {guid: guid, count: newCount});
      plugin.keys.delaySync();
    }
  };
  
  var move = function(dir) { console.log(dir == -1 ? 'LEFT move' : 'RIGHT move'); curIdx += dir; if (curIdx < 0) curIdx = n - 1; else if (curIdx >= n) curIdx = 0; updateCurrent(); };
  var add = function(dir) { console.log(dir == -1 ? 'REMOVE key' : 'ADD key'); hackAddKey(getCurrentGuid(), dir); };
    
  var keyHandler = function(e) {
    console.log('dialog.e.which: ' + e.which);
    var KEY_LF = 37;
    var KEY_UP = 38;
    var KEY_RT = 39;
    var KEY_DN = 40;
    if (e.which == KEY_LF) { move(-1); e.preventDefault(); }
    else if (e.which == KEY_RT) { move(1); e.preventDefault(); }
    else if (e.which == KEY_UP) { add(1); e.preventDefault(); }
    else if (e.which == KEY_DN) { add(-1); e.preventDefault(); }
  };
  dialogs[0].addEventListener('keyup', keyHandler);
};

var setup =  function() {
  $('#toolbox').append(' <a onclick="window.plugin.keymanagement.show()" title="Key management trial">Key management (2)</a>');
};

// PLUGIN END //////////////////////////////////////////////////////////


if(window.iitcLoaded && typeof setup === 'function') {
  setup();
} else {
  if(window.bootPlugins)
    window.bootPlugins.push(setup);
  else
    window.bootPlugins = [setup];
}
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ wrapper +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
