from noname import GuiFrame
import wx
import controller

class GuiWrapper (GuiFrame):
  def __init__(self, parent):
    GuiFrame.__init__(self, parent)

    # Set focus on text box.
    self.textCtrlSearch.SetFocus()
  

