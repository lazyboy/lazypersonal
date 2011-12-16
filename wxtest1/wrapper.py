from noname import GuiFrame
import sys, wx
import controller

class GuiWrapper (GuiFrame):
  KEYCODE_J = 106
  KEYCODE_K = 107

  def __init__(self, parent):
    GuiFrame.__init__(self, parent)
    # So we can track J/K
    self.listCtrl.Bind(wx.EVT_CHAR, self.onChar)

    # Set focus on text box.
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
    else:
      print 'Unknown event in Frame:', event
    return

  def onChar(self, event):
    #print 'onChar', event.GetKeyCode()
    keyCode = event.GetKeyCode()
    if keyCode == GuiWrapper.KEYCODE_J: # j
      #print 'go Down'
      self.moveSelection(isUp = False)
    elif keyCode == GuiWrapper.KEYCODE_K:
      #print 'go Up'
      self.moveSelection(isUp = True)
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

