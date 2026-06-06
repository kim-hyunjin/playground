# 강의 풀이
from collections import deque

dy = (0, 1, 0, -1)
dx = (1, 0, -1, 0)

N, M = map(int, input().split())
board = [input() for _ in range(N)]
chk = [[False] * M for _ in range(N)]


def is_valid_coord(y, x):
    return 0 <= y < N and 0 <= x < M and board[y][x] == '1' and not chk[y][x] # board[y][x] - 문자열에 인덱스로 한 글자 접근 가능

def bfs():
    dq = deque()
    dq.append((0, 0, 1))
    chk[0][0] = True

    while dq:
        y, x, dis = dq.popleft() # 튜플 비구조화 할당

        if y == N - 1 and x == M -1:
            return dis

        for k in range(4):
            ny = y + dy[k]
            nx = x + dx[k]
            if is_valid_coord(ny, nx):
                chk[ny][nx] = True
                dq.append((ny, nx, dis + 1)) # 거리를 함께 튜플에 넣기


print(bfs())