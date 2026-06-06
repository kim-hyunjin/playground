#include <vector>
#include <unordered_map>

using namespace std;

class Solution
{
public:
    int majorityElement(vector<int> &nums)
    {
        unordered_map<int, int> map;

        for (int num : nums)
        {
            map[num]++;
        }

        for (auto el : map)
        {
            if (el.second > nums.size() / 2)
                return el.first;
        }

        return 0;
    }
};

// 다른 풀이 - Sorting
// 시간 복잡도 O(n log n)
class Solution2
{
public:
    int majorityElement(vector<int> &nums)
    {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        return nums[n / 2];
    }
};

// Moore Voting Algorithm
// 시간 복잡도 O(n)
class Solution3
{
public:
    int majorityElement(vector<int> &nums)
    {
        int count = 0;
        int candidate = 0;

        for (int num : nums)
        {
            if (count == 0)
            {
                candidate = num;
            }

            if (num == candidate)
            {
                count++;
            }
            else
            {
                count--;
            }
        }

        return candidate;
    }
};