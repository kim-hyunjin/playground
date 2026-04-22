#include <algorithm>

using namespace std;

struct TreeNode {
  int val;
  TreeNode *left;
  TreeNode *right;
  TreeNode() : val(0), left(nullptr), right(nullptr) {}
  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  TreeNode(int x, TreeNode *left, TreeNode *right)
      : val(x), left(left), right(right) {}
};

// chat gpt 풀이
class Solution {
public:
  // Helper function to check the height of the tree
  int checkHeight(TreeNode *node) {
    if (node == nullptr) {
      return 0; // Null node has height 0
    }

    // Recursively get the height of left and right subtrees
    int leftHeight = checkHeight(node->left);
    if (leftHeight == -1)
      return -1; // If left subtree is unbalanced, propagate -1

    int rightHeight = checkHeight(node->right);
    if (rightHeight == -1)
      return -1; // If right subtree is unbalanced, propagate -1

    // If the current node is unbalanced, return -1
    if (abs(leftHeight - rightHeight) > 1) {
      return -1;
    }

    // Otherwise, return the height of the current node
    return max(leftHeight, rightHeight) + 1;
  }

  // Main function to check if the tree is height-balanced
  bool isBalanced(TreeNode *root) {
    // If checkHeight returns -1, the tree is unbalanced
    return checkHeight(root) != -1;
  }
};