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

  def setMTime(self, value):
    self.mtime = value
    return self

  def getFullName(self):
    return os.path.join(self.dir, self.name)

class FileInfoEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, FileInfo):
      return {
        'size': obj.size,
        'path': obj.getFullName(),
        'name': obj.name,
        'basedir': obj.dir,
        'mtime': obj.mtime
        }
    return json.JSONEncoder.default(self, obj)

class Tag1():
  def __init__(self, id, str):
    self.id = id;
    self.str = str;

class Tag1Encoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, Tag1):
      return {
        'id': obj.id,
        'str': obj.str
        }
    return json.JSONEncoder.default(self, obj)

