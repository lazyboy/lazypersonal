#ifndef CATDOG_MOVIE_DECODER_H_
#define CATDOG_MOVIE_DECODER_H_

#include "base_types.h"
#include <inttypes.h>
#include <libavutil/pixfmt.h>
#include <string>
#include <utility>
#include <vector>

extern "C" {
//#define INT64_C
//#define UINT64_C
#define __STDC_CONSTANT_MACROS
}

struct AVCodec;
struct AVCodecContext;
struct AVFormatContext;
struct AVFrame;
struct AVPacket;

namespace catdog {

struct SingleFrame;

class MovieDecoder {
 public:
  MovieDecoder(const std::string& file_name);
  ~MovieDecoder();
  PII GetDimension();
  int GetDurationSecs();
  int GetWidth();
  int GetHeight();
  SingleFrame* GetVideoFrame(int dest_width, int dest_height, int seek_pos=-1);
  SingleFrame* GetVideoFrameMultiple(
      int per_width, int per_height, int rows, std::vector<int>& seek_positions);
  void Seek(int secs);

private:
  void Destruct();
  void Initialize();
  bool StoreVideoPacket();
  bool DecodeVideoPacket();
  // One of the top level functions?
  bool DecodeVideoFrame();
  void GenerateVideoFrameAndBuffer(int width,
                                   int height,
                                   PixelFormat pixel_format,
                                   int seek_pos=-1);

  std::string file_name;
  uint m_vstream_idx;

  AVFormatContext* m_pfctx;
  AVCodecContext* m_pcodec_ctx;
  AVCodec* m_pcodec;
  AVPacket* m_ppacket;
  AVFrame* m_pframe;
  uint8_t* m_pframe_buff;
};

}  // namespace catdog

#endif  // CATDOG_MOVIE_DECODER_H_