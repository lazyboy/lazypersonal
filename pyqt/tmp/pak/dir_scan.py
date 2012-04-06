import os
from pak import config, structs
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
        query = 'c:/downloads'

    if not os.path.exists(query):
      self._logger.debug('Path %s does not exist' % query)
      return

    # TODO(I.A): Don't do this altogether, batch and thread.
    self.retList = []
    idx = 1
    for root, dirs, files in os.walk(query):
      for name in files:
        fullPath = os.path.join(root, name)
        try:
          size = os.path.getsize(fullPath)
        except os.error as e:
          #TODO(I.A): Fix formatting.
          self._logger.debug('Error:', e)
          size = -1
        #print '%04d: %d bytes %s' % (idx, size, fullPath)
        f = structs.FileInfo().setSize(size).setDir(root).setName(name)
        if DirScan.filter(f):
          #print '%04d: %d bytes %s' % (idx, size, fullPath)
          self.retList.append(f)
        idx = idx + 1

        # DEBUG only
        if idx > 10:
          cb(self.retList)
          return self.retList

    cb(self.retList)
    return self.retList

  @staticmethod
  def filter(fileinfo):
    # TODO(I.A): Proper filtering.
    return fileinfo.size > 10 * 1000

