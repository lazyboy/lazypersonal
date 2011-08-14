#!/usr/bin/python
# Author: lazyboy (lazyboybd at gmail d0t com)
# Compiles soy using closure library, run this from this file's own dir.
# See README in the top level dir for info on using it.
import getopt, sys, os
import shutil

top_level = '../'
soy_to_js_src_compiler_dir = top_level + 'soy/'
closure_compiler = ''
closure_base = ''
js_sources = ''

closure_base = '/Users/lazyboy/temp/clot/closure-library-read-only/'
closure_builder = os.path.join(closure_base, 'closure/bin/build/closurebuilder.py')

js_root = os.path.join(top_level, 'js/')
soy_helper_goog_file = os.path.join(top_level, 'soy/soyutils_usegoog.js')
final_js_output_file = os.path.join(top_level, 'compiled.js')

soy_in_dir = os.path.join(top_level, 'soy/')
soy_out_dir = os.path.join(top_level, 'soy/gen/')

def main(argv):
  #set_vars_from_args(argv)

  # Remove existing gen directory.
  try:
    shutil.rmtree(soy_out_dir)
  except Exception:
    print("Cannot remove soy gen dir, it's proabably okay.")

  all_soy_filenames = soy_in_dir + '*.soy'
    
  # Step 1. Compile soy to js.
  # Build the command line
  command = "java -jar " + \
      soy_to_js_src_compiler_dir + "SoyToJsSrcCompiler.jar " + \
      "--shouldProvideRequireSoyNamespaces " + \
      "--outputPathFormat " + soy_out_dir + "{INPUT_FILE_NAME}.generated.js " + \
      all_soy_filenames

  print("Executing 1: ", command)
  os.system(command)

  # Copy soy utils file
  shutil.copy(soy_helper_goog_file, soy_out_dir)

  # Step 1. Compile all js, including previously generate soy js.
  # Now compile javascript with soy.
  command = closure_builder + \
      " --root=" + closure_base + " --root=" + js_root +  ' --root=' + soy_out_dir + \
      " -o script" + \
      ' --namespace="douche.main"' + \
      " -c compiler.jar" + \
      " > " + final_js_output_file
  print("Executing 2: ", command)
  os.system(command)
  return

'''
def set_vars_from_args(argv):
  try:
    opts, args = getopt.getopt(argv, "c:b:j:", ["closure-compiler=", "closure-base=", "js-sources="])
  except getopt.GetoptError:
    #print str(err) # Will print something like "option -x not recognized"
    print("Some thing went wrong.")
    sys.exit()
  
  global closure_compiler, closure_base, js_sources
  for o, a in opts:
    if o in ("-c", "--closure-compiler"):
      closure_compiler = a
    elif o in ("-b", "--closure-base"):
      closure_base = a
    elif o in ("-j", "--js-sources="):
      js_sources = a
    else:
      assert False, "Unhandled option: " + o
      
  if closure_compiler == '':
    print("Closure compiler path not set.")
    sys.exit()
  if closure_base == '':
    print("Closure base path not set.")
    sys.exit()
  if js_sources == '':
    print("Js sources base not set.")
    sys.exit()
  return
'''

if __name__ == '__main__':
  main(sys.argv[1:])
