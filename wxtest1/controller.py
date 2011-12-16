import os
import config, structs

global DEBUG

class Controller:
  def __init__(self):
    #self.fileSearcher = FileSearcher()

    # Load config
    pass

  def setBridge(self, b):
    self.bridge = b

  def onCustomEvent(self, event, args):
    if 'onSearchItem' == event:
      self.onSearchItem_(None, args)
    elif 'onItemSelected' == event:
      self.onItemSelected_(args)
    else:
      print 'Unknown event in Controller:', event
    return

  def onItemSelected_(self, idx):
    fileinfoItem = self.retList[idx]
    self.bridge.sendToGui('showItemDetails', fileinfoItem)

  def onSearchItem_(self, event, query):
    print 'query is', query
    if config.Config.DEBUG:
      if '' == query:
        query = '/home/lazyboy/Downloads'

    if not os.path.exists(query):
      print 'Path %s does not exist' % query
      return

    # TODO(I.A): Don't do this altogether, batch and thread.
    self.retList = []
    idx = 1
    for root, dirs, files in os.walk(query):
      for name in files:
        fullPath = os.path.join(root, name)
        try:
          size = os.path.getsize(fullPath)
        except os.error as e:
          print 'Error:', e
          size = -1
        #print '%04d: %d bytes %s' % (idx, size, fullPath)
        f = structs.FileInfo().setSize(size).setDir(root).setName(name)
        if Controller.filter(f):
          #print '%04d: %d bytes %s' % (idx, size, fullPath)
          self.retList.append(f)
        idx = idx + 1

    # Send to gui
    self.bridge.sendToGui('showListItems', self.retList)
    return

  @staticmethod
  def filter(fileinfo):
    # TODO(I.A): Proper filtering.
    return fileinfo.size > 10 * 1000

