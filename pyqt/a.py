#!/usr/bin/env python
#ref: http://www.developer.nokia.com/Community/Wiki/CS001495_-_Display_local_web_page_with_Qt_WebKit

import sys
from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *

from PyQt4 import QtCore

app = QApplication(sys.argv)

web = QWebView()
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

web.show()

sys.exit(app.exec_())