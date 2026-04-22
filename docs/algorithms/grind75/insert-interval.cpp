#include <vector>
#include <algorithm>

using namespace std;

// 다른 사람 풀이
class Solution
{
public:
    vector<vector<int>> insert(vector<vector<int>> &intervals, vector<int> &newInterval)
    {
        vector<vector<int>> result;

        for (size_t i = 0; i < intervals.size(); i++)
        {
            //  the new interval is after the range of other interval, so we can leave the current interval baecause the new one does not overlap with it
            if (intervals[i][1] < newInterval[0])
            {
                result.push_back(intervals[i]);
            }
            // the new interval's range is before the other, so we can add the new interval and update it to the current one
            else if (intervals[i][0] > newInterval[1])
            {
                result.push_back(newInterval);
                newInterval = intervals[i];
            }
            // the new interval is in the range of the other interval, we have an overlap, so we must choose the min for start and max for end of interval
            else if (intervals[i][1] >= newInterval[0] || intervals[i][0] <= newInterval[1])
            {
                newInterval[0] = min(intervals[i][0], newInterval[0]);
                newInterval[1] = max(newInterval[1], intervals[i][1]);
            }
        }

        result.push_back(newInterval);
        return result;
    }
};

// 다른 사람 풀이
class Solution2
{
public:
    vector<vector<int>> insert(vector<vector<int>> &intervals, vector<int> &newInterval)
    {
        int n = intervals.size(), i = 0;
        vector<vector<int>> res;
        // case 1: no overlapping case before the merge intervals
        // compare ending point of intervals to starting point of newInterval
        while (i < n && intervals[i][1] < newInterval[0])
        {
            res.push_back(intervals[i]);
            i++;
        }
        // case 2: overlapping case and merging of intervals
        while (i < n && newInterval[1] >= intervals[i][0])
        {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.push_back(newInterval);
        // case 3: no overlapping of intervals after newinterval being merged
        while (i < n)
        {
            res.push_back(intervals[i]);
            i++;
        }
        return res;
    }
};