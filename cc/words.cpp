// Sample solution for "Find Strings (25 points)" problem.
// lazyboybd -=at=- gmail -=dot-= com
// Jan 14, 2012
#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <string>
#include <vector>
#include <assert.h>

using namespace std;

#define MAXWSZ 2001
#define MAXW 50

#define rep(i, n) for (i = 0; i < (n); ++i)
#define reptree(p, node) for (p = node->first_child; p != NULL; p = p->next_sibling)


struct Node {
  struct Node* next_sibling;
  struct Node* first_child;
  int kount;
  char c;
  bool terminating; // Not necessary, every node except root is terminating.
};

Node* create_node(Node* next_sibling, char c) {
  Node* ret = (Node*)malloc(sizeof(Node));
  ret->next_sibling = next_sibling; ret->c = c; ret->first_child = NULL;
  return ret;
}

void add_node(Node* node, char* w, bool allterm=false) {
  if (*w == '\0') { node->terminating = true; return; }

  if (allterm) {
    node->terminating = true;
  }
  Node* a = node->first_child;
  Node* path = NULL;
  if (a == NULL || a->c > *w) { // insert as first child
    node->first_child = create_node(a, *w);
    path = node->first_child;
  } else { // insert between a and b
    Node* b = a->next_sibling;
    while(b != NULL && b->c <= *w) { a = b; b = b->next_sibling; }
    if (a->c == *w) { path = a; }
    else {
      Node* mid = create_node(b, *w);
      a->next_sibling = mid;
      path = mid;
    }
  }
  assert(path != NULL);
  add_node(path, w+1);
}

int g_count(Node* node) {
  int total = node->terminating ? 1 : 0;
  Node* p; reptree(p, node) {
    total += g_count(p);
  }
  return node->kount = total;
}

char mstk[MAXWSZ]; // stack
void print_idx(Node* node, int idx /* 0 based */, int d) {
  if (!idx && node->terminating) {
    mstk[d] = 0;
    puts(mstk); // result
    return;
  }
  int cum_sum = node->terminating ? 1 : 0;
  Node* p; reptree(p, node) {
    cum_sum += p->kount;
    if (cum_sum > idx) {
      mstk[d] = p->c;
      print_idx(p, idx - (cum_sum - p->kount), d+1);
      return;
    }
  }
  puts("NOT FOUND");
}

void print_tree(Node* node, int d) {
  if (node->c != '?') {
    mstk[d] = node->c;
  }
  if (node->terminating) {
    mstk[d+1]=0;
    puts(mstk);
  }
  Node* p; reptree(p, node) {
    print_tree(p, d+1);
  }
}

void destroy_tree(Node*);
void free_chain(Node* node) {
  if (node != NULL) {
    free_chain(node->next_sibling);
    destroy_tree(node);
  }
}
void destroy_tree(Node* node) {
  Node* p; reptree(p, node) {
    destroy_tree(p);
  }
  free_chain(node->first_child);
}

char *sample_input[] = {
"2",
"aab",
"aac",
"3",
"3",
"8",
"23"};

int main() {
  struct Node* tree = create_node(NULL, '?');

  char word[MAXWSZ];
  int num_words, i;
  char** inp = &sample_input[0];
  sscanf(*inp++, "%d", &num_words);
  rep(i, num_words) {
    sscanf(*inp++, "%s", word);
    printf("word %s\n", word);
    // add *all* substrings
    for (char* p = word; *p; ++p) add_node(tree, p, true);
  }
  // reset terminating bit for root
  tree->terminating = false;
  // calculate counts for each node.
  g_count(tree);

  //print_tree(tree, -1);

  int num_queries;
  sscanf(*inp++, "%d", &num_queries);
  rep(i, num_queries) {
    int idx;
    sscanf(*inp++, "%d", &idx);
    print_idx(tree, idx-1, 0);
  }

  destroy_tree(tree);
  return 0;
}
