package com.github.kimhyunjin.leetcode;

/**
 * https://leetcode.com/problems/add-two-numbers/
 */
class AddTwoNumbers {
    public static class ListNode {
      int val;
      ListNode next;
      ListNode(int val) { this.val = val; }
      ListNode(int val, ListNode next) { this.val = val; this.next = next; }
  }

  /*
  * 두 linked list를 순회하며 덧셈 수행 (head가 가장 낮은 자리수임)
  * 덧셈의 결과로 나온 올림수를 다음 순회의 덧셈에서 활용
  * 덧셈 결과를 정답 노드의 next로 계속해서 추가
  * */
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode answer = new ListNode(0);
        ListNode p = l1, q = l2, cur = answer;
        int carry = 0;
        while (p != null || q != null) {
            int x = (p != null) ? p.val : 0;
            int y = (q != null) ? q.val : 0;
            int sum = x + y + carry;
            carry = sum / 10;
            cur.next = new ListNode(sum % 10);
            cur = cur.next;
            if (p != null) p = p.next;
            if (q != null) q = q.next;
        }
        if (carry > 0) {
            cur.next = new ListNode(carry);
        }

        return answer.next;
    }

    public static void main(String[] args) {
        AddTwoNumbers solution = new AddTwoNumbers();
        ListNode l1 = new AddTwoNumbers.ListNode(2);
        l1.next = new AddTwoNumbers.ListNode(4);
        l1.next.next = new AddTwoNumbers.ListNode(3);

        ListNode l2 = new AddTwoNumbers.ListNode(5);
        l2.next = new AddTwoNumbers.ListNode(6);
        l2.next.next = new AddTwoNumbers.ListNode(4);
        ListNode answer = solution.addTwoNumbers(l1, l2);
        System.out.print("[");
        System.out.print(answer.val + ", ");
        ListNode cur = answer.next;
        while (cur != null) {
            System.out.print(cur.val + ", ");
            cur = cur.next;
        }
        System.out.print("]");
    }
}