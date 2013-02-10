#include <cstdio>
#include <cassert>
#include <algorithm>
#include <map>
#include <vector>
using namespace std;

struct Element {
  int a;
  Element(int a) : a(a) {}
  /*Element(const Element& other) : a(other.a) {}*/
};

bool operator < (const Element& a, const Element& b) {
  return a.a < b.a;
}

int main() {
  int i, j, k;

  printf("Map test\n");
  map<int, Element> m;

  m.insert(make_pair(-1, Element(2)));
  map<int, Element>::iterator iter = m.find(-1);
  Element* ptr = &(iter->second);

  for (i = 0; i < 10000000; ++i) {
    m.insert(make_pair(i, Element(i)));
  }
  printf("Size in the beginning: %d\n", (int)m.size());
  for (i = 0; i < 10000000; i += 2) {
    m.erase(m.find(i));
  }
  printf("Size now: %d\n", (int)m.size());
  map<int, Element>::iterator iter2 = m.find(-1);
  Element* ptr2 = &(iter2->second);

  printf("ptr: %p, ptr2: %p\n", ptr, ptr2);

  //printf("Set test\n");
  //set<Element> v;

  vector<Element> v;
  v.push_back(Element(2));
  Element* vptr = &(v[0]);

  for (i = 0; i < 1000; ++i) {
    v.push_back(Element(i));
  }

  printf("Size in the beginning: %d\n", (int)v.size());
  v.erase(v.begin() + 350, v.begin() + 650);
  printf("Size now: %d\n", (int)v.size());

  Element* vptr2 = &(v[0]);
  printf("vptr: %p, vptr2: %p\n", vptr, vptr2);
  return 0;
}

