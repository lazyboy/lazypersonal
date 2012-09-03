set GYP_DEFINES=component=shared_library
set GYP_GENERATORS=ninja
ninja -C out_ninjarelease\Release -j16 chrome.exe