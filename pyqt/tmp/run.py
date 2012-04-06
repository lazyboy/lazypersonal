#!/usr/bin/env python
# NOT USED
import os, sys

try:
  import _preamble
except ImportError:
  sys.exc_clear()

sys.path.insert(0, os.path.abspath(os.getcwd()))

from main import run
run()

