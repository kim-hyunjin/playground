#include <unordered_map>
#include <vector>
using namespace std;

// 시간 초과
class Solution {
public:
    int ways;
    int climbStairs(int n) {
        goUp(1, n);
        goUp(2, n);
        return ways;
    }

    void goUp(int n, int max) {
        if (n == max) {
            ways++;
            return;
        } else if (n > max) {
            return;
        }
        goUp(n + 1, max);
        goUp(n + 2, max);
    }
};

// Fibonacci 처럼 재귀 - 마찬가지로 시간 초과
class Solution2 {
public:
    int climbStairs(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }
        return climbStairs(n-1) + climbStairs(n-2);
    }
};

// 메모이제이션
// n번째에 도달하는 방법의 수는 n-1번째에 도달하는 방법의 수 + n-2번째에 도달하는 방법의 수와 같다.
class Solution3 {
public:
    int climbStairs(int n, unordered_map<int, int>& memo) {
        if (n == 0 || n == 1) {
            return 1;
        }
        if (memo.find(n) == memo.end()) {
            memo[n] = climbStairs(n-1, memo) + climbStairs(n-2, memo);
        }
        return memo[n];
    }

    int climbStairs(int n) {
        unordered_map<int, int> memo;
        return climbStairs(n, memo);
    }
};

// 동적 프로그래밍 Tabulation
// 재귀대신 bottom-up 방식으로 풀이
class Solution4 {
public:
    int climbStairs(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }

        vector<int> dp(n+1);
        dp[0] = dp[1] = 1;
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        return dp[n];
    }
};

// 공간 최적화
class Solution5 {
public:
    int climbStairs(int n) {
        if (n == 0 || n == 1) {
            return 1;
        }
        int prev = 1, curr = 1;
        for (int i = 2; i <= n; i++) {
            int temp = curr;
            curr = prev + curr;
            prev = temp;
        }
        return curr;
    }
};