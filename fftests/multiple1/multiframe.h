// Copyright (C) 2010 Istiaque Ahmed <lazyboybd@gmail.com>
//
// GNU General Public License goes here...

#ifndef LBFFTEST_MULTIFRAME_H
#define LBFFTEST_MULTIFRAME_H

#include <inttypes.h>
#include <vector>
#include <cassert>
#include <iostream>
#include "frame.h"

using namespace std;

namespace lbfftest {

class MultiFrame {
public:
  MultiFrame(int bordersize) : m_bordersize(bordersize) {
  }
  void init(int R, int C, vector<Frame>& frames);
  void destroy();
  int getW() { return m_w; }
  int getH() { return m_h; }
  int getLinesize() { return m_linesize; }

  vector<uint8_t> data;

private:
  int m_bordersize;
  int m_linesize;
  int m_w;
  int m_h;
  static const int bR = 127;
  static const int bG = 127;
  static const int bB = 127;
  static const uint8_t GRAY = static_cast<uint8_t>(0xee);
};

} // End namespace lbfftest
#endif
