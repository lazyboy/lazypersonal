#!/usr/bin/python
# Compiles soy (to js) using closure library.
import getopt, sys, os
import shutil

soy_out_dir = 'gen/'

def main(argv):
  # Remove existing gen directory.
  shutil.rmtree(soy_out_dir)

  all_soy_filenames = 'ui.soy'
    
  # Build the command line
  command = "java -jar SoyToJsSrcCompiler.jar " + \
      "--shouldProvideRequireSoyNamespaces " + \
      "--outputPathFormat " + soy_out_dir + "{INPUT_FILE_NAME}.generated.js " + \
      all_soy_filenames

  print("Executing: ", command)
  os.system(command)

if __name__ == '__main__':
  main(sys.argv[1:])
