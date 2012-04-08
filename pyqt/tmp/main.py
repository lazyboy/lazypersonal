#!/usr/bin/env python
import sys, logging, json
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *
from PyQt4 import QtCore
from pak.util import dir_scan
from pak import config
from pak import structs

class TWebView(QWebView):
  def __init__(self, parent = None):
    QWebView.__init__(self, parent)
    self.jsBridge = JsBridge(self, self)
    self.setPage(TWebPage())
    self.connect(self.page().mainFrame(),
        SIGNAL('javaScriptWindowObjectCleared()'), self.getJsBridge)

  def getJsBridge(self):
    self.page().mainFrame().addToJavaScriptWindowObject('__lazy_py_upwards', self.jsBridge)


class DownstreamConnection:
  def __init__(self, webview):
    self._webview = webview
    self._logger = logging.getLogger('DownstreamConnection')

  def send(self, t, jsonStr):
    quoted = jsonStr.replace('\\', '\\\\').replace('\'', '\\\'')
    self._webview.page().mainFrame().evaluateJavaScript(
        '__lazy_py_downwards(%d, \'%s\')' % (t, quoted))


class TWebPage(QWebPage):
  def __init__(self, parent = None):
    QWebPage.__init__(self, parent)
    self._logger = logging.getLogger('TWebPage')
    return

  # Override
  def javaScriptConsoleMessage(self, message, lineNumber, sourceId):
    #qDebug(message)
    self._logger.debug('[console]: %s, line %d, sourceId %s' % (message, lineNumber, sourceId))
    return

class JsBridge(QtCore.QObject):
  def __init__(self, parent, webview):
    QtCore.QObject.__init__(self, parent)
    self._webview = webview
    self._logger = logging.getLogger('JsBridge')
    self._sender = DownstreamConnection(self._webview)

  # QString fromDownstream(int, {})
  @QtCore.pyqtSlot(int, QVariant, result=str)
  def fromDownstream(self, t, obj):
    if 1 == t:
      self._logger.debug('t value is ONE!')
    else:
      self._logger.debug('t value something else: %s' % t)
    self._logger.debug('obj is %s' % str(obj))

    for key in obj.keys():
      val = obj[key]
      self._logger.debug('key %s, value %s' % (key, val))

    def cb2(filelist):
      self._logger.debug('cb2 send down')
      self.toDownstream(1, filelist)

    if self._scanner != None:
      self._logger.debug('send to scanner')
      self._scanner.scan(obj['value'], cb2)

  def registerScanner(self, scanner):
    self._scanner = scanner

  def toDownstream(self, t, objAr):
    jsonStr = '[';
    for obj in objAr:
      # TODO: Clean up this.
      jsonStr += json.dumps(obj, cls=structs.FileInfoEncoder) + ','
      #jsonStr += structs.FileInfoEncoder().encode(obj).replace('\'', '\\\'').replace('\\', '\\\\') + ','
    jsonStr += ']';
    self._logger.debug('json: ' + jsonStr)
    self._sender.send(t, jsonStr)

def run():
  app = QApplication(sys.argv)
  web = TWebView()
  curDir = QDir.current()
  curPath = curDir.filePath('js/index.html')
  print('curPath %s' % curPath)
  qq = QUrl.fromLocalFile(curPath)
  web.load(qq)

  # setup logger
  c = config.Config()

  def cb(filelist):
    #print('hi')
    web.jsBridge.toDownstream(1, filelist)

  web.show()

  # DirScan init.
  ds = dir_scan.DirScan()
  # ugly as hell.
  web.jsBridge.registerScanner(ds)

  sys.exit(app.exec_())

if __name__ == '__main__':
  run()
