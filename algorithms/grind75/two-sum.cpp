#include <iostream>
#include <vector>
#include <deque>
#include <map>
using namespace std;

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