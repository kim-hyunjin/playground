/*
Given a string s, find the length of the longest substring without duplicate characters.

 

Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3. Note that "bca" and "cab" are also correct answers.
Example 2:

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
Example 3:

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
 

Constraints:

0 <= s.length <= 5 * 104
s consists of English letters, digits, symbols and spaces.

기본적으로 슬라이딩 윈도우 기법 사용. : right를 늘리며 윈도우를넓혀가다가 중복문자가 나오면 left 늘리기. 
자료구조는 set, hash, vector 등 다양한 해결법이 있으나, 성능상 vector가 가장 좋았다. 
*/
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> lastSeen(256, -1);
        int left = 0, ans = 0;

        for (int right = 0; right < s.size(); right++) {
            if (lastSeen[s[right]] >= left) {
                left = lastSeen[s[right]] + 1;
            }
            lastSeen[s[right]] = right;
            ans = max(ans, right - left + 1);
        }

        return ans;
    }
};

// 문자열을 set으로 유일하게 저장. 중복 문자가 나오면 left 증가. 
class Solution2 {
public:
    int lengthOfLongestSubstring(string s) {
        int left = 0;
        int maxLength = 0;
        unordered_set<char> charSet;

        for (int right = 0; right < s.length(); right++) {
            while (charSet.find(s[right]) != charSet.end()) {
                charSet.erase(s[left]);
                left++;
            }

            charSet.insert(s[right]);
            maxLength = max(maxLength, right - left + 1);
        }

        return maxLength;        
    }
};

// 윈도우 안에 있는 문자의 갯수를 기록. 문자의 갯수가 1일때까지 left이동.
class Solution3 {
public:
    int lengthOfLongestSubstring(string s) {
        int left = 0;
        int maxLength = 0;
        unordered_map<char, int> count;

        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            count[c] = count[c] + 1;
            
            while (count[c] > 1) {
                char leftChar = s[left];
                count[leftChar] = count[leftChar] - 1;
                left++;
            }
            
            maxLength = max(maxLength, right - left + 1);
        }
        
        return maxLength;        
    }
};

// 특정 문자가 등장한 인덱스를 기록. 이후 중복 문자가 나오면 left를 기록된 인덱스+1로 이동, 문자 등장 인덱스는 업데이트.
class Solution4 {
public:
    int lengthOfLongestSubstring(string s) {
        int maxLength = 0;
        int left = 0;
        unordered_map<char, int> lastSeen;

        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            if (lastSeen.find(c) != lastSeen.end() && lastSeen[c] >= left) {
                left = lastSeen[c] + 1;
            }
            maxLength = max(maxLength, right - left + 1);
            lastSeen[c] = right;
        }

        return maxLength;        
    }
};
