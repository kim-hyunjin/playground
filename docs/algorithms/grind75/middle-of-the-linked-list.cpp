#include <unordered_map>

using namespace std;

struct ListNode
{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution
{
public:
    ListNode *middleNode(ListNode *head)
    {
        unordered_map<int, ListNode *> map;

        int index = 0;
        ListNode *cur = head;
        while (cur != NULL)
        {
            map[++index] = cur;
            cur = cur->next;
        }
        int middle = index / 2 + 1;
        return map[middle];
    }
};

// 다른 사람 풀이
// pointer를 두개 사용해서 풀이
class Solution2
{
public:
    ListNode *middleNode(ListNode *head)
    {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next)
            slow = slow->next, fast = fast->next->next;
        return slow;
    }
};