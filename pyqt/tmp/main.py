#!/usr/bin/env python
import sys, logging
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *
from PyQt4 import QtCore
from pak.util import dir_scan
from pak import config
from pak.ctrl.controller import Controller


class TWebView(QWebView):
  def __init__(self, scanner, parent=None):
    QWebView.__init__(self, parent)
    self.setPage(TWebPage())
    self.controller = Controller(self, self, scanner)


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


def run():
  app = QApplication(sys.argv)

  # DirScan init.
  ds = dir_scan.DirScan()
  web = TWebView(ds)

  curDir = QDir.current()
  curPath = curDir.filePath('js/index.html')
  print('curPath %s' % curPath)
  qq = QUrl.fromLocalFile(curPath)
  web.load(qq)

  # setup logger
  c = config.Config()

  web.show()

  sys.exit(app.exec_())

if __name__ == '__main__':
  run()

  #ds = dir_scan.DirScan()
  #ds.scan('', None)
  ##dir_scan.Tag1Suggest.getTags('FooBar - town')
