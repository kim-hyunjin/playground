from bisect import bisect_left, bisect_right

# 강좌 풀이
_ = int(input())
cards = sorted(list(map(int, input().split())))
_ = int(input())
targets = list(map(int, input().split()))

answer = []
for t in targets:
    l = bisect_left(cards, t)
    r = bisect_right(cards, t)
    answer.append(1 if r - l else 0)

print(*answer)
# print(answer, end=' ')
# print(' '.join(map(str, answer)))