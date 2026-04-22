adj = [[0] * 13 for _ in range(13)]
adj[0][1] = adj[0][7] = adj[1][2] = adj[1][5] = 1
# ...
# for row in adj:
#     print(row)

def dfs(now):
    for nxt in range(13):
        if adj[now][nxt]:
            dfs(nxt)
            print(now, nxt)

dfs(0)

