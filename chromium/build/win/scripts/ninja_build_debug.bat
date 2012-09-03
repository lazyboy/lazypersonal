set GYP_DEFINES=component=shared_library
set GYP_GENERATORS=ninja
ninja -C out\Debug chrome.exe -j32
