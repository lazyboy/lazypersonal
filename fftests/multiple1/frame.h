// Copyright (C) 2010 Istiaque Ahmed <lazyboybd@gmail.com>
//
// GNU General Public License goes here...

#ifndef LBFFTEST_FRAME_H
#define LBFFTEST_FRAME_H

#include <inttypes.h>
#include <vector>

namespace lbfftest {

class Frame {
public:
  int w;
  int h;
  int linesize;
  std::vector<uint8_t> data;
  void init(int w, int h, int linesize, std::vector<uint8_t>& data) {
    this->w = w;
    this->h = h;
    this->linesize = linesize;
    this->data = data;
  }
  Frame() {}
};

} // End namespace lbfftest
#endif

