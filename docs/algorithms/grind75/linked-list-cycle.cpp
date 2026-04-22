#include <unordered_set>

using namespace std;

struct ListNode {
  int val;
  ListNode *next;
  ListNode(int x) : val(x), next(nullptr) {}
};

/**
 * chat gpt 풀이
 * “Floyd’s Tortoise and Hare” 알고리즘을 사용하여 해결할 수 있습니다. 이
 * 알고리즘은 두 개의 포인터를 사용해 사이클을 감지하는 방식입니다. 하나의
 * 포인터는 한 번에 한 칸씩 움직이고, 다른 하나는 두 칸씩 움직입니다. 만약
 * 사이클이 존재한다면, 두 포인터는 결국 만나게 됩니다.
 */
class Solution {
public:
  bool hasCycle(ListNode *head) {
    if (head == nullptr || head->next == nullptr) {
      return false;
    }

    ListNode *slow = head;
    ListNode *fast = head;

    while (fast != nullptr && fast->next != nullptr) {
      slow = slow->next;       // 한 칸 이동
      fast = fast->next->next; // 두 칸 이동

      if (slow == fast) {
        return true; // 두 포인터가 만나면 사이클이 있음
      }
    }

    return false; // 사이클이 없음
  }
};

// 해시테이블을 사용하는 풀이
class Solution2 {
public:
  bool hasCycle(ListNode *head) {
    unordered_set<ListNode *> visited_nodes;
    ListNode *current_node = head;
    while (current_node != nullptr) {
      if (visited_nodes.find(current_node) != visited_nodes.end()) {
        return true;
      }
      visited_nodes.insert(current_node);
      current_node = current_node->next;
    }
    return false;
  }
};