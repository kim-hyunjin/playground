def solution(tapeSize, leakedPositions):
    leakedPositions.sort()
    
    before = leakedPositions[0]
    usedTape = 1
    covered = 1
    for i in range(1, len(leakedPositions)):
        diff = leakedPositions[i] - before
        if diff + covered <= tapeSize:
            covered += diff
        else:
            usedTape += 1
            covered = 1
        before = leakedPositions[i]


    return usedTape

def main():
    numOfLeaking, tapeSize = map(int, input().split())
    leakedPositions = list(map(int, input().split()))
    answer = solution(tapeSize, leakedPositions)
    print(answer)

# 강좌풀이
def solution2():
    numOfLeaking, tapeSize = map(int, input().split())

    pipe = [False] * 1001 # pipe의 최대 사이즈는 1000
    for i in map(int, input().split()):
        pipe[i] = True # 물이 새는 곳을 True로

    cur = 0
    answer = 0
    while cur < 1001:
        if pipe[cur]:
            ans += 1
            cur += tapeSize # tapeSize 만큼 점프
        else:
            cur += 1
    
    return answer

if __name__ == "__main__":
    main()