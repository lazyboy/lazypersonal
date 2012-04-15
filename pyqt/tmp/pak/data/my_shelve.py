import logging, os, shelve


class MyShelve():
  _instance = None
  def __init__(self):
    self._logger = logging.getLogger('MyShelve')
    return

  def getNxtId(self, shelveName):
    s = shelve.open('tmp-shelve-' + shelveName)
    try:
      # TODO: Inefficient.
      maxm = 0
      for key in s.keys():
        try:
          keyInt = int(key)
          if keyInt > maxm:
            maxm = keyInt
        except ValueError:
          self._logger.error('Ignore key %s (no int)' % keyInt)
      nxtKey = maxm + 1
      self._logger.info('nxt key for ' + shelveName + ': ' + str(nxtKey))
      return nxtKey
    finally:
      s.close()

  def getAllAsArray(self, shelveName):
    s = shelve.open('tmp-shelve-' + shelveName)
    try:
      ret = []
      for key in s.keys():
        ret.append(s[key])
      return ret
    finally:
      s.close()

  def getObj(self, shelveName, id):
    s = shelve.open('tmp-shelve-' + shelveName)
    try:
      strKey = str(id)
      # TODO: Why has_key doesn't work?
      #if s.has_key(strKey):
      #  return s[strKey]
      #return None
      try:
        return s[strKey]
      except KeyError:
        return None
    finally:
      s.close()

  def setObj(self, shelveName, id, value):
    s = shelve.open('tmp-shelve-' + shelveName)
    try:
      s[str(id)] = value
    finally:
      s.close()

  def deleteAll(self, shelveName):
    s = shelve.open('tmp-shelve-' + shelveName)
    try:
      for key in s.keys():
        del s[key]
    finally:
      s.close()


  @staticmethod
  def getII():
    if MyShelve._instance is None:
      MyShelve._instance = MyShelve()
    return MyShelve._instance

if __name__ == '__main__':
  shelveInstance = MyShelve.getII()
  tstShelveName = 'delmedelme'

  shelveInstance.deleteAll(tstShelveName)
  nxtId = shelveInstance.getNxtId(tstShelveName)
  assert nxtId == 1, 'Initially nxtId should be 1'

  shelveInstance.setObj(tstShelveName, 1, 'foobar')
  shelveInstance.setObj(tstShelveName, 5, 'barbar')
  nxtId = shelveInstance.getNxtId(tstShelveName)
  assert nxtId == 6, 'Now nxtId should be 6'
  y = shelveInstance.getObj(tstShelveName, 1)
  assert y == 'foobar'
  y = shelveInstance.getObj(tstShelveName, 5)
  assert y == 'barbar'
  y = shelveInstance.getObj(tstShelveName, 100)
  assert y is None
  print('Test pass!')

