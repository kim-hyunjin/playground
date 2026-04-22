/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

struct TreeNode {
  int val;
  TreeNode *left;
  TreeNode *right;
  TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// chat gpt 풀이
/**
 * 이 문제를 해결하기 위해서는 이진 탐색 트리(BST)의 특성을 활용할 수 있습니다.
BST에서는 각 노드의 왼쪽 서브트리에는 해당 노드보다 작은 값들이, 오른쪽
서브트리에는 해당 노드보다 큰 값들이 존재합니다. 이 특성을 이용하여 두 노드 p와
q의 LCA(최저 공통 조상)를 쉽게 찾을 수 있습니다.

알고리즘 설명

        1.	현재 노드를 root로 시작합니다.
        2.	p와 q가 모두 현재 노드보다 작으면, LCA는 왼쪽 서브트리에
있습니다. 따라서 왼쪽 서브트리로 이동합니다. 3.	p와 q가 모두 현재 노드보다 크면,
LCA는 오른쪽 서브트리에 있습니다. 따라서 오른쪽 서브트리로 이동합니다. 4.
그렇지 않다면, 현재 노드가 p와 q 사이에 있거나, p 또는 q 중 하나와 일치하므로
현재 노드가 LCA입니다.
 */
class Solution {
public:
  TreeNode *lowestCommonAncestor(TreeNode *root, TreeNode *p, TreeNode *q) {
    // LCA를 찾기 위해 현재 노드를 root로 시작
    while (root != nullptr) {
      // p와 q가 모두 현재 노드보다 작으면, 왼쪽 서브트리로 이동
      if (p->val < root->val && q->val < root->val) {
        root = root->left;
      }
      // p와 q가 모두 현재 노드보다 크면, 오른쪽 서브트리로 이동
      else if (p->val > root->val && q->val > root->val) {
        root = root->right;
      }
      // 그렇지 않다면 현재 노드가 LCA임
      else {
        return root;
      }
    }
    return nullptr; // 트리가 비어있다면 nullptr 반환
  }
};

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution2 {
public:
  TreeNode *lowestCommonAncestor(TreeNode *root, TreeNode *p, TreeNode *q) {
    if ((root->val > p->val) && (root->val > q->val)) {
      return lowestCommonAncestor(root->left, p, q);
    }
    if ((root->val < p->val) && (root->val < q->val)) {
      return lowestCommonAncestor(root->right, p, q);
    }
    return root;
  }
};