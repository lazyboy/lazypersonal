import os

class FileInfo:
  def __init__(self):
    return

  def setSize(self, size):
    self.size = size
    return self

  def setDir(self, dir):
    self.dir = dir
    return self

  def setName(self, name):
    self.name = name
    return self

  def getFullName(self):
    return os.path.join(self.dir, self.name)
