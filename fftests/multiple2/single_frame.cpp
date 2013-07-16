#include "single_frame.h"

namespace catdog {

SingleFrame::~SingleFrame() {
  delete frame_data;
}

}  // namespace catdog