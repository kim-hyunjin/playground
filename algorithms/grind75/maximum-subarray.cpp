#include <vector>
#include <algorithm>

using namespace std;

// https://leetcode.com/problems/maximum-subarray/solutions/1595195/c-python-7-simple-solutions-w-explanation-brute-force-dp-kadane-divide-conquer

// Brute Force - TLE
// 가능한 모든 subarray의 합을 계산하여 최대값 찾기
class Solution
{
public:
    int maxSubArray(vector<int> &nums)
    {
        int n = size(nums), ans = INT_MIN;
        for (int i = 0; i < n; i++)
            for (int j = i, curSum = 0; j < n; j++)
                curSum += nums[j],
                    ans = max(ans, curSum);
        return ans;
    }
};

// Recursive - TLE
// 가능한 모든 부분 배열을 재귀적으로 탐색하여 최대 합 찾기
class Solution2
{
public:
    int maxSubArray(vector<int> &nums)
    {
        return solve(nums, 0, false);
    }
    int solve(vector<int> &A, int i, bool mustPick)
    {
        // 배열의 끝에 도달했을 때 처리
        // 만약 mustPick이 거짓이라면, 유효한 경우가 아니므로 큰 음수 값(-1e5)을 반환
        if (i >= size(A))
            return mustPick ? 0 : -1e5;
        if (mustPick)
        {
            // 현재 요소를 반드시 선택해야 하는 경우
            // 선택을 멈출지 또는 현재 요소를 포함해 더 나아갈지를 결정
            return max(0, A[i] + solve(A, i + 1, true));
        }

        // 현재 요소를 선택하지 않을 수도 있는 경우
        // 두 가지 선택지를 비교:
        // 1. 현재 요소를 선택하지 않고 다음 요소로 진행
        // 2. 현재 요소를 선택하고 재귀적으로 진행
        return max(solve(A, i + 1, false), A[i] + solve(A, i + 1, true));
    }
};

// DP
// 재귀 함수에 메모이제이션을 추가하여 중복 계산 방지
class Solution3
{
public:
    int maxSubArray(vector<int> &nums)
    {
        vector<vector<int>> dp(2, vector<int>(size(nums), -1));
        return solve(nums, 0, false, dp);
    }
    int solve(vector<int> &A, int i, bool mustPick, vector<vector<int>> &dp)
    {
        if (i >= size(A))
            return mustPick ? 0 : -1e5;
        if (dp[mustPick][i] != -1)
            return dp[mustPick][i];
        if (mustPick)
            return dp[mustPick][i] = max(0, A[i] + solve(A, i + 1, true, dp));
        return dp[mustPick][i] = max(solve(A, i + 1, false, dp), A[i] + solve(A, i + 1, true, dp));
    }
};

// Tabulation
// 위 재귀 함수를 반복문으로 구현 (dp array를 사용한 bottom-up 방식)
class Solution4
{
public:
    int maxSubArray(vector<int> &nums)
    {
        vector<vector<int>> dp(2, vector<int>(size(nums)));
        dp[0][0] = dp[1][0] = nums[0];
        for (int i = 1; i < size(nums); i++)
        {
            // 인덱스 i에서 끝나는 최대 부분 배열 합입니다.
            // 이전 인덱스에서의 최대 부분 배열 합에 현재 숫자를 더하거나, 현재 숫자만 선택하는 두 가지 경우 중 최대값을 고릅니다.
            dp[1][i] = max(nums[i], nums[i] + dp[1][i - 1]);
            // 인덱스 i까지의 최대 부분 배열 합입니다.
            // 이전 인덱스까지의 최대 부분 배열 합과 현재 인덱스에서 끝나는 최대 부분 배열 합 중 더 큰 값을 고릅니다.
            dp[0][i] = max(dp[0][i - 1], dp[1][i]);
        }
        return dp[0].back();
    }
};

class Solution5
{
public:
    int maxSubArray(vector<int> &nums)
    {
        vector<int> dp(nums);
        for (int i = 1; i < size(nums); i++)
            dp[i] = max(nums[i], nums[i] + dp[i - 1]);
        return *max_element(begin(dp), end(dp));
    }
};

// Kadane's Algorithm
/**
 * 이전 접근 방식에서는 dp[i]가 오직 dp[i-1]에만 의존한다는 것을 알 수 있습니다.
 * 그렇다면, N개의 요소를 모두 저장하는 dp 배열을 유지할 필요가 있을까요?
 * 이전 해결책의 마지막 줄을 보면, 최대 합 부분 배열을 찾기 위해 dp 배열의 모든 요소를 필요로 한다고 생각할 수 있습니다.
 * 하지만, 각 반복 단계에서 최대값을 저장함으로써 이 과정을 최적화할 수 있습니다.
 */
class Solution6
{
public:
    int maxSubArray(vector<int> &nums)
    {
        int curMax = 0, maxTillNow = INT_MIN;
        for (auto c : nums)
        { /**
           * 각 요소 c를 반복하면서 curMax를 업데이트합니다.
           * curMax는 현재 숫자 c를 선택하거나(c),
           * 혹은 이전까지의 최대 합(curMax + c)에 현재 숫자를 추가하는 것 중 더 큰 값을 선택합니다.
           */
            curMax = max(c, curMax + c);
            // 각 반복에서 갱신된 curMax 값을 기준으로, 지금까지의 최대값 maxTillNow를 업데이트합니다.
            maxTillNow = max(maxTillNow, curMax);
        }

        return maxTillNow;
    }
};

// Divide and Conquer
/**
 *  문제를 분할 정복(Divide & Conquer) 전략을 사용하여 해결할 수 있습니다.
 *  이 방법은 문제에서 최대 부분 배열 합이 특정 구간에 존재하는 방식을 관찰하는 것에서 시작됩니다:

    1.	왼쪽 절반의 배열 내에 최대 부분 배열 합이 존재할 수 있습니다. (배열의 범위: [L, mid-1])
    2.	오른쪽 절반의 배열 내에 최대 부분 배열 합이 존재할 수 있습니다. (배열의 범위: [mid+1, R])
    3.	중앙 요소(mid)를 포함하고 왼쪽과 오른쪽 일부를 합친 배열에서 최대 부분 배열 합이 존재할 수 있습니다.
    이 경우, mid를 중심으로 하는 연속적인 부분 배열이어야 합니다. (배열의 범위: [L', R'] = [L', mid-1] + [mid] + [mid+1, R']이며, L' >= L이고 R' <= R)

이러한 관찰을 바탕으로, 배열을 재귀적으로 왼쪽과 오른쪽 절반으로 나누어 부분 문제를 해결한 후, 이를 결합하여 최대 부분 배열 합을 찾을 수 있습니다.
 */
class Solution7
{
public:
    int maxSubArray(vector<int> &nums)
    {
        return maxSubArray(nums, 0, size(nums) - 1);
    }
    int maxSubArray(vector<int> &A, int L, int R)
    {
        if (L > R)
            return INT_MIN;
        int mid = (L + R) / 2, leftSum = 0, rightSum = 0;
        // leftSum = max subarray sum in [L, mid-1] and starting from mid-1
        for (int i = mid - 1, curSum = 0; i >= L; i--)
        {
            curSum += A[i];
            leftSum = max(leftSum, curSum);
        }
        // rightSum = max subarray sum in [mid+1, R] and starting from mid+1
        for (int i = mid + 1, curSum = 0; i <= R; i++)
        {
            curSum += A[i];
            rightSum = max(rightSum, curSum);
        }
        // return max of 3 cases
        return max({maxSubArray(A, L, mid - 1), maxSubArray(A, mid + 1, R), leftSum + A[mid] + rightSum});
    }
};

// https://leetcode.com/problems/maximum-subarray/solutions/5378437/video-simple-solution/
class Solution8
{
public:
    int maxSubArray(vector<int> &nums)
    {
        int res = nums[0];
        int total = 0;

        for (int n : nums)
        {
            if (total < 0)
            {
                total = 0;
            }

            total += n;
            res = max(res, total);
        }

        return res;
    }
};