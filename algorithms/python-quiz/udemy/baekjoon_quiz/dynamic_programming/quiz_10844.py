MOD = 1_000_000_000

N = int(input())

# cache[n][d]: 길이가 n, 마지막 숫자가 d인 계단수 개수
cache = [[0] * 10 for _ in range(101)] # N은 1 ~ 100 사이 수로 들어옴

# 길이가 1인경우 채우기
for j in range(1, 10):
    cache[1][j] = 1 # 한자리, 1 ~ 9는 계단수가 각 1개만 가능

# 길이가 2~100인경우 채우기
for i in range(2, 101):
    for j in range(10):
        if j > 0:
            cache[i][j] += cache[i-1][j-1] # 1~9인 경우 다음에 올 수 있는 수는 자기보다 1작은 수
        if j < 9:
            cache[i][j] += cache[i-1][j+1] # 0~8인 경우 다음에 올 수 있는 수는 자기보다 1큰 수
        
        cache[i][j] %= MOD
        

answer = 0
for j in range(10):
    answer += cache[N][j]
    answer %= MOD

print(answer)


# 길이 n이고 마지막 숫자가 d인 계단수 총 개수 
# if 1 <= d <= 8: f(n, d) => f(n, d+1), f(n, d-1)
# if d == 0: f(n, d) => f(n, d+1)
# if d == 9: f(n, d) => f(n, d-1)
def f(n, d):
    pass

