#include <stack>

using namespace std;

struct ListNode {
      int val;
      ListNode *next;
      ListNode() : val(0), next(nullptr) {}
      ListNode(int x) : val(x), next(nullptr) {}
      ListNode(int x, ListNode *next) : val(x), next(next) {}
  };

// cursor 사용한 풀이
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* current = head;
        ListNode* next = nullptr;

        while (current != nullptr) {
            // 다음 노드 저장
            next = current->next;
            
            // 현재 노드의 next를 이전 노드로 변경
            current->next = prev;
            
            // prev와 current를 한 단계씩 전진
            prev = current;
            current = next;
        }

        // prev가 새로운 헤드가 됨
        return prev;
    }
};

// 재귀 사용한 풀이
class Solution2 {
public:
    ListNode* reverseList(ListNode* head) {
        // 기저 조건: 리스트가 비어있거나 노드가 하나만 있는 경우
        if(head == NULL || head->next == NULL) return head;
        
        // 재귀적으로 다음 노드부터 역순으로 만듦
        ListNode* h2 = reverseList(head->next);
        
        // 현재 노드의 다음 노드가 현재 노드를 가리키도록 함
        head->next->next = head;
        
        // 현재 노드의 next를 NULL로 설정 (마지막 노드가 될 예정)
        head->next = NULL;
        
        // 새로운 헤드 (원래 리스트의 마지막 노드)를 반환
        return h2;
    }
};

class Solution3 {
public:
    ListNode* reverseList(ListNode *head, ListNode *prevNode = NULL) {
        // head가 NULL이 아니면 재귀 호출, 그렇지 않으면 prevNode 반환
        return head ? 
            // 재귀적으로 다음 노드로 이동하면서 리스트를 뒤집음
            reverseList(
                head->next,  // 다음 노드로 이동
                (
                    head->next = prevNode,  // 현재 노드의 next를 이전 노드로 설정
                    head  // 현재 노드를 새로운 prevNode로 사용
                )
            ) 
            : prevNode;  // 마지막에 도달하면 새로운 헤드(이전의 마지막 노드)를 반환
    }
};
