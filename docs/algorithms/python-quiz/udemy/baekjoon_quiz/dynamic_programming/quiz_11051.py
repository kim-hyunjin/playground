import sys

sys.setrecursionlimit(10 ** 7)

MOD = 10007

N, K = map(int, input().split())
cache= [[0] * 1001 for _ in range(1001)]

# 자연수 N과 정수 K가 주어졌을 때 이항계수(N/K)를 10,007로 나눈 나머지 구하기
# 재귀 방식
def bino(n, k):
    if cache[n][k]:
        return cache[n][k]

    if k == 0 or k == n:
        cache[n][k] =  1
    else:
        cache[n][k] = bino(n-1, k-1) + bino(n - 1, k)
        cache[n][k] %= MOD
    
    return cache[n][k]

print(bino(N, K))

