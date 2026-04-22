from collections import deque
import sys

sys.setrecursionlimit(10 ** 6)

N, M = map(int, input().split())
maze = [[0 for _ in range(M)] for _ in range(N)]
dis = [[0 for _ in range(M)] for _ in range(N)]

dx = [0, 1, 0, -1]
dy = [1, 0, -1, 0]
target = [M-1, N-1]

for i in range(N):
    mazeRow = list(input())
    for j in range(M):
        maze[i][j] = int(mazeRow[j])

def is_valid(ny, nx):
    return 0 <= nx < M and 0 <= ny < N and maze[ny][nx] == 1

def BFS():
    dq = deque()
    dq.append([0, 0])
    maze[0][0] = 0
    dis[0][0] = 1

    while dq:
        x, y = dq.popleft()
        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]
            
            if is_valid(ny, nx):
                maze[ny][nx] = 0
                dq.append([nx, ny])
                dis[ny][nx] = dis[y][x] + 1
            
BFS()

print(dis[target[1]][target[0]])