#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cstring>

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

struct MovieDecoder {
  MovieDecoder(const string& filename) : m_vstream_idx(-1) {
    this->filename = filename;
    init();
  }
  ~MovieDecoder() {
    printf("Destroying...");
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
    m_codec_ctx = m_pfctx->streams[m_vstream_idx]->codec;
    m_codec = avcodec_find_decoder(m_codec_ctx->codec_id);
    if (m_codec == NULL) {
      puts("Video codec not found.");
      // They say it will throw buggy error otherwise.
      m_codec_ctx = NULL;
      exit(1);
    }

    m_codec_ctx->workaround_bugs = 1;
    if (avcodec_open(m_codec_ctx, m_codec) < 0) {
      puts("Could not open video codec");
    }
  }

  PII getDimension() {
    return m_codec_ctx ?
        make_pair(m_codec_ctx->width, m_codec_ctx->height) :
        make_pair(-1, -1);
  }

  int getDurationSecs() {
    return m_codec_ctx ?
        static_cast<int>(m_pfctx->duration / AV_TIME_BASE) : -1;
  }

  int getWidth() { return m_codec_ctx ? m_codec_ctx->width : -1; }
  int getHeight() { return m_codec_ctx ? m_codec_ctx->height : -1; }

  void foo() {
    cout << "Testing here only." << endl;
  }
private:
  string filename;
  uint m_vstream_idx;

  AVFormatContext* m_pfctx;
  AVCodecContext* m_codec_ctx;
  AVCodec* m_codec;
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
  return 0;
}

