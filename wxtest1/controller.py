class Controller:
  def __init__(self):
    #self.fileSearcher = FileSearcher()
    pass

  def onSearchItem(self, event, query):
    '''
    items = self.fileSearcher.getMatchedItems(query)
    idx = 0
    for item in items:
      print idx, ':', item
      idx = idx + 1
    '''
    print 'query is', query

