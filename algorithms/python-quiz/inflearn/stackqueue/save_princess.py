from collections import deque

def solution(N, K):
    answer = 0
    q = deque()
    for i in range(1, N + 1):
        q.append(i)
    while len(q) != 0:
        for i in range(1, K):
            q.append(q.popleft())
        q.popleft() # K번째 왕자는 빠진다
        if (len(q) == 1): answer = q.popleft()

    return answer

def test():
    # given
    princeCnt = 8
    outCall = 3
    expect = 7

    # when
    actual = solution(princeCnt, outCall)
    print(actual)

    # then
    if(expect == actual): print(True)
    else: print(False)

test()