#include <iostream>
#include <vector>
#include <deque>
#include <map>
using namespace std;
/*
1. Two Sum
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

 

Example 1:

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
Example 2:

Input: nums = [3,2,4], target = 6
Output: [1,2]
Example 3:

Input: nums = [3,3], target = 6
Output: [0,1]
 

Constraints:

2 <= nums.length <= 104
-109 <= nums[i] <= 109
-109 <= target <= 109
Only one valid answer exists.
*/
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        map<int, int> numIndexMap;
        vector<int> result;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            auto iterator = numIndexMap.find(diff);
            bool found = iterator != numIndexMap.end();
            if (found) {
                result.push_back(iterator->second);
                result.push_back(i);
                return result;
            }
            numIndexMap[nums[i]] = i;
        }
        return result;
    }
};

// 더 빠른 솔루션
class Solution2 {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> hash;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (hash.find(diff) != hash.end()) {
                return {hash[diff], i};
            }
            hash[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution s;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = s.twoSum(nums, target);
    for (int i = 0; i < result.size(); i++) {
        cout << result[i] << " ";
    }
    cout << endl;
    return 0;
}
