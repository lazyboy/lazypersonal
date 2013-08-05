#include "base_utils.h"
#include "movie_decoder.h"
#include "single_frame.h"
#include <iostream>

// TODO(lazyboy): Clean up.
extern "C" {
//#define INT64_C
//#define UINT64_C
#define __STDC_CONSTANT_MACROS

#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libswscale/swscale.h>
}

extern "C" {
  #include <avcodec.h>
  #include <avformat.h>
  #include <swscale.h>
}

namespace catdog {

MovieDecoder::MovieDecoder(const std::string& file_name)
  : m_vstream_idx(-1),
    m_pcodec(NULL),
    m_pcodec_ctx(NULL),
    m_ppacket(NULL),
    m_pframe(NULL),
    m_pframe_buff(NULL) {
  this->file_name = file_name;
  Initialize();
}

MovieDecoder::~MovieDecoder() {
  printf("Destroying...");
  Destruct();
}

void MovieDecoder::Destruct() {
  if (m_ppacket) {
    av_free_packet(m_ppacket);
    delete m_ppacket;
    m_ppacket = NULL;
  }
  if (m_pframe) {
    av_free(m_pframe); m_pframe = NULL;
  }
  if (m_pframe_buff) {
    av_free(m_pframe_buff); m_pframe_buff = NULL;
  }
}

void MovieDecoder::Initialize() {
  av_register_all();
  //avcodec_init();
  avcodec_register_all();

  m_pfctx = avformat_alloc_context();
  //if (av_open_input_file(&m_pfctx, file_name.c_str(), NULL, 0, NULL) != 0) {
  if (avformat_open_input(&m_pfctx, file_name.c_str(), NULL, NULL) != 0) {
    printf("Could not open file: %s\n", file_name.c_str());
    exit(1);
  }

  if (av_find_stream_info(m_pfctx) < 0) {
    printf("Could not find stream info");
    exit(1);
  }

  printf("number of streams: %d\n", m_pfctx->nb_streams);
  for (uint i = 0; i < m_pfctx->nb_streams; ++i) {
    if (m_pfctx->streams[i]->codec->codec_type == //CODEC_TYPE_VIDEO) {
      AVMEDIA_TYPE_VIDEO) {
      puts("Yay, video steam found!");
      m_vstream_idx = i;
      break;
    }
  }

  if (m_vstream_idx == -1) {
    puts("Cannot find video stream");
    exit(1);
  }

  // Get the codec context.
  m_pcodec_ctx = m_pfctx->streams[m_vstream_idx]->codec;
  m_pcodec = avcodec_find_decoder(m_pcodec_ctx->codec_id);
  if (m_pcodec == NULL) {
    puts("Video codec not found.");
    // They say it will throw buggy error otherwise.
    m_pcodec_ctx = NULL;
    exit(1);
  }

  m_pcodec_ctx->workaround_bugs = 1;
  if (avcodec_open(m_pcodec_ctx, m_pcodec) < 0) {
    puts("Could not open video codec");
  }

  // Set the video frame
  m_pframe = avcodec_alloc_frame();
}

PII MovieDecoder::GetDimension() {
  return m_pcodec_ctx ?
      std::make_pair(m_pcodec_ctx->width, m_pcodec_ctx->height) :
      std::make_pair(-1, -1);
}

int MovieDecoder::GetDurationSecs() {
  return m_pcodec_ctx ?
      static_cast<int>(m_pfctx->duration / AV_TIME_BASE) : -1;
}

int MovieDecoder::GetWidth() { return m_pcodec_ctx ? m_pcodec_ctx->width : -1; }
int MovieDecoder::GetHeight() { return m_pcodec_ctx ? m_pcodec_ctx->height : -1; }

bool MovieDecoder::StoreVideoPacket() {
  bool frames_available = true;
  bool frame_decoded = false;

  if (m_ppacket) {
    av_free_packet(m_ppacket);
    delete m_ppacket;
  }
  m_ppacket = new AVPacket();

  int num_attempts = 0;
  while (frames_available && !frame_decoded && num_attempts < 1000) {
    ++num_attempts;
    frames_available = av_read_frame(m_pfctx, m_ppacket) >= 0;
    if (frames_available) {
      frame_decoded = m_ppacket->stream_index == m_vstream_idx;
      if (!frame_decoded) {
        av_free_packet(m_ppacket);
      }
    }
  }
  return frame_decoded;
}

bool MovieDecoder::DecodeVideoPacket() {
  if (m_ppacket->stream_index != m_vstream_idx) {
    return false;
  }
  avcodec_get_frame_defaults(m_pframe);
  int frame_finished;

  int bytes_decoded = avcodec_decode_video2(
      m_pcodec_ctx, m_pframe, &frame_finished, m_ppacket);
  if (bytes_decoded < 0) {
    throw std::logic_error("Failed to decode vid frame: bytes_decoded < 0");
  }
  return frame_finished > 0;
}

// One of the top level functions?
bool MovieDecoder::DecodeVideoFrame() {
  bool frame_finished = false;
  while (!frame_finished && StoreVideoPacket()) {
    frame_finished = DecodeVideoPacket();
  }
  if (!frame_finished) {
    throw std::logic_error("DecodeVideoFrame failed, frame not finished.");
  }
  return frame_finished;
}

void MovieDecoder::GenerateVideoFrameAndBuffer(int dest_width,
                                               int dest_height,
                                               PixelFormat pixel_format,
                                               int seek_pos) {
  DecodeVideoFrame();

  // Do seek after one frame is decoded.
  if (seek_pos != -1) {
    try {
      printf("Seeking secs: %d\n", seek_pos);
      Seek(seek_pos);
      printf("Seeking succesful: %d\n", seek_pos);
    } catch (std::exception& e) {
      std::cerr << e.what() << ", what to do now?" << std::endl;
      throw std::logic_error("Puzzled");
    }
  }

  if (m_pframe->interlaced_frame) {
    avpicture_deinterlace(
        (AVPicture*) m_pframe, (AVPicture*) m_pframe, m_pcodec_ctx->pix_fmt,
        m_pcodec_ctx->width, m_pcodec_ctx->height);
  }

  AVFrame* new_pframe = avcodec_alloc_frame();
  int num_bytes = avpicture_get_size(pixel_format, dest_width, dest_height);
  uint8_t* new_pframe_buff = reinterpret_cast<uint8_t*>(av_malloc(num_bytes));
  avpicture_fill((AVPicture*)new_pframe, new_pframe_buff, pixel_format, dest_width, dest_height);

  // Real scale begin.
  SwsContext* scale_ctx = sws_getContext(
      m_pcodec_ctx->width, m_pcodec_ctx->height, m_pcodec_ctx->pix_fmt,
      dest_width, dest_height, pixel_format,
      //m_pcodec_ctx->width, m_pcodec_ctx->height, pixel_format,
      SWS_BICUBIC, NULL, NULL, NULL);
  if (!scale_ctx) {
    throw std::logic_error("Failed to create resize context");
  }

  sws_scale(scale_ctx, m_pframe->data, m_pframe->linesize, 0,
      m_pcodec_ctx->height, new_pframe->data, new_pframe->linesize);
  sws_freeContext(scale_ctx);
  // Real scale end.

  av_free(m_pframe);
  av_free(m_pframe_buff);

  m_pframe = new_pframe;
  m_pframe_buff = new_pframe_buff;
}

SingleFrame* MovieDecoder::GetVideoFrame(int dest_width, int dest_height, int seek_pos) {
  int w = GetWidth();
  int h = GetHeight();
  printf("W %d, H %d\n", w, h);
  PixelFormat pixel_format = PIX_FMT_RGB24;
  GenerateVideoFrameAndBuffer(dest_width, dest_height, pixel_format, seek_pos);

  SingleFrame* ret = new SingleFrame(dest_width, dest_height, m_pframe->linesize[0]);
  // Turn this to a member function?
  memcpy((&(ret->frame_data->front())), m_pframe->data[0],
      ret->height * ret->line_size);

  return ret;
}

SingleFrame* MovieDecoder::GetVideoFrameMultiple(
    int per_width, int per_height, int R, std::vector<int>& seek_positions) {
  int n = seek_positions.size();
  assert(n > 0);
  assert(n % R == 0);
  assert(R > 0);
  int C = n / R;

  int w = GetWidth();
  int h = GetHeight();
  printf("W %d, H %d\n", w, h);

  // Following memcpy code is completely retarded.
  PixelFormat pixel_format = PIX_FMT_RGB24;
  // Get the first frame for init values.
  GenerateVideoFrameAndBuffer(per_width, per_height, pixel_format, seek_positions[0]);

  int line_size = m_pframe->linesize[0];
  int total_line_size = C * line_size;
  SingleFrame* ret = new SingleFrame(per_width * C, per_height * R, total_line_size);
  for (int i = 0; i < R; ++i) {
    for (int j = 0; j < C; ++j) {
      if (i || j) GenerateVideoFrameAndBuffer(per_width, per_height, pixel_format, seek_positions[i*C+j]);
      int target_r = i * per_height;
      int target_c = j * line_size;
      int rr = 0;
      for (int a = 0; a < per_height; ++a) {
        for (int k = 0; k < line_size; ++k) {
          //printf("Accessing %d, size: %d\n", rr, (int)(*(ret->frame_data)).size());

          int tr = target_r + a;
          int tc = target_c + k;
          ret->frame_data->at(tr * total_line_size + tc) = (static_cast<uint8_t**>(m_pframe->data)[0][rr]); ++rr;
        }
      }
      printf("Done %d, %d\n", i, j);
    }
  }
  return ret;
}

void MovieDecoder::Seek(int secs) {
  int64_t tstamp = AV_TIME_BASE * static_cast<int64_t>(secs);
  printf("tstamp %lld\n", tstamp);
  if (tstamp < 0) tstamp = 0;
  int ret = av_seek_frame(m_pfctx, -1, tstamp, 0);
  if (ret >= 0) {
    avcodec_flush_buffers(m_pfctx->streams[m_vstream_idx]->codec);
  } else {
    DieDie("Seeking failed");
  }

  int keyfr_attemps = 0;
  bool got_frame = false;
  do {
    int kount = 0;
    got_frame = false;
    while (!got_frame && kount < 20) {
      StoreVideoPacket();
      try {
        got_frame = DecodeVideoPacket();
      } catch (std::logic_error&) {
        ;
      }
      ++kount;
    }
    ++keyfr_attemps;
  } while ((!got_frame || !m_pframe->key_frame) && keyfr_attemps < 200);

  if (!got_frame) {
    throw std::logic_error("Seeking failed (2)");
  }
}


}  // namespace catdog
