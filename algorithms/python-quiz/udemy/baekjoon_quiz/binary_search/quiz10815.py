from bisect import bisect_left, bisect_right

N = map(int, input())
myCard = sorted(list(map(int, input().split())))

M = map(int, input())
targetCard = list(map(int, input().split()))
answer = [0 for _ in range(len(targetCard))]

def isInMyCard(number):
    foundIndex = bisect_left(myCard, number)
    return 0 <= foundIndex < len(myCard) and myCard[foundIndex] == number

for i in range(len(targetCard)):
    if isInMyCard(targetCard[i]):
        answer[i] = 1

for n in answer:
    print(n, end=' ')