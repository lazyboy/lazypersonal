# -*- coding: utf-8 -*- 

###########################################################################
## Python code generated with wxFormBuilder (version Sep  8 2010)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################
## WARNING: EDITED ALREADY :P

import wx
import sys

###########################################################################
## Class GuiFrame
###########################################################################

class GuiFrame ( wx.Frame ):
  KEYCODE_J = 106
  KEYCODE_K = 107
  
  def __init__( self, parent):
    wx.Frame.__init__ ( self, parent, id = wx.ID_ANY, title = wx.EmptyString, pos = wx.DefaultPosition, size = wx.Size( 500,346 ), style = wx.DEFAULT_FRAME_STYLE|wx.TAB_TRAVERSAL )
    
    self.SetSizeHintsSz( wx.DefaultSize, wx.DefaultSize )
    
    bSizer1 = wx.BoxSizer( wx.VERTICAL )
    
    bSizer2 = wx.BoxSizer( wx.HORIZONTAL )
    
    self.textCtrlSearch = wx.TextCtrl( self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.DefaultSize, wx.TE_PROCESS_ENTER )
    bSizer2.Add( self.textCtrlSearch, 1, wx.ALL, 5 )
    
    self.buttonBrowse = wx.Button( self, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0 )
    bSizer2.Add( self.buttonBrowse, 0, wx.ALL, 5 )
    
    self.buttonGo = wx.Button( self, wx.ID_ANY, u"Go", wx.DefaultPosition, wx.DefaultSize, 0 )
    bSizer2.Add( self.buttonGo, 0, wx.ALL, 5 )
    
    bSizer1.Add( bSizer2, 0, wx.EXPAND, 5 )
    
    bSizer3 = wx.BoxSizer( wx.VERTICAL )
    
    self.listCtrl = wx.ListCtrl( self, wx.ID_ANY, wx.DefaultPosition, wx.Size( -1,-1 ), wx.LC_REPORT )
    bSizer3.Add( self.listCtrl, 1, wx.ALL|wx.EXPAND, 5 )
    
    bSizer1.Add( bSizer3, 1, wx.EXPAND, 5 )
    
    self.SetSizer( bSizer1 )
    self.Layout()
    
    self.Centre( wx.BOTH )
    
    # Connect Events
    self.textCtrlSearch.Bind( wx.EVT_TEXT_ENTER, self.OnTextSearch )
    self.buttonBrowse.Bind( wx.EVT_BUTTON, self.OnBrowseClick )
    self.buttonGo.Bind( wx.EVT_BUTTON, self.OnGoClick )

    self.listCtrl.Bind(wx.EVT_CHAR, self.onChar)

  
  def __del__( self ):
    pass

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
    if keyCode == GuiFrame.KEYCODE_J: # j
      #print 'go Down'
      self.moveSelection(isUp = False)
    elif keyCode == GuiFrame.KEYCODE_K:
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
  
  
  # Virtual event handlers, overide them in your derived class
  def OnTextSearch( self, event ):
    print 'OnTextSearch'
    value = self.textCtrlSearch.GetValue()
    self.bridge.sendToController('onSearchItem', value)
    event.Skip()
  
  def OnBrowseClick( self, event ):
    event.Skip()
  
  def OnGoClick( self, event ):
    event.Skip()
  

###########################################################################
## Class MyPanel1
###########################################################################

class MyPanel1 ( wx.Panel ):
  
  def __init__( self, parent ):
    wx.Panel.__init__ ( self, parent, id = wx.ID_ANY, pos = wx.DefaultPosition, size = wx.Size( 583,349 ), style = wx.TAB_TRAVERSAL )
    
    bSizer1 = wx.BoxSizer( wx.VERTICAL )
    
    bSizer2 = wx.BoxSizer( wx.HORIZONTAL )
    
    self.m_textCtrl1 = wx.TextCtrl( self, wx.ID_ANY, wx.EmptyString, wx.DefaultPosition, wx.DefaultSize, 0 )
    bSizer2.Add( self.m_textCtrl1, 1, wx.ALL, 5 )
    
    self.m_button1 = wx.Button( self, wx.ID_ANY, u"Browse", wx.DefaultPosition, wx.DefaultSize, 0 )
    bSizer2.Add( self.m_button1, 0, wx.ALL, 5 )
    
    self.m_button2 = wx.Button( self, wx.ID_ANY, u"Go", wx.DefaultPosition, wx.DefaultSize, 0 )
    bSizer2.Add( self.m_button2, 0, wx.ALL, 5 )
    
    bSizer1.Add( bSizer2, 0, wx.EXPAND, 5 )
    
    bSizer3 = wx.BoxSizer( wx.VERTICAL )
    
    self.m_listCtrl1 = wx.ListCtrl( self, wx.ID_ANY, wx.DefaultPosition, wx.Size( -1,-1 ), wx.LC_ICON|wx.LC_REPORT )
    bSizer3.Add( self.m_listCtrl1, 1, wx.ALL|wx.EXPAND, 5 )
    
    bSizer1.Add( bSizer3, 1, wx.EXPAND, 5 )
    
    self.SetSizer( bSizer1 )
    self.Layout()
  
  def __del__( self ):
    pass
  

