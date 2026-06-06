#include <algorithm>

using namespace std;

struct TreeNode
{
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution
{
public:
    int maxDepth(TreeNode *root)
    {
        return calculateDepth(root);
    }

    int calculateDepth(TreeNode *root)
    {
        if (root == NULL)
            return 0;
        int left = calculateDepth(root->left);
        int right = calculateDepth(root->right);
        return max(left, right) + 1;
    }
};

// 다른 사람 풀이
class Solution2
{
public:
    int maxDepth(TreeNode *root)
    {
        return root == nullptr ? 0 : max(maxDepth(root->left), maxDepth(root->right)) + 1;
    }
};