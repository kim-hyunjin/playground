#include <stack>

using namespace std;

class MyQueue {
private:
  stack<int> s1;
  stack<int> s2;

public:
  MyQueue() {}

  void push(int x) {
    while (!s1.empty()) {
      int popped = s1.top();
      s1.pop();
      s2.push(popped);
    }
    s1.push(x);
    while (!s2.empty()) {
      int popped = s2.top();
      s2.pop();
      s1.push(popped);
    }
  }

  int pop() {
    int popped = s1.top();
    s1.pop();
    return popped;
  }

  int peek() {
    int popped = s1.top();
    return popped;
  }

  bool empty() { return s1.empty(); }
};

// 다른 솔루션
// 내 풀이는 push가 발생할때마다 s1 -> s2 -> s1 으로 모든 데이터를 두번
// 옮기지만, 이 풀이는 peek, pop이 발생할때 output 스택이 비어있는 경우에 input
// -> output 으로 모든 데이터를 한번 옮기므로 훨씬 나은 풀이임
class Queue {
  stack<int> input, output;

public:
  void push(int x) { input.push(x); }

  void pop(void) {
    peek();
    output.pop();
  }

  int peek(void) {
    if (output.empty())
      while (input.size())
        output.push(input.top()), input.pop();
    return output.top();
  }

  bool empty(void) { return input.empty() && output.empty(); }
};