#include <iostream>
#include <vector>

using namespace std;
/**
 * Given an array of integers nums which is sorted in acending order, and an
integer target, write a function to search target in nums. If target exists,
then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.
 */
class Solution {
public:
  //   int search(vector<int> &nums, int target) {
  //     int center = nums.size() / 2;
  //     if (nums.at(center) == target) {
  //       return center;
  //     } else if (nums.at(center) < target) {
  //       // 앞 부분 vector 탐색
  //       vector<int> front = vector<int>(nums.begin(), nums.begin() + center);
  //       return search(front, target);
  //     } else {
  //       // 뒷 부분 vector 탐색
  //       vector<int> back = vector<int>(nums.begin() + center, nums.end());
  //       return search(back, target);
  //     }
  //   }
  int search(vector<int> &nums, int target) {
    return search(nums, target, 0, nums.size() - 1);
  }

  int search(vector<int> &nums, int target, int left, int right) {
    if (left > right) {
      return -1; // target이 없을 경우
    }

    int center = left + (right - left) / 2; // 중간 인덱스를 계산

    if (nums.at(center) == target) {
      return center;
    } else if (nums.at(center) < target) {
      // 오른쪽 부분 탐색
      return search(nums, target, center + 1, right);
    } else {
      // 왼쪽 부분 탐색
      return search(nums, target, left, center - 1);
    }
  }
};

class Solution2 {
public:
  int search(vector<int> &nums, int target) {
    int left = 0;
    int right = nums.size() - 1;

    while (left <= right) {
      int mid = left + (right - left) / 2;

      if (nums[mid] == target) {
        return mid;
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }
};

int main() {

  vector<int> nums = {-1, 0, 3, 5, 9, 12};
  int target = 9;

  Solution s;
  int index = s.search(nums, target);

  cout << index << endl;

  return 0;
}