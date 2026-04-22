import heapq as hq

# 우선순위 큐 Priority Queue -> 이진 트리로 구현
# 파이썬에서는 heapq를 사용해서 구현. 기본적으로 min-heap으로 동작한다.
# Thread-Safe 한 PriorityQueue는 무겁기때문에 heapq를 사용해서 우선순위 큐를 구현한다.
pq = []
hq.heappush(pq, 6)
hq.heappush(pq, 12)
hq.heappush(pq, 0)
hq.heappush(pq, -5)
hq.heappush(pq, 8)

print(pq)

while pq:
    print(pq[0]) # 최상단 노드(최소값)
    hq.heappop(pq) # 최상단 노드 제거(최소값 제거)