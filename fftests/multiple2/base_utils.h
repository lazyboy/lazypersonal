#ifndef CATDOG_BASE_UTILS_H_
#define CATDOG_BASE_UTILS_H_

#include <string>
#include <cstdio>

namespace catdog {

void DieDie(const std::string& msg) {
  puts(msg.c_str());
  exit(1);
}

}  // namespace catdog

#endif  // CATDOG_BASE_UTILS_H_