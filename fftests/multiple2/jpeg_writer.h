#ifndef CATDOG_JPEG_WRITER_H_
#define CATDOG_JPEG_WRITER_H_

#include <inttypes.h>
#include <string>
#include <vector>

namespace catdog {

class JPEGWriter {
 public:
  static int Write(const std::vector<uint8_t*>& data,
                   int width,
                   int height,
                   std::string file_name);
};

}  // namespace catdog

#endif  // CATDOG_JPEG_WRITER_H_
