#include <vector>
#include <iostream>
#include <list>

using namespace std;

/**
 *  You are given an array prices where prices[i] is the price of a given stock on the ith day.

    You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

    Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.
 */
class Solution {
public:
    int maxProfit(vector<int>& prices) {
              
        
        /**
         * brute force
         * 첫날부터 마지막전날까지 차례로 buy하고 구매한 날 다음날부터 차례로 sell해서 그 차가 가장 큰 결과 리턴
         * => time limit
         */
        int answer = 0;
        for (int i = 0; i < prices.size() -1; i++) {
            int buy = prices.at(i);
            for (int j = i+1; j < prices.size(); j++) {
                int sell = prices.at(j);
                
                int profit = sell - buy;
                answer = profit > answer ? profit : answer;
            }
        }
        return answer;
    }
};

// 다른 사람 솔루션
class Solution2 {
public:
    int maxProfit(vector<int>& prices) {
        int buyPrice = prices[0];
        int profit = 0;

        for (int i = 1; i < prices.size(); i++) {
            if (buyPrice > prices[i]) {
                buyPrice = prices[i];
            }

            profit = max(profit, prices[i] - buyPrice);
        }

        return profit;        
    }
};

int main() {
    vector<int> prices = {7, 1, 5, 3, 6, 4};

    Solution2 s;

    int answer = s.maxProfit(prices);
    bool isCorrect = answer == 5;
    cout << boolalpha << isCorrect << endl;
}