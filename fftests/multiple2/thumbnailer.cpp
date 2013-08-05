#include "thumbnailer.h"
#include "single_frame.h"
#include "jpeg_writer.h"
#include "movie_decoder.h"

namespace catdog {

Thumbnailer::Thumbnailer()
  : frame_(NULL) {
  printf("Thumbnailer ctor\n");
}

Thumbnailer::~Thumbnailer() {
  Clear();
}

void Thumbnailer::Clear() {
  if (frame_) delete frame_;
}

void Thumbnailer::GenerateRows(const std::string& file_name, int seek_pos, std::vector<uint8_t*>* row_ptrs, int* w, int* h) {
  MovieDecoder* movie_decoder;
  movie_decoder = new MovieDecoder(file_name);
  int actual_width = movie_decoder->GetWidth();
  int actual_height = movie_decoder->GetHeight();
  int dst_width = 200;
  int dst_height = 200;
  dst_width = actual_width/2;
  dst_height = actual_height/2;
  frame_ = movie_decoder->GetVideoFrame(dst_width, dst_height, seek_pos);

  int line_size = frame_->line_size;
  *w = frame_->width;
  *h = frame_->height;
  printf("Returned Video frame %d X %d, linesize = %d\n", *w, *h, line_size);

  // Convert video frame to png?
    
  for (int i = 0; i < *h; ++i) {
    row_ptrs->push_back(&(frame_->frame_data->at(i * line_size)));
  }
  delete movie_decoder;
}

void Thumbnailer::GenerateMultiRows(const std::string& file_name, int rows, std::vector<int>& seek_positions, std::vector<uint8_t*>* row_ptrs, int* w, int* h) {
  MovieDecoder* movie_decoder;
  movie_decoder = new MovieDecoder(file_name);
  int actual_width = movie_decoder->GetWidth();
  int actual_height = movie_decoder->GetHeight();
  int dst_width = 200;
  int dst_height = 200;
  dst_width = actual_width/2;
  dst_height = actual_height/2;
  frame_ = movie_decoder->GetVideoFrameMultiple(dst_width, dst_height, rows, seek_positions);

  int line_size = frame_->line_size;
  *w = frame_->width;
  *h = frame_->height;
  printf("Returned Video frame %d X %d, linesize = %d\n", *w, *h, line_size);

  // Convert video frame to png?
    
  for (int i = 0; i < *h; ++i) {
    row_ptrs->push_back(&(frame_->frame_data->at(i * line_size)));
  }
  delete movie_decoder;
}

void Thumbnailer::GenerateJpegStrips(const std::string& file_name, const std::string& thumb_file, int rows, std::vector<int>& seek_positions) {
  std::vector<uint8_t*> row_ptrs;
  int width, height;
  GenerateMultiRows(file_name, rows, seek_positions, &row_ptrs, &width, &height);
  JPEGWriter::Write(row_ptrs, width, height, thumb_file);

}

void Thumbnailer::GenerateJpegThumb(std::string file_name, std::string thumb_file, int seek_pos) {
  std::vector<uint8_t*> row_ptrs;
  int width, height;
  GenerateRows(file_name, seek_pos, &row_ptrs, &width, &height);
  JPEGWriter::Write(row_ptrs, width, height, thumb_file);
}

}  // namespace catdog