from noname import GuiFrame
import sys, wx
import controller

# TODO(lazyboy): Use proportional splitter window:
# http://wiki.wxpython.org/ProportionalSplitterWindow

class GuiWrapper (GuiFrame):
  KEYCODE_J = 106
  KEYCODE_K = 107
  KEYCODE_SLASH_SEARCH = 47

  def __init__(self, parent):
    GuiFrame.__init__(self, parent)
    # So we can track J/K.
    self.listCtrl.Bind(wx.EVT_CHAR, self.onChar_)
    # So we know what is selected.
    # TODO(lazyboy): Too many calls when press and hold up/down, if the info
    # fetching gets costly (which eventually will), do threading.
    self.listCtrl.Bind(wx.EVT_LIST_ITEM_SELECTED, self.onListCtrlItemSelected_)

    # Initially set focus on text box.
    self.textCtrlSearch.SetFocus()

  def setBridge(self, b):
    self.bridge = b

  def onCustomEvent(self, event, args):
    if 'showListItems' == event:
      self.listCtrl.ClearAll()
      self.listCtrl.DeleteAllColumns()

      # TODO(I.A.): Proper column size.
      self.listCtrl.InsertColumn(0, 'idx')
      self.listCtrl.InsertColumn(1, 'name')
      self.listCtrl.InsertColumn(2, 'size')
      print 'Total showListItems: ', len(args)

      idx = 1
      for fileinfo in args:
        pos = self.listCtrl.InsertStringItem(sys.maxint, str(idx))
        self.listCtrl.SetStringItem(pos, 1, fileinfo.name)
        self.listCtrl.SetStringItem(pos, 2, str(fileinfo.size))
        idx = idx + 1
    elif 'showItemDetails' == event:
      fileinfoItem = args
      tmp = 'File:\n%s\nSize: %d bytes' % (fileinfoItem.getFullName(), fileinfoItem.size)
      self.labelPreview1.SetLabel(tmp)
    else:
      print 'Unknown event in Frame:', event
    return

  def onListCtrlItemSelected_(self, event):
    #print 'onListCtrlItemSelected_!'
    idx = event.GetIndex()
    self.bridge.sendToController('onItemSelected', idx)
  
  def onChar_(self, event):
    #print 'onChar_', event.GetKeyCode()
    keyCode = event.GetKeyCode()
    if keyCode == GuiWrapper.KEYCODE_J: # j
      #print 'go Down'
      self.moveSelection(isUp = False)
    elif keyCode == GuiWrapper.KEYCODE_K:
      #print 'go Up'
      self.moveSelection(isUp = True)
    elif keyCode == GuiWrapper.KEYCODE_SLASH_SEARCH:
      self.textCtrlSearch.SetFocus();
    else:
      # Tip: be sure to call event.Skip() for events that you don't process in
      # key event function, otherwise menu shortcuts may cease to work under
      # Windows.
      event.Skip()

  def moveSelection(self, isUp = False):
    idx = self.listCtrl.GetFirstSelected()
    #print 'GetFirstSelected:', idx
    nidx = 0
    n = self.listCtrl.GetItemCount()
    if idx != -1:
      nidx = (idx - 1) if isUp else (idx + 1)
      if nidx == -1:
        nidx = 0
      elif nidx >= n:
        nidx = n - 1
      self.listCtrl.Select(idx, on = False)
    #print 'nextIdx:', nidx
    if nidx != -1:
      self.listCtrl.Select(nidx, on = True)
      self.listCtrl.Focus(nidx)

  ############# Added from wxFormBuilder ################
  def OnTextSearch(self, event):
    value = self.textCtrlSearch.GetValue()
    self.bridge.sendToController('onSearchItem', value)

  def OnBrowseClick( self, event ):
    event.Skip()

  def OnGoClick( self, event ):
    event.Skip()

