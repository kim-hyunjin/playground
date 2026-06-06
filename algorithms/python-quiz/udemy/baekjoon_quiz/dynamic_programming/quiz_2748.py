N = int(input())

cache = [-1] * 91
cache[0] = 0
cache[1] = 1

# 피보나치 수열 문제 재귀로 풀이
def f(n):
    if cache[n] == -1:
        cache[n] = f(n - 1) + f(n - 2)

    return cache[n]

print(f(N))
