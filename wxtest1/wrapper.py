from noname import GuiFrame
import wx
import controller

class GuiWrapper (GuiFrame, controller.Controller):
  def __init__(self, parent, controller):
    GuiFrame.__init__(self, parent, controller)

    # Set focus on text box.
    self.textCtrlSearch.SetFocus()
  

