#!/usr/bin/env python
import sys, logging
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *
from PyQt4 import QtCore
from pak import dir_scan
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
    self.page().mainFrame().addToJavaScriptWindowObject('_abacus', self.jsBridge)

  def testDownStream(self):
    self.page().mainFrame().evaluateJavaScript(
        '__lazy_py_void_connection("Hello from python2")')
    return

class DownstreamConnection:
  def __init__(self, webview):
    self._webview = webview
    self._logger = logging.getLogger('DownstreamConnection')

  def send(self, t, jsonStr):
    mystr = '__lazy_py_listener(%d, "%s")' % (t, jsonStr)
    self._logger.debug('\n\nsend: %s' % mystr)
    #self._webview.page().mainFrame().evaluateJavaScript(
    #    '__lazy_py_listener(%d, "%s")' % (t, jsonStr))
    self._webview.page().mainFrame().evaluateJavaScript(
        #'__lazy_py_listener(1, "2222")')
        #'__lazy_py_void_connection("3333")')
        '__lazy_py_listener(1, \'%s\')' % jsonStr)

class TWebPage(QWebPage):
  def __init__(self, parent = None):
    QWebPage.__init__(self, parent)
    self._logger = logging.getLogger('TWebPage')
    return

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

  # QString receive(QString) {}
  @QtCore.pyqtSlot(str, result=str)
  def receive(self, msg):
    self._logger.debug('[py] %s' % msg)
    self._webview.testDownStream()
    return 'msg-returned-from-upstream'

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
      jsonStr += structs.FileInfoEncoder().encode(obj) + ','
    jsonStr += ']';
    self._logger.debug('json: ' + jsonStr)
    self._sender.send(t, jsonStr)
    print('todo down')

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

  # DirScan test
  ds = dir_scan.DirScan()
  # ugly as hell.
  web.jsBridge.registerScanner(ds)

  r = ds.scan('', cb)
  print('printing file stats')
  if r != None:
    for el in r:
      print('%dbytes, %s' % (el.size, el.getFullName()))
  else:
    print('None returned')

  sys.exit(app.exec_())

if __name__ == '__main__':
  run()
