// base file.
var namespace = namespace || {};

namespace.start = function() {
  namespace.main();
};

window.onload = namespace.start;
