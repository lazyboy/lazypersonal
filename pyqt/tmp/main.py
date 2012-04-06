#!/usr/bin/env python
import sys
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *
from PyQt4 import QtCore
from pak import dir_scan
from pak import config

class TWebView(QWebView):
  def __init__(self, parent = None):
    QWebView.__init__(self, parent)
    self._jsBridge = JsBridge(self, self)
    self.setPage(TWebPage())
    self.connect(self.page().mainFrame(),
        SIGNAL('javaScriptWindowObjectCleared()'), self.getJsBridge)

  def getJsBridge(self):
    self.page().mainFrame().addToJavaScriptWindowObject('_abacus', self._jsBridge)

  def testDownStream(self):
    self.page().mainFrame().evaluateJavaScript(
        '__lazy_py_void_connection("Hello from python2")')
    return

class TWebPage(QWebPage):
  def __init__(self, parent = None):
    QWebPage.__init__(self, parent)
    return

  def javaScriptConsoleMessage(self, message, lineNumber, sourceId):
    #qDebug(message)
    print('[console]: %s, line %d, sourceId %s' % (message, lineNumber, sourceId))
    return

class JsBridge(QtCore.QObject):
  def __init__(self, parent, webview):
    QtCore.QObject.__init__(self, parent)
    self._webview = webview

  # QString receive(QString) {}
  @QtCore.pyqtSlot(str, result=str)
  def receive(self, msg):
    print('[py] %s' % msg)
    self._webview.testDownStream()
    return 'msg-returned-from-upstream'

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

  # DirScan test
  ds = dir_scan.DirScan()
  r = ds.scan('')
  print('printing file stats')
  if r != None:
    for el in r:
      print('%dbytes, %s' % (el.size, el.getFullName()))
  else:
    print('None returned')

  web.show()
  sys.exit(app.exec_())

if __name__ == '__main__':
  run()
