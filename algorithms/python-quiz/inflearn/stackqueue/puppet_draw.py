def solution(puppets, moves):
    answer = 0

    stack = []
    for pos in moves:
        for i in range(len(puppets)):
            if puppets[i][pos-1] != 0:
                p = puppets[i][pos-1]
                puppets[i][pos-1] = 0
                if (len(stack) != 0 and stack[-1] == p):
                    answer += 2
                    stack.pop(-1)
                else:
                    stack.append(p)
                break

    return answer

def test():
    puppets = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 3],
        [0, 2, 5, 0, 1],
        [4, 2, 4, 4, 2],
        [3, 5, 1, 3, 1]
    ]
    moves = [1, 5, 3, 5, 1, 2, 1, 4]
    expect = 4

    actual = solution(puppets, moves)

    if expect == actual:
        print(True)
    else:
        print(False)

test()
