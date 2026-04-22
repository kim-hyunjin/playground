#include <iostream>
using namespace std;
/**
 * You are a product manager and currently leading a team to develop a new
product. Unfortunately, the latest version of your product fails the quality
check. Since each version is developed based on the previous version, all the
versions after a bad version are also bad.

Suppose you have n versions [1, 2, ..., n] and you want to find out the first
bad one, which causes all the following ones to be bad.

You are given an API bool isBadVersion(version) which returns whether version is
bad. Implement a function to find the first bad version. You should minimize the
number of calls to the API.
 */

// The API isBadVersion is defined for you.
bool isBadVersion(int version) { return version == 4; };

// 다른 사람 풀이
class Solution {
public:
  int firstBadVersion(int n) {

    int start = 0;
    int end = n;

    while (end - start > 1) {
      int mid = start + (end - start) / 2;
      if (isBadVersion(mid)) {
        end = mid;
      } else {
        start = mid;
      }
    }

    return end;
  }
};

class Solution2 {
public:
  int firstBadVersion(int n) {
    int st = 1, end = n;
    while (st <= end) {
      int mid = st + (end - st) / 2;
      if (isBadVersion(mid) == false)
        st = mid + 1;
      else
        end = mid - 1;
    }
    return st;
  }
};

int main() {
  int n = 5;
  Solution2 s;
  int output = s.firstBadVersion(n);
  cout << output << endl;
}