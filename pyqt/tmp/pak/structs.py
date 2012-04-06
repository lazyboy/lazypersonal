import os
import json

class FileInfo(json.JSONEncoder):
  def __init__(self):
    return

  def setSize(self, size):
    self.size = size
    return self

  def setDir(self, dir):
    self.dir = os.path.normpath(dir)
    return self

  def setName(self, name):
    self.name = name
    return self

  def getFullName(self):
    return os.path.join(self.dir, self.name)

class FileInfoEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, FileInfo):
      return {'size': obj.size, 'path': obj.getFullName(), 'name': obj.name}
    return json.JSONEncoder.default(self, obj)

