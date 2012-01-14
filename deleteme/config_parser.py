import ConfigParser
import os

def main():
  config = ConfigParser.SafeConfigParser()
  configPath = os.path.expanduser('~/.douchebag')

  try:
    config.read(configPath)
  except:
    print '...Exception reading'

  if not config.has_section('global'):
    config.add_section('global')

  if not config.has_option('global', 'max-filesize'):
    config.set('global', 'max-filesize', str(100 * 1000 * 1000))


  ivalue = config.getint('global', 'max-filesize')
  print 'int value:', ivalue

  # Write config to file
  with open(configPath, 'wb') as configFile:
    config.write(configFile)

  return

if __name__ == '__main__':
  main()
