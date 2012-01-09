'''
Author: Istiaque Ahmed

Code modified from:
wxPython Custom Widget Collection 20060207
Written By: Edward Flick (eddy -=at=- cdf-imaging -=dot=- com)
            Michele Petrazzo (michele -=dot=- petrazzo -=at=- unipex -=dot=- it)
            Will Sadkin (wsadkin-=at=- nameconnector -=dot=- com)
Copyright 2006 (c) CDF Inc. ( http://www.cdf-imaging.com )
Contributed to the wxPython project under the wxPython project's license.

'''
import wx
import sys

# TODO(I.A.): Consider using FakePopupWindow for osx from:
# http://trac.flipturn.org/browser/trunk/peppy/lib/textctrl_autocomplete.py
class AutocompleteTC(wx.TextCtrl):
  def __init__(self, parent, queryCallback=None, selectCallback=None, **therest):
    '''
    Constructor works just like wx.TextCtrl except you can pass in a
    list of choices.  You can also change the choice list at any time
    by calling setChoices.
    '''

    if therest.has_key('style'):
      therest['style'] = wx.TE_PROCESS_ENTER | therest['style']
    else:
      therest['style'] = wx.TE_PROCESS_ENTER
    wx.TextCtrl.__init__(self, parent, **therest)

    # Members
    self._queryCallback = queryCallback
    self._selectCallback = selectCallback

    # Helper popup window.
    self._popupWindow = wx.PopupWindow(parent, wx.RAISED_BORDER)
    self._listCtrlSizer = wx.BoxSizer(wx.VERTICAL)
    self._listCtrl = wx.ListCtrl(self._popupWindow, wx.ID_ANY,
        wx.DefaultPosition, wx.Size(-1,-1),
        wx.LC_REPORT | wx.LC_NO_HEADER | wx.SUNKEN_BORDER)
    self._listCtrlSizer.Add(self._listCtrl, 1, wx.ALL|wx.EXPAND, 0)
    self._popupWindow.SetSizer(self._listCtrlSizer)
    #self._popupWindow.Layout()
    self._popupWindow.Centre(wx.BOTH)
    #bSizer12.Fit( self.m_panel4 )

    # Event registrations
    gp = self
    while (gp != None) :
      gp.Bind(wx.EVT_MOVE, self._onControlChanged, gp)
      gp.Bind(wx.EVT_SIZE, self._onControlChanged, gp)
      gp = gp.GetParent()

    self.Bind(wx.EVT_KILL_FOCUS, self._onControlChanged, self)
    self.Bind(wx.EVT_TEXT, self._onEnteredText, self)
    self.Bind(wx.EVT_KEY_DOWN, self._onKeyDown, self)

    # Init.
    self._initialize()
    return

  # Event callbacks
  def _onControlChanged(self, e):
    self._showSuggestions(False)
    e.Skip()

  def _onEnteredText(self, e):
    text = e.GetString()
    if self._queryCallback != None:
      self._queryCallback(text, self._onResult)
    print 'onEnteredText:', text
    e.Skip()

  def _onResult(self, rows):
    self._listCtrl.ClearAll()
    self._listCtrl.DeleteAllColumns()
    self._listCtrl.InsertColumn(0, 'hello')
    for value in rows:
      print 'Show item: ', value
      self._listCtrl.InsertStringItem(sys.maxint, value)

    mlength = len(rows)
    self._showSuggestions(mlength > 0)
    print '_listCtrl size:', self._listCtrl.GetSize()
    print 'Sizer size:', self._listCtrlSizer.GetSize()
    print 'window size:', self._popupWindow.GetSize()
    # TODO(I.A.): Max height restrict.
    # TODO(I.A.): Still short.
    self._popupWindow.SetSize(self._listCtrl.GetSize())
    '''
    Failed attempt
    charHeight = self._listCtrl.GetCharHeight()
    MAX_ITEM = 5
    itemCount = max(mlength, MAX_ITEM)
    tmpSize = wx.Size(-1, charHeight * itemCount)
    #self._listCtrl.SetSize (tmpSize)
    ##tmpSize = wx.Size(-1, charHeight * (itemCount + 1)) # Stupid size problem I don't understand
    #self._popupWindow.SetClientSize(tmpSize)
    self._popupWindow.SetSize(tmpSize)
    '''

    # Always select the first
    if mlength > 0:
      self._listCtrl.Select(0, on = True)
      # no need to unselect?
      self._listCtrl.Focus(0)
    return

  def _moveSelection(self, isUp = False):
    idx = self._listCtrl.GetFirstSelected()
    #print 'GetFirstSelected:', idx
    nidx = 0
    n = self._listCtrl.GetItemCount()
    if idx != -1:
      nidx = (idx - 1) if isUp else (idx + 1)
      if nidx == -1:
        nidx = 0
      elif nidx >= n:
        nidx = n - 1
      self._listCtrl.Select(idx, on = False)
    #print 'nextIdx:', nidx
    if nidx != -1:
      self._listCtrl.Select(nidx, on = True)
      self._listCtrl.Focus(nidx)

  def _onKeyDown(self, e) :
    skip = True

    # TODO(lazyboy): Figure out skip event
    KC = e.GetKeyCode()
    if KC == wx.WXK_DOWN:
      self._moveSelection(isUp = False)
      print 'Down key, select next on list'
    elif KC == wx.WXK_UP:
      print 'Up key, select previous on list'
      self._moveSelection(isUp = True)
    elif KC == wx.WXK_LEFT:
      print 'Left key, cursor moves'
      skip = False
    elif KC == wx.WXK_RIGHT:
      print 'Right key, cursor moves'
      skip = False
    if KC == wx.WXK_RETURN:
      print 'Return pressed, what to do, what to do'
      idx = self._listCtrl.GetFirstSelected()
      item = self._listCtrl.GetItem(idx)
      if item != None:
        value = item.GetText()
      else:
        value = 'nothing'
      if self._selectCallback != None:
        self._selectCallback(idx, value)
      skip = False
    if KC == wx.WXK_ESCAPE:
      print 'Escape key'
      skip = False
    if skip:
        e.Skip()

  # Helpers
  def _initialize(self):
    self._suggestionsShown = False

  def _showSuggestions(self, show):
    # Show/hide suggestions
    print '_showSuggestions', show
    if self._suggestionsShown == show:
      return
    self._suggestionsShown = show

    if show:
      pos = self.GetScreenPosition()
      size = self.GetSize()
      width = size.width
      if width < 100:
        print 'self width < 100, doing 100 anyway'
        width = 100
      self._popupWindow.SetPosition((pos.x, pos.y + 25))
      self._popupWindow.SetSize((width, -1))
      self._popupWindow.SetBackgroundColour((255, 0, 0))
      self._popupWindow.Show()
    else:
      self._popupWindow.Hide()

    return


class test:
    def __init__(self):
        args = dict()

        app = wx.PySimpleApp()
        frm = wx.Frame(None,-1,"Test",style=wx.TAB_TRAVERSAL|wx.DEFAULT_FRAME_STYLE)
        panel = wx.Panel(frm)
        sizer = wx.BoxSizer(wx.VERTICAL)

        # lazy test mod
        self.__foobar = AutocompleteTC(panel, queryCallback = self.queryCallback_,
            selectCallback = self.selectCallback_)
        sizer.Add(self.__foobar)
        self.__foobar2 = AutocompleteTC(panel, queryCallback = self.queryCallback_)
        sizer.Add(self.__foobar2)
        self.__foo = 'bar'
        # end lazy test mod

        panel.SetAutoLayout(True)
        panel.SetSizer(sizer)
        sizer.Fit(panel)
        sizer.SetSizeHints(panel)
        panel.Layout()
        app.SetTopWindow(frm)
        frm.Show()
        app.MainLoop()

    def queryCallback_(self, text, returnCallback):
      print 'Outer got query:', text
      print 'self is', self.__foo
      ret = []
      for i in range(5):
        ret.append(text + str(i))
      returnCallback(ret)

    def selectCallback_(self, idx, value):
      print 'Out got select:', str(idx), ':', value

if __name__ == "__main__":
    test()

