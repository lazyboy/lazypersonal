namespace = namespace || {};
namespace._my_browser_ = null;

namespace.main = function() {
  var browser = new namespace.Browser();
  namespace._my_browser_ = browser;  // =P
  // FIXME
  var d = document.getElementById('root');
  if (!d) ERR('root container not found');
  browser.init(d);
};

