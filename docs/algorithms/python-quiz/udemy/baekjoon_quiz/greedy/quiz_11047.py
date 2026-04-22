import math
from posixpath import split

def solution(coins: list, target: int):
    remain = target
    numOfUsedCoin = 0
    while remain != 0:
        biggestCoin = coins.pop()
        numOfUsedCoin += math.floor(remain / biggestCoin)
        remain = remain % biggestCoin

    return numOfUsedCoin

def main():
    N, target = map(int, input().split())
    coins = []
    for _ in range(N):
        coins.append(int(input()))
    
    print(solution(coins, target))

# 강의 풀이
def solution2():
    N, K = map(int, input().split())
    coins = [int(input()) for _ in range(N)]
    coins.reverse()

    answer = 0
    for coin in coins:
        answer += K // coin # // 연산자 : 나누기 연산 후 소수점 이하는 버림
        K %= coin
    
    print(answer)

if __name__ == "__main__":
    # main()
    solution2()