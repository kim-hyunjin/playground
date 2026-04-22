import sys

sys.setrecursionlimit(10 ** 6) # 기본적으로 재귀 제한이 1000개로 되어있어서 설정을 바꿔줘야 함
global graph, maxVertex, checked
           
def main():
    global maxVertex, checked

    maxVertex, numOfEdge = map(int, input().split())
    checked = [False for _ in range(maxVertex)]
    initGraph(numOfEdge)
    
    answer = 0
    for v in range(maxVertex):
        if not checked[v]:
            answer += 1
            checked[v] = True
            DFS(v)
    print(answer)

def initGraph(numOfEdge):
    global graph
    graph = [[0] * (maxVertex) for _ in range(maxVertex)]
    for _ in range(numOfEdge):
        v1, v2 = map(lambda x: x -1, map(int, sys.stdin.readline().split()))
        graph[v1][v2] = graph[v2][v1] = 1 # 양방향 그래프이므로

def DFS(cur: int) -> int:
    for next in range(maxVertex):
        if graph[cur][next] == 0 or checked[next]:
            continue
        
        checked[next] = True
        DFS(next)

if __name__ == "__main__":
    main()