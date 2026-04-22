#include <algorithm>

struct TreeNode {
  int val;
  TreeNode *left;
  TreeNode *right;
  TreeNode() : val(0), left(nullptr), right(nullptr) {}
  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
  TreeNode(int x, TreeNode *left, TreeNode *right)
      : val(x), left(left), right(right) {}
};

class Solution {
public:
  TreeNode *invertTree(TreeNode *root) {
    if (root == nullptr)
      return root;
    TreeNode *result =
        new TreeNode{root->val, root->right, root->left}; // swapped

    if (result->left != nullptr) {
      result->left = invertTree(result->left);
    }
    if (result->right != nullptr) {
      result->right = invertTree(result->right);
    }

    return result;
  }
};

// 다른 사람 풀이
class Solution2 {
public:
  TreeNode *invertTree(TreeNode *root) {
    if (root == nullptr) {
      return nullptr;
    }

    TreeNode *temp = root->left;
    root->left = root->right;
    root->right = temp;

    invertTree(root->left);
    invertTree(root->right);

    return root;
  }
};

int main() {
  TreeNode root{4, new TreeNode{2, new TreeNode{1}, new TreeNode{3}},
                new TreeNode{7, new TreeNode{6}, new TreeNode{9}}};

  Solution s;

  TreeNode *result = s.invertTree(&root);

  return 0;
}
