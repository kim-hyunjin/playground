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

/**
 * 다른 사람 풀이
 * Max value of Height(leftSubtree)+Height(rightSubtree) (at any node ) is the diameter.
 * Keep track of maxium diameter duing traversal and find the height of the tree.
 */
class Solution
{
public:
    // 이진 트리의 지름을 계산하는 함수
    int diameterOfBinaryTree(TreeNode *root)
    {
        int maxDiameter = 0;
        calculateHeight(root, maxDiameter);
        return maxDiameter;
    }

    // 트리의 높이를 계산하면서 최대 지름을 갱신하는 재귀 함수
    int calculateHeight(TreeNode *node, int &maxDiameter)
    {
        if (node == nullptr)
            return 0;

        // 왼쪽, 오른쪽 서브트리의 높이 계산
        int leftHeight = calculateHeight(node->left, maxDiameter);
        int rightHeight = calculateHeight(node->right, maxDiameter);

        // 현재 노드를 지나는 경로의 길이로 최대 지름 갱신
        maxDiameter = max(maxDiameter, leftHeight + rightHeight);

        // 현재 노드를 포함한 서브트리의 높이 반환
        return max(leftHeight, rightHeight) + 1;
    }
};