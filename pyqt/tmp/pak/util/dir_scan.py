import os
from pak import config, structs
#import datetime
import logging

class DirScan:
  def __init__(self):
    # Load config
    self._logger = logging.getLogger('DirScan')
    return

  def scan(self, query, cb):
    self._logger.debug('query is %s' % query)
    if config.Config.DEBUG:
      if '' == query:
        #query = '/home/lazyboy/Downloads'
        #query = '/cygdrive/c/downloads'
        query = 'c:\\downloads'

    if not os.path.exists(query):
      self._logger.debug('Path %s does not exist' % query)
      return

    # TODO(I.A): Don't do this altogether, batch and thread.
    self.retList = []
    idx = 1
    for root, dirs, files in os.walk(query):
      for name in files:
        fullPath = os.path.join(root, name)
        mtime = -1
        try:
          fileStat = os.stat(fullPath)
          size = fileStat.st_size
          mtime = fileStat.st_mtime
          #self._logger.debug('File size: %d, time: %s' % (size, str(mtime)))
          #fileTimeDT = datetime.datetime.fromtimestamp(mtime)
          #self._logger.debug(fileTimeDT.strftime('%d%m%Y-%H:%M'))
          #self._logger.debug(str(fileTimeDT))
        except os.error as e:
          #TODO(I.A): Fix formatting.
          self._logger.debug('Error:', e)
          size = -1

        #print '%04d: %d bytes %s' % (idx, size, fullPath)
        f = structs.FileInfo().setSize(size).setDir(root).setName(name).setMTime(mtime)
        if DirScan.filter(f):
          #print '%04d: %d bytes %s' % (idx, size, fullPath)
          self.retList.append(f)
          # Adventurous
          tag1s = Tag1Suggest.getTags(name)
          if len(tag1s) > 0:
            for tag1 in tag1s:
              print('tag: %s' % tag1.str)
        idx = idx + 1
        # DEBUG only
        if len(self.retList) > 500:
          self._logger.debug('Just added: %04d: %d bytes %s' % (idx, size, fullPath))
          if cb != None:
            cb(self.retList)
          return self.retList

    if cb != None:
      cb(self.retList)
    return self.retList

  @staticmethod
  def filter(fileinfo):
    # TODO(I.A): Proper filtering.
    lname = fileinfo.name.lower()
    correct = True
    if len(config.Config.EXTS) > 0:
      correct = False
      exts = config.Config.EXTS
      for i in range(len(exts)):
        if exts[i] != '' and lname.endswith(exts[i]):
          correct = True
          break

    return correct and fileinfo.size > 1000 * 1000

class Tag1Suggest():
  def __init__(self):
    pass

  @staticmethod
  def getTags(name):
    print('getTags %s' % name)
    ret = [];
    idx = name.find('-')
    if idx == -1:
      return ret

    # trim space
    idx = idx - 1
    while idx >= 0 and name[idx] == ' ':
      idx = idx - 1
    if idx < 0:
      return ret

    #print('possible %s' % name[:idx+1])
    if not name[0].isupper():
      return ret

    parts = []
    inw = True
    i = 0
    for i in range(idx+1):
      if not name[i].isalpha() and name[i] != '.':
        #print('not alpha or dot return')
        return ret

      if name[i] == '.':
        if len(parts) > 1:
          #print('found %s' % ' '.join(parts))
          ret.append(structs.Tag1(-1, ' '.join(parts)))
        parts = []
        inw = False

      if name[i].isupper():
        #print('Upper found at %d' % i)
        if inw and i > 0:
          parts.append(name[lastUpper:i])
        lastUpper = i
        inW = True

    if inw and i > 0:
      parts.append(name[lastUpper:i+1])

    if len(parts) > 1: # single maybe tho
      #print('found %s' % ' '.join(parts))
      ret.append(structs.Tag1(-1, ' '.join(parts)))
    return ret

