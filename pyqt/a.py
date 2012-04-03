#!/usr/bin/env python
#ref: http://www.developer.nokia.com/Community/Wiki/CS001495_-_Display_local_web_page_with_Qt_WebKit

import sys
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *

from PyQt4 import QtCore

class TWebView(QWebView):
  def __init__(self, parent = None):
    QWebView.__init__(self, parent)
    self._jsBridge = JsBridge(self, self)
    self.connect(self.page().mainFrame(),
        SIGNAL('javaScriptWindowObjectCleared()'), self.getJsBridge)

  def getJsBridge(self):
    self.page().mainFrame().addToJavaScriptWindowObject('_abacus', self._jsBridge)

  def testDownStream(self):
    self.page().mainFrame().evaluateJavaScript(
        '__lazy_py_void_connection("Hello from python2")')
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


app = QApplication(sys.argv)
web = TWebView()
#web.load(QUrl("http://google.pl"))

# 1. Opens from py path
baseq = QApplication.applicationDirPath();
qq = QUrl.fromLocalFile(QDir.toNativeSeparators(baseq + '/lazy.html'))
print('hello %d' % qq.isLocalFile())

# 2. Opens Current dir/path             	
curDir = QDir.current()
curPath = curDir.filePath('lazy.html')
print('curPath %s' % curPath)
qq = QUrl.fromLocalFile(curPath)

web.load(qq)

# 3. Opening raw string as html.
#html = '<body>raw write</body>'
#web.setHtml(html, QtCore.QUrl('qrc:/')) #works

#web.show()

## 1. Downstream test.
# See TWebView.testDownStream.

## 2. Upstream test.
# See JsBridge.receive

web.show()

sys.exit(app.exec_())
