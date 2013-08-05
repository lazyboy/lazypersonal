#ifndef CATDOG_SINGLE_FRAME_H_
#define CATDOG_SINGLE_FRAME_H_

#include <cassert>
#include <inttypes.h>
#include <vector>

namespace catdog {

struct SingleFrame {
  SingleFrame(int width, int height, int line_size)
    : width(width),
      height(height),
      line_size(line_size) {
    int sz = line_size * height;
    printf("SingleFrame.ctor: w = %d, h = %d, ls = %d\n", width, height, line_size);
    assert(sz > 0);
    frame_data = new std::vector<uint8_t>();
    frame_data->clear();
    frame_data->resize(sz);
  }

  ~SingleFrame();

  int width;
  int height;
  int line_size;
  std::vector<uint8_t>* frame_data;
};

}  // namespace catdog

#endif  // CATDOG_SINGLE_FRAME_H_