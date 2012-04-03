lazy.templates = {};

lazy.templates.getFilelistHtml = function(filelist) {
  var ret = '';
  for (var i = 0; i < filelist.length; ++i) {
    ret += '<div class="filelistrow">' + filelist[i] + '</div>';
  }
  return ret;
};

lazy.templates.wrapDiv = function(content, opt_class) {
  var ret = '';
  if (!!opt_class) {
    ret = '<div class="' + opt_class + '">' + content + '</div>';
  } else {
    ret = '<div>' + content + '</div>';
  }
  return ret;
};
