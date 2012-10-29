namespace = namespace || {};
namespace.util = {};

namespace.util.createDiv = function(opt_id, opt_classes, opt_parent) {
  var div = document.createElement('div');
  if (opt_id) div.id = opt_id;
  if (opt_classes) div.className = opt_classes;
  if (opt_parent) opt_parent.appendChild(div);
  return div;
};

namespace.util.detachDiv = function(div) {
  if (div) {
    if (div.parentNode) div.parentNode.removeChild(div);
  } else {
    namespace.log.error('Curios div to detach:', div);
  }
};
