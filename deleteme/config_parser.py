import ConfigParser
import os

def main():
  config = ConfigParser.SafeConfigParser()
  configPath = os.path.expanduser('~/.douchebag')
  config.read(configPath)

  ret = config.has_option('global', 'max-filesize')
  print 'hasth option: ', ret

  ivalue = config.getint('global', 'max-filesize')
  print 'int value: ', ivalue

  return

if __name__ == '__main__':
  main()
