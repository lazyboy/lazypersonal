#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cstring>
#include <png.h>
#include <cassert>
#include <inttypes.h>

extern "C" {
#define INT64_C
#define UINT64_C
#define __STDC_CONSTANT_MACROS

#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libswscale/swscale.h>
}

using namespace std;

typedef unsigned int uint;
typedef pair<int, int> PII;

void diedie(const string& msg) {
  puts(msg.c_str());
  exit(1);
}

struct VideoFrame {
  VideoFrame() : w(0), h(0), linesize(0) {}
  VideoFrame(int w, int h, int linesize) {
    this->w = w;
    this->h = h;
    this->linesize = linesize;
  }
  void init(int w, int h, int linesize) {
    int sz = linesize * h;
    assert(sz > 0);
    frame_data.clear();
    frame_data.resize(sz);
  }
  int w;
  int h;
  int linesize;
  std::vector<uint8_t> frame_data;
};

struct MovieDecoder {
  MovieDecoder(const string& filename) :
      m_vstream_idx(-1),
      m_pcodec(NULL),
      m_pcodec_ctx(NULL),
      m_ppacket(NULL),
      m_pframe(NULL),
      m_pframe_buff(NULL) {
    this->filename = filename;
    init();
  }
  ~MovieDecoder() {
    printf("Destroying...");
    destruct();
  }
  void destruct() {
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
  void init() {
    av_register_all();
    avcodec_init();
    avcodec_register_all();

    if (av_open_input_file(&m_pfctx, filename.c_str(), NULL, 0, NULL) != 0) {
      printf("Could not open file: %s\n", filename.c_str());
      exit(1);
    }

    if (av_find_stream_info(m_pfctx) < 0) {
      printf("Could not find stream info");
      exit(1);
    }

    printf("number of streams: %d\n", m_pfctx->nb_streams);
    for (uint i = 0; i < m_pfctx->nb_streams; ++i) {
      if (m_pfctx->streams[i]->codec->codec_type == CODEC_TYPE_VIDEO) {
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

  PII getDimension() {
    return m_pcodec_ctx ?
        make_pair(m_pcodec_ctx->width, m_pcodec_ctx->height) :
        make_pair(-1, -1);
  }
  int getDurationSecs() {
    return m_pcodec_ctx ?
        static_cast<int>(m_pfctx->duration / AV_TIME_BASE) : -1;
  }
  int getWidth() { return m_pcodec_ctx ? m_pcodec_ctx->width : -1; }
  int getHeight() { return m_pcodec_ctx ? m_pcodec_ctx->height : -1; }

  void foo() {
    cout << "Testing here only." << endl;
  }

  bool storeVideoPacket() {
    bool framesAvailable = true;
    bool frameDecoded = false;

    int num_attempts = 0;

    if (m_ppacket) {
      av_free_packet(m_ppacket);
      delete m_ppacket;
    }
    m_ppacket = new AVPacket();

    while(framesAvailable && !frameDecoded && num_attempts < 1000) {
      ++num_attempts;
      framesAvailable = av_read_frame(m_pfctx, m_ppacket) >= 0;
      if (framesAvailable) {
        frameDecoded = m_ppacket->stream_index == m_vstream_idx;
        if (!frameDecoded) {
          av_free_packet(m_ppacket);
        }
      }
    }
    return frameDecoded;
  }
  bool decodeVideoPacket() {
    if (m_ppacket->stream_index != m_vstream_idx) {
      return false;
    }
    avcodec_get_frame_defaults(m_pframe);
    int frameFinished;

    int bytesDecoded = avcodec_decode_video2(
        m_pcodec_ctx, m_pframe, &frameFinished, m_ppacket);
    if (bytesDecoded < 0) {
      puts("Failed to decode vid frame: bytesDecoded < 0");
      exit(1);
    }
    return frameFinished > 0;
  }

  // One of the top level functions?
  bool decodeVideoFrame() {
    bool frameFinished = false;
    while (!frameFinished && storeVideoPacket()) {
      frameFinished = decodeVideoPacket();
    }
    if (!frameFinished) {
      diedie("decodeVideoFrame failed, frame not finished.");
    }
  }

  void generateVideoFrameAndBuffer(int w, int h, PixelFormat pixel_format) {
    decodeVideoFrame();
    if (m_pframe->interlaced_frame) {
      avpicture_deinterlace(
          (AVPicture*) m_pframe, (AVPicture*) m_pframe, m_pcodec_ctx->pix_fmt,
          m_pcodec_ctx->width, m_pcodec_ctx->height);
    }

    m_pframe = avcodec_alloc_frame();
    int numBytes = avpicture_get_size(pixel_format, w, h);
    m_pframe_buff = reinterpret_cast<uint8_t*>(av_malloc(numBytes));
    avpicture_fill((AVPicture*)m_pframe, m_pframe_buff, pixel_format, w, h);
  }

  void getVideoFrame(VideoFrame& ret) {
    int w = getWidth();
    int h = getHeight();
    printf("W %d, H %d\n", w, h);
    PixelFormat pixel_format = PIX_FMT_RGB24;
    generateVideoFrameAndBuffer(w, h, pixel_format);

    ret.init(w, h, m_pframe->linesize[0]);
    // Turn this to a member function?
    memcpy((&(ret.frame_data.front())), m_pframe->data[0],
        ret.h * ret.linesize);
  }

private:
  string filename;
  uint m_vstream_idx;

  AVFormatContext* m_pfctx;
  AVCodecContext* m_pcodec_ctx;
  AVCodec* m_pcodec;
  AVPacket* m_ppacket;
  AVFrame* m_pframe;
  uint8_t* m_pframe_buff;
};

struct PngWriter {
  PngWriter() : m_pfile(NULL), m_ppng(NULL), m_pinfo(NULL) {}
  ~PngWriter() {
    if (m_pfile) fclose(m_pfile);
    if (m_ppng || m_pinfo)
      png_destroy_write_struct(&m_ppng, &m_pinfo);
  }
  void writePng(uint8_t** data, int w, int h, string filename) {
    // Png init stuff.
    m_ppng = png_create_write_struct(PNG_LIBPNG_VER_STRING,
        NULL, NULL, NULL);
    if (!m_ppng) diedie("Cannot create png write structure");
    m_pinfo = png_create_info_struct(m_ppng);
    if (!m_pinfo) {
      png_destroy_write_struct(&m_ppng, (png_infopp)NULL);
      diedie("Cannot create png info structure");
    }
    m_pfile = fopen(filename.c_str(), "wb");
    if (!m_pfile) diedie("Cannot open output file for png");

    png_init_io(m_ppng, m_pfile);

    // Png write stuff.
    if (setjmp(png_jmpbuf(m_ppng))) {
      diedie("Wring png file failed");
    }
	  png_set_IHDR(m_ppng, m_pinfo, w, h, 8,
				PNG_COLOR_TYPE_RGB, PNG_INTERLACE_NONE,
				PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);
    png_set_rows(m_ppng, m_pinfo, data);
    png_write_png(m_ppng, m_pinfo, 0, NULL);	
  }
private:
  FILE* m_pfile;
  png_structp m_ppng;
  png_infop m_pinfo;
};

struct Thumbnailer {
  Thumbnailer() {
  }
  void generateThumbnail(string filename, string thumb_file, int seek_pos=-1) {
    MovieDecoder* movie_decoder;
    movie_decoder = new MovieDecoder(filename);
    VideoFrame video_frame;
    movie_decoder->getVideoFrame(video_frame);

    int linesize = video_frame.linesize;
    int w = video_frame.w;
    int h = video_frame.h;
    printf("Returned Video frame %d X %d, linesize = %d\n", w, h, linesize);

    // Convert video frame to png?
    vector<uint8_t*> row_ptrs;
    for (int i = 0; i < h; ++i) {
      row_ptrs.push_back( &(video_frame.frame_data[i * linesize]));
    }
    PngWriter writer;
    writer.writePng(&(row_ptrs.front()), w, h, thumb_file);
  }
};

int main(int argc, char** argv) {
  int i, j, k;

  if (argc < 2) {
    printf("Usage: %s filename\n", argv[0]);
    return -1;
  }

  MovieDecoder* m;
  m = new MovieDecoder(argv[1]);
  m->foo();

  PII dim = m->getDimension();
  printf("Movie dimension: %d, %d\n", dim.first, dim.second);
  printf("Movie duration: %ds\n", m->getDurationSecs());

  if (argc < 3) {
    printf("Usage: %s filename outputpng\n", argv[0]);
    return -1;
  }
  Thumbnailer* thumb;
  thumb->generateThumbnail(argv[1], argv[2]);
  return 0;
}

