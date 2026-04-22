N = int(input())
requestBudget = sorted(list(map(int, input().split())))
maxBudget = int(input())

low = 0
high = max(requestBudget)
mid = (low + high) // 2 # 나누기 이후 소수점을 버리는 연산자
answer = 0

# 파라메틱 서치 - 최소, 최대값 등을 구하는 문제를 결정 문제(True, False)로 바꿔 풀기
def is_possible(mid):
    sum = 0
    
    for r in requestBudget:
        sum += min(r, mid)
    
    return sum <= maxBudget


while low <= high:
    if is_possible(mid):
        low = mid + 1
        answer = mid
    else:
        high = mid - 1

    mid = (low + high) // 2

print(answer)