import logging

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(
    level=logging.DEBUG,
    format=FORMAT)

class Config:
  DEBUG = False
  def __init__(self):
    pass

