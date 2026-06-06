MOD = 10_007

N = int(input())

cache = [0] * 1001
cache[1] = 1
cache[2] = 2
# 타일링 문제 - 직접 그려보면 패턴을 찾을 수 있을 듯(패턴 찾기 -> 점화식 만들기 -> dp로 풀기)
for i in range(3, 1001):
    cache[i] = cache[i-1] + cache[i-2]


print(cache[N] % MOD)