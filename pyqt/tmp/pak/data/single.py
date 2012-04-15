import os, json, logging

# Make sure
# 1. All setters have return self.
# 2. Every class has json Encoder class
# 3. Every class has shelve name

class D():
  keys = ['id', 'name', 't']
  def __init__(self):
    self._logger = logging.getLogger('D')

  def setName(self, name):
    self.name = name
    return self

  def setId(self, value):
    self.id = value
    return self
  
  def setT(self, value):
    self.t = value
    return self

  def getValue(self, key):
    try:
      value = getattr(self, key)
      return value
    except AttributeError:
      # We'll handle this below
      pass

    if key not in D.keys:
      self._logger.error('Unknown key %s in D()' % key)
      return None

    if key == 'id':
      self.id = MyShelve.getII().getNxtId(D.getShelveName())
      return self.id
    return None

  @staticmethod
  def getShelveName():
    return 'ddd'
    
class T():
  keys = ['id', 'name', 'rate']
  def __init__(self):
    self._logger = logging.getLogger('D')

  def setName(self, value):
    self.name = value 
    return self

  def setId(self, value):
    self.id = value
    return self
  
  def setRate(self, value):
    self.rate = value
    return self

  def getValue(self, key):
    try:
      value = getattr(self, key)
      return value
    except AttributeError:
      # We'll handle this below
      pass

    if key not in T.keys:
      self._logger.error('Unknown key %s in T()' % key)
      return None

    if key == 'id':
      self.id = MyShelve.getII().getNxtId(T.getShelveName())
      return self.id
    return None

  @staticmethod
  def getShelveName():
    return 'ttt'
    

class F():
  def __init__(self):
    self._logger = logging.getLogger('F')
    return

  def setId(self, value):
    self.id = value
    return self

  def setName(self, name):
    self.name = name
    return self

  def setDir(self, dir):
    self.dir = os.path.normpath(dir)
    return self

  def setSize(self, size):
    self.size = size
    return self

  def setMtime(self, value):
    self.mtime = value
    return self

  def getFullName(self):
    if hasattr(self, 'dir') and hasattr(self, 'name'):
      return os.path.join(self.dir, self.name)
    return None

  def getValue(self, key):
    if key == 'id':
      if hasattr(self, 'id'):
        return self.id
      else:
        # We must create a new id.
        self.id = MyShelve.getII().getNxtId(F.getShelveName())
        return self.id
    elif key == 'name':
      return self.name if hasattr(self, 'name') else None
    elif key == 'dir':
      return self.dir if hasattr(self, 'dir') else None
    elif key == 'fullname':
      return self.getFullName()
    elif key == 'size':
      return self.size if hasattr(self, 'size') else None
    elif key == 'mtime':
      return self.mtime if hasattr(self, 'mtime') else None
    else:
      self._logger.error('Invalid get key: ' + str(key))
    return None

  @staticmethod
  def getShelveName(self):
    return 'fff'

class FEnc(json.JSONEncoder):
  # Override
  def default(self, obj):
    keys = ['id', 'name', 'dir', 'fullname', 'size', 'mtime']
    if isinstance(obj, F):
      '''
      return {
        'size': obj.size,
        'path': obj.getFullName(),
        }
      '''
      ret = {}
      for i in range(len(keys)):
        value = obj.getValue(keys[i])
        if value is not None:
          ret[keys[i]] = value
        else:
          pass
      return ret
    self._logger('booo json fro F')
    return json.JSONEncoder.default(self, obj)


class DEnc(json.JSONEncoder):
  # Override
  def default(self, obj):
    if isinstance(obj, D):
      ret = {}
      for i in range(len(D.keys)):
        value = obj.getValue(D.keys[i])
        if value is not None:
          ret[D.keys[i]] = value
        else:
          pass
      return ret
    self._logger('booo json fro D')
    return json.JSONEncoder.default(self, obj)

class TEnc(json.JSONEncoder):
  # Override
  def default(self, obj):
    if isinstance(obj, T):
      ret = {}
      for i in range(len(T.keys)):
        value = obj.getValue(T.keys[i])
        if value is not None:
          ret[T.keys[i]] = value
        else:
          pass
      return ret
    self._logger('booo json fro T')
    return json.JSONEncoder.default(self, obj)

if __name__ == '__main__':
  f = F()
  f.setName('testing')
  f.setMtime('1234')
  f.setId(123) # To avoid MyShelve for now
  v = json.dumps(f, cls=FEnc)
  print('F dump value: %s' % v)

  d = D()
  d.setId(1234)
  v = json.dumps(d, cls=DEnc)
  print('D dump value: %s' % v)
  d.setName('Han')
  v = json.dumps(d, cls=DEnc)
  print('D dump value: %s' % v)

  t = T()
  t.setId(1234)
  t.setRate(20)
  v = json.dumps(t, cls=TEnc)
  print('T dump value: %s' % v)
  t.setName('Toshi')
  v = json.dumps(t, cls=TEnc)
  print('T dump value: %s' % v)

