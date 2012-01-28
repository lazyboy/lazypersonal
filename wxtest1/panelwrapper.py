import logging, wx
import config


class PanelWrapper():
  def __init__(self, panel):
    self._logger = logging.getLogger('PanelWrapper')
    self._panel = panel

    self._currentMode = 0
    self._numSections = 2
    return
    
  def show(self, value, item=None):
    if value:
      self._logger.info('Showing panel')
      self._show()
    else:
      self._logger.info('Hiding panel')
      self._hide()
    return

  def _hide(self):
    return

  def _show(self):
    if self._currentMode != 1:
      # Recreate stuffs for edit.
      self._panel.DestroyChildren()
      self._createEditMode()
    return

  def _createEditMode(self):
    self._currentMode = 1

    #xtraSizer = wx.BoxSizer(wx.HORIZONTAL)
    #self._win = wx.ScrolledWindow(self._panel, wx.ID_ANY)
    #self._win.SetScrollbars(1, 1, 1, 1)
    #xtraSizer.Add(self._win, 0, wx.ALL|wx.EXPAND, 0)


    self._sizerTop = wx.BoxSizer(wx.VERTICAL)

    self._innerSizers = []
    self._editSections = []
    for i in range(0, self._numSections):
      self._innerSizers.append(self._createEditSection(i))
      self._sizerTop.Add(self._innerSizers[i], 0, wx.EXPAND, 5)

    self._panel.SetSizer(self._sizerTop)

    #self._panel.SetSizer(xtraSizer)
    #self._win.SetSizer(self._sizerTop)
    #self._win.Layout()

    self._panel.Layout()
    return

  def _createEditSection(self, idx):
    retSizer = wx.BoxSizer(wx.VERTICAL)
    section = Section(self._panel,
    #section = Section(self._win,
        retSizer,
        'Droid' if idx == 0 else 'Tag',
        focusExitCb = self._getNextSectionCallback(idx))
    self._editSections.append(section)
    return retSizer

  def _getNextSectionCallback(self, idx):
    def retFunc():
      if idx >= len(self._editSections) - 1:
        self._logger.debug('No more sections, skip')
        return False
      self._logger.debug('Calling next section focus, cur idx: %d', idx)
      return self._editSections[idx+1].onFocusEnter()
    return retFunc

class Section:

  def __init__(self, parent, sizer, title=None, focusExitCb=None):
    self._logger = logging.getLogger('Section')
    self._parent = parent
    self._sizer = sizer
    self._title = title

    self._focusExitCallback = focusExitCb

    self._labels = []
    self._txtCtrls = []

    label = wx.StaticText(self._parent, wx.ID_ANY)
    self._labels.append(label)
    self._sizer.Add(label, 0, wx.ALL, 5)
    label.SetLabel(title if title != None else u"Unknown")

    txtCtrl = wx.TextCtrl(self._parent, wx.ID_ANY)
    self._txtCtrls.append(txtCtrl)
    self._sizer.Add(txtCtrl, 0, wx.EXPAND | wx.ALL, 5)
    
    # Events
    txtCtrl.Bind(wx.EVT_CHAR, self._getOnCharFunc(0))
    return

  def onFocusEnter(self):
    self._logger.debug('onFocusEnter: %s', self._title)
    if len(self._txtCtrls) < 1:
      self._logger.warning('Error, cannot focus, we have no txtbox')
      return False

    self._logger.debug('Focusing first txtCtrl, we have %d', len(self._txtCtrls))
    self._txtCtrls[0].SetFocus()
    return True

  def _onFocusExit(self):
    self._logger.debug('_onFocusExit')
    if hasattr(self, '_focusExitCallback'):
      self._logger.debug('Calling callback for _onFocusExit')
      return self._focusExitCallback()
    else:
      self._logger.info('No callback for _onFocusExit')
      return False

  def _addTxtCtrl(self):
    txtCtrl = wx.TextCtrl(self._parent, wx.ID_ANY)
    ii = len(self._txtCtrls)
    self._txtCtrls.append(txtCtrl)
    self._sizer.Add(txtCtrl, 0, wx.EXPAND | wx.ALL, 5)

    txtCtrl.Bind(wx.EVT_CHAR, self._getOnCharFunc(ii))

    # Call *all* the layouts, otherwise things look funky.
    p = self._parent
    while (p != None):
      p.Layout()
      p = p.GetParent()

    txtCtrl.SetFocus()
    return

  def _getOnCharFunc(self, idx):
    def ret(event):
      self.onChar_(event, idx)
    return ret

  def onChar_(self, event, idx):
    keyCode = event.GetKeyCode()
    if keyCode != wx.WXK_TAB:
      event.Skip()
      return

    self._logger.debug('onChar_: %s, %d', keyCode, idx)
    if keyCode == wx.WXK_TAB:
      self._logger.debug('tab pressed')
      content = self._txtCtrls[idx].GetValue()
      if '' == content:
        self._logger.debug('Empty content on tab')
        if self._onFocusExit():
          self._logger.debug('Focus was received by a section, skip event')
          return
      else:
        self._logger.debug('Non empty content')
        if idx == len(self._txtCtrls) - 1:
          self._logger.debug('Last element, adding stuff')
          self._addTxtCtrl()
        else:
          self._logger.debug('Next existing element gets focus')
          self._txtCtrls[idx+1].SetFocus()
        return
    self._logger.debug('Tabbing away')
    event.Skip()

  def getTxtCtrl(self, i):
    return self.txtCtrl[i]
    
if __name__ == '__main__':
  # Test
  app = wx.App()
  top = wx.Frame(None, title='Testing', size=(300, 300))
  sizer = wx.BoxSizer(wx.VERTICAL)
  panel = wx.Panel(top)
  sizer.Add(panel, 0, wx.EXPAND | wx.ALL, 5)
  top.SetAutoLayout(True)
  top.SetSizer(sizer)

  panelWrapper = PanelWrapper(panel)
  panelWrapper.show(True)

  top.Show()
  app.MainLoop()
  

