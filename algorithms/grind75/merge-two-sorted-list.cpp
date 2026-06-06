#include <forward_list>
#include <iostream>
#include <algorithm>

/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
 
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        std::forward_list<int> singleLinkedList {};
        ListNode* cur = list1;
        while (cur != nullptr) {
            singleLinkedList.push_front(cur->val);
            cur = cur->next;
        }

        cur = list2;
        while (cur != nullptr) {
            singleLinkedList.push_front(cur->val);
            cur = cur->next;
        };

        if (singleLinkedList.empty()) {
            return list1;
        }

        singleLinkedList.sort();

        ListNode* answer = new ListNode(singleLinkedList.front());
        singleLinkedList.pop_front();
        cur = answer;
        while (!singleLinkedList.empty()) {
            cur->next = new ListNode(singleLinkedList.front());
            cur = cur->next;
            singleLinkedList.pop_front();
        }
        
        return answer;
    }
};

// 다른사람 솔루션
class Solution2 {
public:
    // list1과 list2는 오름차순으로 정렬되어있음.
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // dummy 노드의 다음 노드는 우리가 리턴해야할 ListNode의 헤드를 가리키도록 한다. (리턴해야할 헤드노드를 항상 기억)
        ListNode* dummy = new ListNode(0);
        ListNode* cur = dummy;

        // 두 노드의 값을 비교해서 작은 값을 next에 할당.
        while (list1 && list2) {
            if (list1->val > list2->val) {
                cur->next = list2;
                list2 = list2->next;
            } else {
                cur->next = list1;
                list1 = list1->next;
            }
            cur = cur->next;
        }

        // 둘 중 하나라도 끝에 도달한 경우
        cur->next = list1 ? list1 : list2;

        return dummy->next;        
    }
};

// 재귀호출 방식
class Solution3 {
public:
    ListNode* mergeTwoLists(ListNode* result, ListNode* list2) {
        // 리스트 중 하나라도 null인 경우 다른 리스트를 리턴
        if (!result || !list2) {
            return result ? result : list2;
        }

        if (result->val > list2->val) {
            std::swap(result, list2); // 이 경우 결과로 리턴할 linked-list의 현재 가리키고 있는 자리에 list2의 노드를 사용.
        }

        /**
         * 현재 가리키고 있는 result노드를 그대로 사용했다면? 다음 result 노드와 list2 노드를 비교
         * 위에서 스왑을 했다면? list2의 현재노드를 사용. 다음노드(list2의 다음 노드)와 result의 현재 노드를 비교하게 됨
         */
        result->next = mergeTwoLists(result->next, list2);
        return result;        
    }
};

int main() {
    ListNode* list1 = new ListNode(1);
    list1->next = new ListNode(2);
    list1->next->next = new ListNode(4);
    ListNode* list2 = new ListNode(1);
    list2->next = new ListNode(3);
    list2->next->next = new ListNode(4);

    Solution Solution;

    auto result = Solution.mergeTwoLists(list1, list2);

    std::cout << "[";
    ListNode* cur = result;
    while (cur != nullptr) {
        std::cout << cur->val << ", ";
        cur = cur->next;
    }
    
    std::cout << "]" << std::endl;
    

    return 0;
}

