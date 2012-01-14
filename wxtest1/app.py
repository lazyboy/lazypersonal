import wx
import sys
import bridge, config, controller, wrapper

c = None
b = None
def initFactory():
  global c
  global b
  c = controller.Controller()
  b = bridge.Bridge()
  b.registerController(c)

def main():
  # Make them robust
  if len(sys.argv) > 1 and sys.argv[1] == '--DEBUG':
    config.Config.DEBUG = True

  initFactory()

  app = wx.App()
  frame = wrapper.GuiWrapper(None)
  b.registerGui(frame)

  # Fudge this! Very naive dude, very naive!
  frame.setBridge(b)
  c.setBridge(b)

  frame.listCtrl.InsertColumn(0, 'hi0')
  frame.listCtrl.InsertColumn(1, 'hi1')
  frame.listCtrl.InsertColumn(2, 'hi2')

  pos = frame.listCtrl.InsertStringItem(0, 'hello')
  frame.listCtrl.SetStringItem(pos, 1, 'world')
  frame.listCtrl.SetStringItem(pos, 2, '!')

  frame.Show()
  app.MainLoop()
  return

if __name__ == '__main__':
  main()

