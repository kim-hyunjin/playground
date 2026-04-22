def solution(ps):
    if len(ps) < 2: return "NO"
    stack = []

    for bracket in ps:
        if (bracket == "("):
            stack.append(bracket)
        else:
            if (len(stack) == 0): return "NO"
            stack.pop()

    if len(stack) > 0: return "NO"

    return "YES"

def main():
    numOfPS = int(input())
    PSList = []
    for _ in range(numOfPS):
        PSList.append(input())

    for ps in PSList:
        print(solution(ps))


# 강의 풀이
def solution2():
    for _ in range(int(input())):
        stack = []
        isVPS = True
        for ch in input(): # input으로 받은 문자열을 이렇게 바로 순회할 수 있다. 
            if ch == '(':
                stack.append(ch)
            else:
                if stack: # 리스트의 길이가 0보다 큰지 이렇게 체크할 수 있다.
                    stack.pop()
                else:
                    isVPS = False
                    break

        if stack:
            isVPS = False

        print('YES' if isVPS else 'NO') # 어떤 값을 출력할지 이렇게 조건문을 사용할 수 있다.



if __name__ == "__main__":
    main()
    # solution2()