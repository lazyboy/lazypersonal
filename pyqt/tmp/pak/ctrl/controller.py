#!/usr/bin/env python
# Author: lazyboy
import json, logging

from PyQt4 import QtCore

from pak import structs
from pak.ctrl import jsapi


class Controller(QtCore.QObject):
  toJsSignal = QtCore.pyqtSignal(int, str)

  def __init__(self, parent, webview, scanner):
    QtCore.QObject.__init__(self, parent)
    self._scanner = scanner
    self._webview = webview
    self._jsBridge = jsapi.JsBridge(self, webview, self)

    self._logger = logging.getLogger('Controller')

    self._webview.connect(self._webview.page().mainFrame(),
        QtCore.SIGNAL('javaScriptWindowObjectCleared()'),
        self.getJsBridge)

  def getJsBridge(self):
    self._webview.page().mainFrame().addToJavaScriptWindowObject(
        '__lazy_py_upwards', self._jsBridge)

  def fromJs(self, t, obj):
    if t == 1:
      self._logger.debug('obj is %s' % str(obj))
      for key in obj.keys():
        val = obj[key]
        self._logger.debug('key %s, value %s' % (key, val))

      def cb(filelist):
        self._logger.debug('cb send down')
        self.toJs(1, filelist)

      if self._scanner != None:
        self._logger.debug('send to scanner')
        self._scanner.scan(obj['value'], cb)
    else:
      self._logger.error('Unknown request type %d' % t)
    return

  def decorateJsonStrForToJs(self, t, objOrArray):
    if t == 1:
      jsonStr = '[';
      objAr = objOrArray
      for obj in objAr:
        # TODO: Clean up this.
        jsonStr += json.dumps(obj, cls=structs.FileInfoEncoder) + ','
      jsonStr += ']';
      #self._logger.debug('json: ' + jsonStr)
      return jsonStr
    else:
      self._logger.error('Unknown request type %d' % t)
    # impossibru
    return ''

  def toJs(self, t, objOrArray):
    jsonStr = self.decorateJsonStrForToJs(t, objOrArray)
    self._logger.debug('Emitting toJs from Controller')
    self.toJsSignal.emit(t, jsonStr)

