set GYP_DEFINES=component=shared_library
set GYP_GENERATORS=ninja
python ./build/gyp_chromium -Gconfig=Release -Goutput_dir=out_ninjarelease

