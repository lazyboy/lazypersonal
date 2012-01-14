# -*- coding: utf-8 -*- 

###########################################################################
## Python code generated with wxFormBuilder (version Sep  8 2010)
## http://www.wxformbuilder.org/
##
## PLEASE DO "NOT" EDIT THIS FILE!
###########################################################################

import wx

###########################################################################
## Class GuiFrame
###########################################################################

class GuiFrame ( wx.Frame ):
	
	def __init__( self, parent ):
		wx.Frame.__init__ ( self, parent, id = wx.ID_ANY, title = wx.EmptyString, pos = wx.DefaultPosition, size = wx.Size( 628,407 ), style = wx.DEFAULT_FRAME_STYLE|wx.TAB_TRAVERSAL )
		
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
		
		bSizer8 = wx.BoxSizer( wx.HORIZONTAL )
		
		self.splitterWindow = wx.SplitterWindow( self, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.SP_3D )
		self.splitterWindow.Bind( wx.EVT_IDLE, self.splitterWindowOnIdle )
		
		self.m_panel4 = wx.Panel( self.splitterWindow, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.TAB_TRAVERSAL )
		bSizer12 = wx.BoxSizer( wx.HORIZONTAL )
		
		self.listCtrl = wx.ListCtrl( self.m_panel4, wx.ID_ANY, wx.DefaultPosition, wx.Size( -1,-1 ), wx.LC_REPORT )
		bSizer12.Add( self.listCtrl, 1, wx.ALL|wx.EXPAND, 5 )
		
		self.m_panel4.SetSizer( bSizer12 )
		self.m_panel4.Layout()
		bSizer12.Fit( self.m_panel4 )
		self.m_panel5 = wx.Panel( self.splitterWindow, wx.ID_ANY, wx.DefaultPosition, wx.DefaultSize, wx.TAB_TRAVERSAL )
		bSizer13 = wx.BoxSizer( wx.HORIZONTAL )
		
		self.labelPreview1 = wx.StaticText( self.m_panel5, wx.ID_ANY, u"Foo", wx.DefaultPosition, wx.DefaultSize, 0 )
		self.labelPreview1.Wrap( -1 )
		bSizer13.Add( self.labelPreview1, 0, wx.ALL, 5 )
		
		self.m_panel5.SetSizer( bSizer13 )
		self.m_panel5.Layout()
		bSizer13.Fit( self.m_panel5 )
		self.splitterWindow.SplitVertically( self.m_panel4, self.m_panel5, 0 )
		bSizer8.Add( self.splitterWindow, 1, wx.EXPAND, 5 )
		
		bSizer3.Add( bSizer8, 1, wx.EXPAND, 5 )
		
		bSizer1.Add( bSizer3, 1, wx.EXPAND, 5 )
		
		self.SetSizer( bSizer1 )
		self.Layout()
		
		self.Centre( wx.BOTH )
		
		# Connect Events
		self.textCtrlSearch.Bind( wx.EVT_TEXT_ENTER, self.OnTextSearch )
		self.buttonBrowse.Bind( wx.EVT_BUTTON, self.OnBrowseClick )
		self.buttonGo.Bind( wx.EVT_BUTTON, self.OnGoClick )
	
	def __del__( self ):
		pass
	
	
	# Virtual event handlers, overide them in your derived class
	def OnTextSearch( self, event ):
		event.Skip()
	
	def OnBrowseClick( self, event ):
		event.Skip()
	
	def OnGoClick( self, event ):
		event.Skip()
	
	def splitterWindowOnIdle( self, event ):
		self.splitterWindow.SetSashPosition( 0 )
		self.splitterWindow.Unbind( wx.EVT_IDLE )
	

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
	

