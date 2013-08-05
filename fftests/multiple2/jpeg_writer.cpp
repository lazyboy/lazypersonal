#include "jpeg_writer.h"

#include "jpeglib.h"

namespace catdog {

// static.
int JPEGWriter::Write(const std::vector<uint8_t*>& data,
                      int width,
                      int height,
                      std::string file_name) {
  struct jpeg_compress_struct cinfo;
  struct jpeg_error_mgr jerr;

  /* this is a pointer to one row of image data */
  JSAMPROW row_pointer[1];
  FILE* out_file = fopen(file_name.c_str(), "wb");
  if (!out_file) {
    printf("Error opening output jpeg file %s\n!", file_name);
    return -1;
  }

  cinfo.err = jpeg_std_error(&jerr);
  jpeg_create_compress(&cinfo);
  jpeg_stdio_dest(&cinfo, out_file);

  int g_bytes_per_pixel = 3;
  J_COLOR_SPACE g_color_space = JCS_RGB;
  /* Setting the parameters of the output file here */
  cinfo.image_width = width;	
  cinfo.image_height = height;
  cinfo.input_components = g_bytes_per_pixel;
  cinfo.in_color_space = g_color_space;
  /* default compression parameters, we shouldn't be worried about these */
  jpeg_set_defaults(&cinfo);
  /* Now do the compression .. */
  jpeg_start_compress(&cinfo, TRUE);
  /* like reading a file, this time write one row at a time */
  while (cinfo.next_scanline < cinfo.image_height) {
    //row_pointer[0] = reinterpret_cast<JSAMPROW>(&data[cinfo.next_scanline * cinfo.image_width *  cinfo.input_components]);
    row_pointer[0] = reinterpret_cast<JSAMPROW>(data[cinfo.next_scanline]);
    jpeg_write_scanlines(&cinfo, row_pointer, 1);
  }
  /* similar to read file, clean up after we're done compressing */
  jpeg_finish_compress(&cinfo);
  jpeg_destroy_compress(&cinfo);
  fclose(out_file);
  /* success code is 1! */
  return 1;
}

}  // namespace catdog