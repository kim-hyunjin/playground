#include <unordered_map>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int longestPalindrome(string s) {
        // 단어의 개수를 세둡니다.
        // 양쪽으로 단어가 똑같아야하니까 단어를 두개씩 사용
        // 가운데에 단어 하나만 놓거나 없어도 됨
        unordered_map<char, int> map;
        for (char c : s) {
            map[c]++;
        }

        int length = 0;
        bool hasSingle = false;

        for (auto m : map) {
            int pair = m.second / 2;
            length += pair * 2;
            if (m.second % 2 == 1) {
                hasSingle = true;
            }
            if (m.second == 1) {
                hasSingle = true;
            }
        }

        if (hasSingle) {
            return length + 1;
        } else {
            return length;
        }
    }
};

class Solution2 {
public:
    int longestPalindrome(string s) {
        int oddCount = 0;
        unordered_map<char, int> ump;
        for(char ch : s) {
            ump[ch]++;
            if (ump[ch] % 2 == 1)
                oddCount++;
            else    
                oddCount--;
        }
        if (oddCount > 1)
            return s.length() - oddCount + 1;
        return s.length();
    }
};

class Solution2 {
public:
    int longestPalindrome(const std::string& s) {
        // Initialize a set to keep track of characters with odd frequencies
        std::unordered_set<char> charSet;
        // Initialize the length of the longest palindrome
        int length = 0;
        
        // Iterate over each character in the string
        for (char c : s) {
            // If the character is already in the set, remove it and increase the length by 2
            if (charSet.find(c) != charSet.end()) {
                charSet.erase(c);
                length += 2;
            } else {
                // If the character is not in the set, add it to the set
                charSet.insert(c);
            }
        }
        
        // If there are any characters left in the set, add 1 to the length for the middle character
        if (!charSet.empty()) {
            length += 1;
        }
        
        // Return the total length of the longest palindrome
        return length;
    }
};
