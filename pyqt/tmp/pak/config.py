import configparser, logging, os

print('init logging')
FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(
    level=logging.DEBUG,
    format=FORMAT)

CONFIG_FILE_PATH = os.path.expanduser('~/.douchebag')

class Config:
  DEBUG = True
  def __init__(self):
    self._logger = logging.getLogger('Config')
    self.initConfig()
    return

  def initConfig(self):
    config = configparser.SafeConfigParser()

    try:
      config.read(CONFIG_FILE_PATH)
    except:
      self._logger.error('Exception reading config file')

    if not config.has_section('global'):
      config.add_section('global')

    if not config.has_option('global', 'max-filesize'):
      config.set('global', 'max-filesize', str(100 * 1000 * 1000))

    # Not used
    ivalue = config.getint('global', 'max-filesize')

    exts = []
    if config.has_option('global', 'exts'):
      extStr = config.get('global', 'exts')
      exts = extStr.split(',')
      self._logger.info('Found exts: ' + '--'.join(exts))
    Config.EXTS = exts

    # Write config to file
    #with open(CONFIG_FILE_PATH, 'w') as configFile:
    #  config.write(configFile)
