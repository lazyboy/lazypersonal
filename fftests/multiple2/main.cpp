#include <iostream>
#include <vector>
#include "thumbnailer.h"

#define pb push_back

int main(int argc, char** argv) {
  catdog::Thumbnailer thumb;
  thumb.GenerateJpegThumb("c:\\home\\b1.avi", "c:\\home\\bnpath1.jpg", 149);

  catdog::Thumbnailer multi;
  std::vector<int> seeks; seeks.pb(1); seeks.pb(13); seeks.pb(25); seeks.pb(108);
  multi.GenerateJpegStrips("c:\\home\\b1.avi", "c:\\home\\bnstrip.jpg", 2, seeks);
}
