from collections import deque

adj = [[0] * 13 for _ in range(13)]
adj[0][1] = adj[0][2] = adj[1][3] = adj[1][4] = 1
# ...
# for row in adj:
#     print(row)

def bfs(now):
    dq = deque()
    dq.append(0)
    while dq:
        now = dq.popleft()
        for next in range(13):
            if adj[now][next]:
                dq.append(next)
                print(now, next)

bfs(0)

