#include <iostream>
#include <cstdio>
#include <cassert>
#include <string>

#define HEX_TO_INT(h) ((h)>='a'?((h)-'a'+10):((h)-'0'))
#define INT_TO_HEX(i) ((i)<10?((i)+'0'):((i)-10+'a'))
std::string solve(const std::string& A, const std::string& B) {
  assert(A.size() == B.size());
  std::string ret;
  ret.reserve(A.size());
  for (size_t i = 0; i < A.size(); ++i) {
    int r = HEX_TO_INT(A[i]) ^ HEX_TO_INT(B[i]);
    ret += INT_TO_HEX(r);
  }
  return ret;
}

int main() {
  std::string A = "1c0111001f010100061a024b53535009181c";
  std::string B = "686974207468652062756c6c277320657965";
  std::string value = solve(A, B);
  std::string expected_value = "746865206b696420646f6e277420706c6179";
  assert(value == expected_value);
  printf("Test Passed\n");
  return 0;
}
