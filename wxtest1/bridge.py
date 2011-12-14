class Bridge:
  def __init__(self):
    pass

  def registerController(self, controller):
    self.controller = controller

  def registerGui(self, gui):
    self.gui = gui

  def sendToController(self, event, args):
    self.controller.onCustomEvent(event, args)

  def sendToGui(self, event, args):
    self.gui.onCustomEvent(event, args)
    
