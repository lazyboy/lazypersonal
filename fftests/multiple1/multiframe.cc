// Copyright (C) 2010 Istiaque Ahmed <lazyboybd@gmail.com>
//
// GNU General Public License goes here...

#include "multiframe.h"
#include <inttypes.h>
#include <vector>
#include <cassert>
#include <iostream>
#include <cstdio>

using namespace std;
using namespace lbfftest;

namespace lbfftest {

  void MultiFrame::init(int R, int C, vector<Frame>& frames) {
    assert(frames.size() == R * C);
    assert(frames.size() > 0);
    Frame& f = frames[0];
    int perh = f.h;
    int perw = f.w;
    int per_linesize = f.linesize;

    for (int i = 0; i < frames.size(); ++i) {
      assert(frames[i].w == perw);
      assert(frames[i].h == perh);
      assert(frames[i].linesize == per_linesize);
    }

    int factor = per_linesize / perw;
    printf("Factor is: %d\n", factor);
    m_linesize = f.linesize * C + (C + 1) * m_bordersize * factor;
    m_h = f.h * R + (R + 1) * m_bordersize;
    m_w = f.w * C + (C + 1) * m_bordersize;
    data.resize(m_linesize * m_h);

    vector<uint8_t> blank_row;
    blank_row.resize(m_linesize);
    for (int i = 0; i < m_linesize; ++i) {
      blank_row[i] = GRAY;
    }

    int pos = 0; 
    for (int i = 0; i < m_h; ++i) {
      int off = i % (perh + m_bordersize);
      if (off < m_bordersize) {
        // This is complete row of border.
        for (int j = 0; j < m_linesize; ++j) data[pos++] = blank_row[j];
      } else {
        int imgoff = off - m_bordersize;
        int imgrow = i / (perh + m_bordersize);
        if (!imgoff) {
          printf("Starting for %d\n", imgrow);
        }

        int begpos = pos;
        for (int j = 0; j < C; ++j) {
          int imgidx = imgrow * C + j;
          // first put the border
          for (int k = 0; k < m_bordersize * factor; ++k) data[pos++] = GRAY;
          // Then the imgoff'th row of the current image.
          Frame& f = frames[imgidx];
          for (int k = 0; k < per_linesize; ++k) {
            data[pos++] = f.data[imgoff * per_linesize + k];
          }
        }
        // In the end we put one more border.
        for (int k = 0; k < m_bordersize * factor; ++k) data[pos++] = GRAY;
        int endpos = pos;
        int ls = m_linesize;
        assert(endpos - begpos == ls);
      }
    }
    int tot = m_linesize * (int)m_h;
    assert(pos == tot);
  }

  void MultiFrame::destroy() {
    data.clear();
  }

} // End namespace lbfftest
