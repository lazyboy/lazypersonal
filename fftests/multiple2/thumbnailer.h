#ifndef CATDOG_THUMBNAILER_H_
#define CATDOG_THUMBNAILER_H_

#include "base_types.h"
#include <string>
#include <vector>

namespace catdog {
struct SingleFrame;

class Thumbnailer {
 public:
  Thumbnailer();
  ~Thumbnailer();

  void GenerateJpegThumb(std::string file_name, std::string thumb_file, int seek_pos=-1);
  void GenerateJpegStrips(const std::string& file_name, const std::string& thumb_file, int rows, std::vector<int>& seek_positions);
 private:
  void Clear();
  void GenerateRows(const std::string& filename, int seek_pos, std::vector<uint8_t*>* row_ptrs, int* w, int* h);
  void GenerateMultiRows(const std::string& file_name, int rows, std::vector<int>& seek_positions, std::vector<uint8_t*>* row_ptrs, int* w, int* h);

  SingleFrame* frame_;
};

}  // namespace catdog
#endif  // CATDOG_THUMBNAILER_H_