#include <vector>
#include <unordered_map>
#include <unordered_set>
using namespace std;

class Solution
{
public:
    bool containsDuplicate(vector<int> &nums)
    {
        unordered_map<int, int> map;
        for (int num : nums)
        {
            if (map[num] >= 1)
            {
                return true;
            }
            map[num]++;
        }

        return false;
    }
};

// 다른 사람 풀이
// unordered_set을 사용하여 중복 여부 확인
class Solution2
{
public:
    bool containsDuplicate(vector<int> &nums)
    {
        unordered_set<int> seen;
        for (int num : nums)
        {
            if (seen.count(num) > 0)
                return true;
            seen.insert(num);
        }
        return false;
    }
};

class Solution3
{
public:
    bool containsDuplicate(vector<int> &nums)
    {
        unordered_set<int> numSet(nums.begin(), nums.end());
        return numSet.size() < nums.size();
    }
};