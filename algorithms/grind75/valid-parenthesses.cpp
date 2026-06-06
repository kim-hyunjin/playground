#include <string>
#include <iostream>

using namespace std;

// 내 솔루션
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.size() == 0) return false;
                if (c == ')') {
                    if (st.top() == '(') {
                        st.pop();
                    } else {
                        return false;
                    }
                } else if (c == ']') {
                    if (st.top() == '[') {
                        st.pop();
                    } else {
                        return false;
                    }
                } else if (c=='}') {
                    if (st.top() == '{') {
                        st.pop();
                    } else {
                        return false;
                    }
                }
            }
        }
        return st.size() == 0;
    }
};

// 다른 사람 더 보기 좋은 솔루션

class Solution2 {
public:
    bool isValid(std::string s) {
        std::stack<char> stack;
        std::unordered_map<char, char> map {
            {')', '('},
            {'}', '{'},
            {']', '['}
        };

        for (char c : s) {
            if (map.count(c) == 0) {
                // It's an opening bracket
                stack.push(c);
            } else {
                // It's a closing bracket
                if (stack.empty() || stack.top() != map[c]) {
                    return false; // Mismatched or extra closing bracket
                }
                stack.pop(); // Valid match found
            }
        }

        return stack.empty(); // Return true if all opening brackets are matched
    }
};

int main() {
    Solution sol;
    string s = "()";
    bool result = sol.isValid(s);
    cout << result << endl;
    return 0;
}