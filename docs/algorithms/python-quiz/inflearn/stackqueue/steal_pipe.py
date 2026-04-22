def solution(arrange):
    answer = 0
    stack = []
    for i in range(len(arrange)):
        if arrange[i] == '(':
            stack.append(arrange[i])
        else:
            stack.pop(-1)
            if (arrange[i - 1] == '('):
                answer += len(stack)
            else:
                answer += 1

    return answer

def test():
    given = "()(((()())(())()))(())"
    expect = 17
    actual = solution(given)
    if (expect == actual): print(True)
    else: print(False)

test()