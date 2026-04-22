#include <iostream>
#include <string>

using namespace std;

/**
 *  A phrase is a palindrome if, after converting all uppercase letters into
 lowercase letters and removing all non-alphanumeric characters, it reads the
 same forward and backward. Alphanumeric characters include letters and numbers.

    Given a string s, return true if it is a palindrome, or false otherwise.
 */
class Solution {
 public:
  bool isPalindrome(string s) {
    string onlyAlpha = "";
    for (char c : s) {
      if (isalpha(c) || isdigit(c)) {
        onlyAlpha += tolower(c);
      }
    }

    int j = onlyAlpha.size() - 1;
    for (int i = 0; i < j; i++) {
      char left = onlyAlpha[i];
      char right = onlyAlpha[j];
      if (left != right) return false;
      j--;
    }

    return true;
  }
};

// 아래는 다른 사람 솔루션

class Solution2 {
 public:
  bool isPalindrome(string s) {
    std::string t;
    for (const auto& a : s) {
      if (a >= 'A' && a <= 'Z') {
        t.push_back(a - 'A' + 'a');
      } else if (a >= 'a' && a <= 'z') {
        t.push_back(a);
      } else if (a >= '0' && a <= '9') {
        t.push_back(a);
      }
    }
    int len = t.size();
    for (int i = 0; i < len / 2; ++i) {
      if (t[i] != t[len - i - 1]) {
        return false;
      }
    }
    return true;
  }
};

class Solution3 {
 public:
  bool isPalindrome(string s) {
    int start = 0;
    int end = s.size() - 1;
    while (start <= end) {
      if (!isalnum(s[start])) {
        start++;
        continue;
      }
      if (!isalnum(s[end])) {
        end--;
        continue;
      }
      if (tolower(s[start]) != tolower(s[end]))
        return false;
      else {
        start++;
        end--;
      }
    }
    return true;
  }
};

class Solution4 {
 public:
  bool isPalindrome(string s) {
    int l = 0;
    int r = s.length() - 1;

    while (l < r) {
      while (l < r && !isalnum(s[l])) ++l;
      while (l < r && !isalnum(s[r])) --r;
      if (tolower(s[l]) != tolower(s[r])) return false;
      ++l;
      --r;
    }

    return true;
  }
};

int main() {
  string input = "A man, a plan, a canal: Panama";
  Solution s;
  bool result = s.isPalindrome(input);
  cout << boolalpha << result << endl;

  input = " ";
  result = s.isPalindrome(input);
  cout << boolalpha << result << endl;

  return 0;
}