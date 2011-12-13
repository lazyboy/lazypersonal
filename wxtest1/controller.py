import os
import config
import structs

global DEBUG

class Controller:
  def __init__(self):
    #self.fileSearcher = FileSearcher()

    # Load config
    pass

  def onSearchItem(self, event, query):
    print 'query is', query
    if config.Config.DEBUG:
      if '' == query:
        query = '/home/lazyboy/media'

    if not os.path.exists(query):
      print 'Path %s does not exist' % query
      return

    idx = 1
    for root, dirs, files in os.walk(query):
      for name in files:
        fullPath = os.path.join(root, name)
        try:
          size = os.path.getsize(fullPath)
        except os.error as e:
          print 'Error:', e
          size = -1
        print '%04d: %d bytes %s' % (idx, size, fullPath)
        idx = idx + 1
    return

