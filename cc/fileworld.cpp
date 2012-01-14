// Sample solution for http://www dot ferozeh.com dot Interviews slash misc slah imo.aspx
// try2: Read each file at most two times, at most two files open at a time.
// W = max_number_of_words_in_file, W0 = num_words_in_first_file, O(W0lgWO + lgW0 + Sum|W|)
// lazyboybd -= at =- gmail -= dot =- com
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <vector>
#include <stdlib.h>
#include <algorithm>
using namespace std;

#define rep(i, n) for (i = 0; i < (n); ++i)
#define is_char(x) (((x)>='a'&&(x)<='z')||((x)>='A'&&(x)<='Z'))

char* file_input[] = {
  "I am a bat, man how do You do testing far",
  "I am a cat walk man, How do you test it",
  "I am a very smashing man how do you do foo bar"//,
  //""
};

char* get_word(char** p, int* len) {
  while(**p && !is_char(**p)) ++(*p);
  if (!**p) return NULL;
  char* ret = *p;
  *len = 0;
  while(**p && is_char(**p)) ++(*p), ++(*len);
  // we're modifying input
  //**p = 0;
  return ret;
}

bool strnieq(char* a, char* b, int alen, int blen) {
  if (alen == blen) {
    while(alen--) {
      if (tolower(*a) != tolower(*b)) return false;
      a++, b++;
    }
    return true;
  }
  return false;
}
void print_word(char*p, int len) {
  while(len--) putchar(*p++);
}

// join "foo", "bar", "baz" to "foo-bar-baz", also mallocs.
char* word_up(char* a, int alen, char* b, int blen, char* c, int clen) {
  int len = alen + blen + clen + 3;
  char *ret = (char*) malloc(sizeof(char) * len);
  while(alen--) *ret++ = *a++; *ret++ = '-';
  while(blen--) *ret++ = *b++; *ret++ = '-';
  while(clen--) *ret++ = *c++; *ret++ = 0;
  return ret - len;
}

typedef pair<char*, int> entry;
bool ptr_cmp(const entry& a, const entry& b) {
  return stricmp(a.first, b.first) < 0;
}
bool not_found(const entry& a) {
  // A is moving
  if (a.second == false) {
    free(a.first);
  }
  return !a.second;
}
vector<entry>::iterator is_in_list(vector<entry>& v, const entry& e, char* w, bool& ret) {
  vector<entry>::iterator eit = lower_bound(v.begin(), v.end(), e, ptr_cmp);
  ret = eit != v.end() && !stricmp(eit->first, w);
  return eit;
}

bool find_and_set_word_in_vector(vector<entry>& v, char* wj0, int lenj0, char* wj1, int lenj1, char* wj2, int lenj2) {
  char* t = word_up(wj0, lenj0, wj1, lenj1, wj2, lenj2);
  entry tentry = make_pair(t, false);
  bool is_found;
  vector<entry>::iterator e = is_in_list(v, tentry, t, is_found);
  if (is_found) {
    e->second = true; // set it to found.
  }
  return is_found;
}

int try2(int n) {
  int i, j, k;

  vector<entry> master_list;
  // open file0
  char* p0 = file_input[0];
  int len0, len1, len2;
  char* w00 = get_word(&p0, &len0);
  char* w01 = get_word(&p0, &len1);
  char* w02 = get_word(&p0, &len2);
  while (w02 != NULL) {
    char* t = word_up(w00, len0, w01, len1, w02, len2);
    master_list.push_back(make_pair(t, false));
    // advance reading word in file0
    w00 = w01, w01 = w02; len0 = len1, len1 = len2;
    w02 = get_word(&p0, &len2);
  }
  sort(master_list.begin(), master_list.end(), ptr_cmp);
  //rep(i, master_list.size()) puts(master_list[i].first);

  rep(j, n) if (j > 0) {
    rep(i, master_list.size()) master_list[i].second = false;
    // open and read file j
    char* pj = file_input[j];
    int lenj0, lenj1, lenj2;
    char* wj0 = get_word(&pj, &lenj0);
    char* wj1 = get_word(&pj, &lenj1);
    char* wj2 = get_word(&pj, &lenj2);
    while (wj2 != NULL) {
      find_and_set_word_in_vector(master_list, wj0, lenj0, wj1, lenj1, wj2, lenj2);

      // advance reading word in filej
      wj0 = wj1, wj1 = wj2; lenj0 = lenj1, lenj1 = lenj2;
      wj2 = get_word(&pj, &lenj2);
    }
    // close file j

    // Filter out not found entries.
    vector<entry>::iterator last = remove_if(master_list.begin(), master_list.end(), not_found);
    master_list.resize(last - master_list.begin());
    //printf("After pass %d\n", j);
    //rep(i, master_list.size()) printf("%d: %s\n", i, master_list[i].first);
  }

  // now read the files again to remove stuffs.
  rep(j, n) {
    // open filej (except file0, which is still open)
    char* pj = file_input[j];
    int lenj0, lenj1, lenj2;
    char* wj0 = get_word(&pj, &lenj0);
    char* wj1 = get_word(&pj, &lenj1);
    char* wj2 = get_word(&pj, &lenj2);
    bool print0 = true, print1 = true, print2 = true;
    printf("File %d\nOriginal: %s\nOutpooot: ", j, file_input[j]);
    bool fir = true;
    while (wj2 != NULL) {
      bool found = find_and_set_word_in_vector(master_list, wj0, lenj0, wj1, lenj1, wj2, lenj2);
      if (!found) {
        // maybe print wj0
        if (print0) { if (fir) fir = 0; else printf(" "); print_word(wj0, lenj0); }
        print0 = print1; print1 = print2; print2 = true;
      }
      else {
        // we found match, set next two words to be not printed as well.
        print0 = false; print1 = false; print2 = true;
      }

      // advance reading word in filej
      wj0 = wj1, wj1 = wj2; lenj0 = lenj1, lenj1 = lenj2;
      wj2 = get_word(&pj, &lenj2);
    }
    if (wj0 != NULL && print0) { if (fir) fir = 0; else printf(" "); print_word(wj0, lenj0); }
    if (wj1 != NULL && print1) { if (fir) fir = 0; else printf(" "); print_word(wj1, lenj1); }
    printf("\n");
  }

  // close file0

  // clean up stuffs.
  rep(i, master_list.size()) free(master_list[i].first); master_list.clear();
  return 0;
}

int try1_naive(int n) {
  int i, j, k;
  char* p0 = file_input[0];
  
  int len0, len1, len2;
  char* w00 = get_word(&p0, &len0);
  char* w01 = get_word(&p0, &len1);
  char* w02 = get_word(&p0, &len2);

  char* w[55][3];
  int len[55][3];
  while(w02 != NULL) {
    rep(j, n) if (j > 0) {
      char f = false;
      char *pj = file_input[j];
      w[j][0] = get_word(&pj, &len[j][0]), w[j][1] = get_word(&pj, &len[j][1]), w[j][2] = get_word(&pj, &len[j][2]);
      while(w[j][2] != NULL) {
        if (strnieq(w00, w[j][0], len0, len[j][0]) && strnieq(w01, w[j][1], len1, len[j][1]) && strnieq(w02, w[j][2], len2, len[j][2])) {
          f = true; break;
        }
        w[j][0] = w[j][1], w[j][1] = w[j][2], len[j][0] = len[j][1], len[j][1] = len[j][2];
        w[j][2] = get_word(&pj, &len[j][2]);
      }
      if (!f) break;
    }

    if (j >= n) {
      // found w00, w01, w02
      print_word(w00, len0), putchar(' ');
      print_word(w01, len1), putchar(' ');
      print_word(w02, len2); putchar('\n');
    }

    // advance reading word in file0
    w00 = w01, w01 = w02; len0 = len1, len1 = len2;
    w02 = get_word(&p0, &len2);
  }

  return 0;
}

int main() {
  int n = sizeof(file_input)/sizeof(file_input[0]);
  printf("Num files: %d\n", n);
  //try1_naive(n);
  try2(n);
  return 0;
}
