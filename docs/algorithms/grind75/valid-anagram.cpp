#include <iostream>
#include <map>
#include <string>

using namespace std;

/**
 * Given two strings s and t, return true if t is an anagram of s, and false
 * otherwise.
 */
class Solution {
public:
  bool isAnagram(string s, string t) {
    map<char, int> charMap = {};
    for (char c : s) {
      if (charMap.find(c) != charMap.end()) {
        charMap.at(c)++;
      } else {
        charMap[c] = charMap[c] + 1;
      }
    }

    for (char c : t) {
      if (charMap.find(c) == charMap.end()) {
        return false;
      } else {
        if (charMap.at(c) == 1) {
          charMap.erase(c);
        } else {
          charMap[c] = charMap[c] - 1;
        }
      }
    }
    bool result = charMap.size() == 0;
    return result;
  }
};

// 다른 사람 솔루션
class Solution2 {
public:
  bool isAnagram(string s, string t) {
    if (s.length() != t.length()) {
      return false;
    }

    unordered_map<char, int> counter;

    for (char ch : s) {
      counter[ch] = counter[ch] + 1;
    }

    for (char ch : t) {
      if (counter.find(ch) == counter.end() || counter[ch] == 0) {
        return false;
      }
      counter[ch] = counter[ch] - 1;
    }

    return true;
  }
};

class Solution3 {
public:
  bool isAnagram(string s, string t) {
    int count[26] = {0};

    // Count the frequency of characters in string s
    for (char x : s) {
      count[x - 'a']++;
    }

    // Decrement the frequency of characters in string t
    for (char x : t) {
      count[x - 'a']--;
    }

    // Check if any character has non-zero frequency
    for (int val : count) {
      if (val != 0) {
        return false;
      }
    }

    return true;
  }
};

int main() {
  string s = "anagram";
  string t = "nagaram";
  Solution solution;

  bool result = solution.isAnagram(s, t);

  cout << boolalpha << result << endl;

  return 0;
}