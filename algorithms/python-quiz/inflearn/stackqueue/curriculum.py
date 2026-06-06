from collections import deque

def solution(essential, plan):
    q = deque()
    for e in essential:
        q.append(e)
    
    for p in plan:
        if q.__contains__(p):
            if q[0] == p:
                q.popleft()
            else:
                return False
    return len(q) == 0

def test1():
    essential = "CBA"
    plan = "CBDAGE"
    expect = True

    actual = solution(essential, plan)

    if (expect == actual): print(True)
    else: print(False)

def test2():
    essential = "AKDEF"
    plan = "AYKGDHEJ"
    expect = False

    actual = solution(essential, plan)

    if (expect == actual): print(True)
    else: print(False)

test1()
test2()