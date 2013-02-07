#include <cstdio>
#include <cassert>
#include <algorithm>
#include <map>
using namespace std;

struct Element {
  int a;
  Element(int a) : a(a) {}
  /*Element(const Element& other) : a(other.a) {}*/
};

int main() {
  int i, j, k;
  map<int, Element> m;

  m.insert(make_pair(-1, Element(2)));
  map<int, Element>::iterator iter = m.find(-1);
  Element* ptr = &(iter->second);

  for (i = 0; i < 1000000; ++i) {
    m.insert(make_pair(i, Element(i)));
  }
  for (i = 0; i < 1000000; i += 2) {
    m.erase(m.find(i));
  }
  map<int, Element>::iterator iter2 = m.find(-1);
  Element* ptr2 = &(iter2->second);

  printf("ptr: %p, ptr2: %p\n", ptr, ptr2);
  return 0;
}

