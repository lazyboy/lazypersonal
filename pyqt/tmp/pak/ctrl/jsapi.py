#!/usr/bin/env python
# Author: lazyboy
import logging
from PyQt4 import QtCore


class JsBridge(QtCore.QObject):
  def __init__(self, parent, webview, controller):
    QtCore.QObject.__init__(self, parent)
    self._webview = webview
    self._controller = controller
    self._sender = DownstreamConnection(self._webview)
    self._logger = logging.getLogger('JsBridge')
    # Connect controller's signal to a slot here.
    self._controller.toJsSignal.connect(self.toJs)

  # fromJs(int, {}) : str
  @QtCore.pyqtSlot(int, QtCore.QVariant, result=str)
  def fromJs(self, t, obj):
    self._controller.fromJs(t, obj)

  # toJs(int, str) : str
  @QtCore.pyqtSlot(int, str, result=str)
  def toJs(self, t, jsonStr):
    return self._sender.send(t, jsonStr)

class DownstreamConnection:
  def __init__(self, webview):
    self._webview = webview
    self._logger = logging.getLogger('DownstreamConnection')

  def send(self, t, jsonStr):
    # TODO: Cleanup if necessary.
    quoted = jsonStr.replace('\\', '\\\\').replace('\'', '\\\'')
    return self._webview.page().mainFrame().evaluateJavaScript(
        '__lazy_py_downwards(%d, \'%s\')' % (t, quoted))

