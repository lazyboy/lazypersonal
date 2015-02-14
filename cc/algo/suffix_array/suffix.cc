#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cassert>
using namespace std;

#define rep(i, n) for (i = 0; i < (n); ++i)
typedef pair<int, int> PII;

struct S {
  S(const std::string& str) : str_(str) {
    len_ = str.size();
    int i;
    for (i = 0; i < 32 && (1<<i)<len_; ++i) ;
    assert(i != 32);
    B = i+1;
  }
  inline int val_at(int idx) {
    return idx == len_ ? 0 : (idx < len_ ? str_[idx] : -1);
    return idx < len_ ? str_[idx] : -1;
  }
  inline int pow_size() { return 1<<B; }
  inline int len() { return len_; }
  int B;
  std::string suffix_at(int idx) {
    if (idx >= len_) return "$";
    return str_.substr(idx) + "$";
  }
 private:
  std::string str_;
  int len_;
};

struct E {
  int idx;
  int c1, c2;
  E(int idx, int c1, int c2) : idx(idx), c1(c1), c2(c2) {}
  E() : idx(-1), c1(-1), c2(-1) {}
  bool eq(const E& other) {
    return c1 == other.c1 && c2 == other.c2;
  }
};

bool comp(const E& a, const E& b) {
  if (a.c1 != b.c1) return a.c1 < b.c1;
  return a.c2 < b.c2;
}

void build_suffix_array(const std::string& str) {
  int i, j, k;
  S s(str);
  int n = s.pow_size();
  vector<E> a; a.reserve(n);
  rep(i, n) a.push_back(E(i, s.val_at(i), -1));
  
  // k = 0;
  for (k = 1; k <= s.B; ++k) {
    const int two_k = 1<<k;
    const int prev_two_k = 1<<(k-1);

    vector<E> comp_values;
    for (j = 0; j < n; ++j) {
      if (j+prev_two_k < n) {
        comp_values.push_back(E(j, a[j].c1, a[j+prev_two_k].c1));
      } else {
        comp_values.push_back(E(j, a[j].c1, -1));
      }
    }
    sort(comp_values.begin(), comp_values.end(), comp);
    // shuffle back.
    printf("Set begin:");
    //rep(j, n) a[j].c1 = a[j].c2 = -1, a[j].idx = j;
    int ord = 0;
    rep(j, comp_values.size()) {
      if (j && !comp_values[j-1].eq(comp_values[j])) ++ord;
      printf(" %d", comp_values[j].idx);
      a[comp_values[j].idx] = E(comp_values[j].idx, ord, -1);
    }
    printf("\n");
  }

  //rep(i, s.len()+1) {
  //  printf("%d: [%d] %s\n", i, a[i].c1, str.substr(i).c_str());
  //}
  // Print.
  rep(i, n) {
    printf("rank %d: suffix: %s\n", a[i].c1, s.suffix_at(i).c_str());
  }
}

int main() {
  int i, j, k;
  build_suffix_array("banana");
  return 0;
}
