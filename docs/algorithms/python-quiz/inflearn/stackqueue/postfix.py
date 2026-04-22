def solution(str):
    strList = list(str)
    stack = []
    for s in strList:
        if(s.isdigit()):
            stack.append(int(s))
        else:
            a = stack.pop(-1)
            b = stack.pop(-1)
            if (s == '+'): stack.append(b + a)
            elif (s == '-'): stack.append(b - a)
            elif (s == '*'): stack.append(b * a)
            elif (s == '/'): stack.append(b / a)
    return stack[-1]

def test():
    given = "352+*9-"
    expect = 12
    actual = solution(given)
    if (expect == actual): print(True)
    else: print(False)

test()
        
