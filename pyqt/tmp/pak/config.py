import logging

print('init logging')
FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(
    level=logging.DEBUG,
    format=FORMAT)

class Config:
  DEBUG = True
  def __init__(self):
    return
