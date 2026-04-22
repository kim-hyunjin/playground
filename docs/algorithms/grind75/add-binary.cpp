#include <string>
#include <algorithm>

using namespace std;

// 다른 사람 풀이
class Solution
{
public:
    string addBinary(string a, string b)
    {
        string res;
        int i = a.length() - 1;
        int j = b.length() - 1;
        int carry = 0;
        while (i >= 0 || j >= 0)
        {
            int sum = carry;
            if (i >= 0)
                sum += a[i--] - '0';
            if (j >= 0)
                sum += b[j--] - '0';
            carry = sum > 1 ? 1 : 0;
            res += to_string(sum % 2);
        }
        if (carry)
            res += to_string(carry);
        reverse(res.begin(), res.end());
        return res;
    }
};

/**
 * 각 이진수의 오른쪽 끝에서 시작하여 자릿수와 올림값을 더하고 그 결과를 새로운 문자열에 저장합니다.
그 다음 왼쪽으로 한 자리씩 이동하며 두 이진수의 모든 자릿수를 처리할 때까지 이 과정을 반복합니다.
모든 자릿수를 더한 후에도 올림값이 남아있다면, 이를 새로운 문자열의 끝에 추가합니다.
마지막으로, 이 새로운 문자열을 뒤집어 두 이진수의 합으로 반환합니다.
 */
class Solution2
{
public:
    string addBinary(string a, string b)
    {
        string ans;
        int carry = 0;
        int i = a.length() - 1;
        int j = b.length() - 1;

        while (i >= 0 || j >= 0 || carry)
        {
            if (i >= 0)
                carry += a[i--] - '0'; // '0'을 빼는 이유: 문자를 정수로 변환
                                       // 예: '1' - '0' = 1, '0' - '0' = 0
            if (j >= 0)
                carry += b[j--] - '0'; // 위와 동일한 이유로 '0'을 뺌
            ans += carry % 2 + '0';    // '0'을 더하는 이유: 정수를 문자로 변환
                                       // 예: 1 + '0' = '1', 0 + '0' = '0'
            carry /= 2;
        }

        reverse(begin(ans), end(ans));
        return ans;
    }
};