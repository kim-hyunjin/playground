MOD = 10007

N, K = map(int, input().split())
cache= [[0] * 1001 for _ in range(1001)]

# 자연수 N과 정수 K가 주어졌을 때 이항계수(N/K)를 10,007로 나눈 나머지 구하기
# 반복문 방식
for i in range(1001):
    cache[i][0] = cache[i][i] = 1
    for j in range(1, i-1):
        cache[i][j] = cache[i-1][j-1] + cache[i-1][j]

print(cache[N][K] % MOD)

