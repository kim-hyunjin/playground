---
title: "알고리즘 핵심 개념 정리: 완전탐색부터 DP까지"
description: "완전탐색, 탐욕법, 그래프, DFS/BFS, 백트래킹, 이진탐색, DP 등 주요 알고리즘의 핵심 개념과 특징 요약"
date: 2026-04-24
category: "Algorithms"
categories:
  - Algorithms
tags:
  - Coding Test
  - CS
  - Data Structure
summary: "완전탐색, 탐욕법, 그래프, DFS/BFS, 백트래킹, 이진탐색, DP 등 주요 알고리즘의 핵심 개념과 특징 요약"
---

알고리즘 문제를 풀 때 반드시 숙지해야 할 핵심 개념들을 정리했습니다.

---

## 1. 완전탐색 (Brute-Force)

가장 기본적이면서도 강력한 방법입니다.

1. 모든 경우의 수를 다 살펴봐도 시간 초과가 나지 않을지 먼저 확인합니다.
2. 가능하다면 완전탐색으로 문제를 해결합니다.
3. 만약 시간 초과가 예상된다면 더 효율적인 알고리즘(Greedy, DP, Binary Search 등)을 고려해야 합니다.

### 예시 문제: 두 수의 합 (Two Sum)
정수 배열 `nums`와 목표값 `target`이 주어질 때, 합이 `target`이 되는 두 수의 인덱스를 찾습니다. 모든 인덱스 쌍 `(i, j)`을 이중 반복문으로 확인하는 것이 가장 단순한 완전탐색 풀이입니다.

```python
def two_sum_brute_force(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

print(two_sum_brute_force([2, 7, 11, 15], 9))  # [0, 1]
```

## 2. 탐욕법 (Greedy)

매 순간 최적이라고 생각되는 것을 선택하는 방식입니다.

1. 완전탐색이 가능한지 먼저 확인합니다.
2. Greedy 접근 시 **반례가 없을지** 신중하게 고려해야 합니다. 증명이 중요합니다.
3. 안될 것 같으면 다른 효율적인 알고리즘을 찾습니다.

### 예시 문제: 거스름돈 (Coin Change, 동전 종류가 배수 관계일 때)
동전 `[500, 100, 50, 10]`으로 손님에게 거슬러줘야 할 돈 `N`원을 최소 개수로 지불하는 문제입니다. 큰 단위 동전부터 최대한 많이 사용하는 탐욕적 선택이 최적해가 됩니다. (단, 동전 단위가 서로 배수 관계가 아니면 반례가 발생할 수 있어 DP로 풀어야 합니다.)

```python
def min_coin_count(n, coins=(500, 100, 50, 10)):
    count = 0
    for coin in coins:
        count += n // coin
        n %= coin
    return count

print(min_coin_count(1260))  # 6 (500*2 + 100*2 + 50*1 + 10*1)
```

## 3. 그래프 구현 (Graph Implementation)

- **인접 행렬 (Adjacency Matrix)**
    - 메모리 사용량이 많음 ($V^2$)
    - 조회 속도가 빠름 ($O(1)$)
- **인접 리스트 (Adjacency List)**
    - 메모리 사용량이 적음 ($V + E$)
    - 조회 속도가 상대적으로 느림 ($O(N)$)
    - 간선이 적은 희소 그래프(Sparse Graph)에서 유용합니다.

### 예시 코드: 두 가지 방식으로 그래프 표현하기
정점이 4개(0~3)이고 간선이 `(0,1), (0,2), (1,2), (2,3)`인 무방향 그래프를 각각의 방식으로 구현합니다.

```python
# 인접 행렬
n = 4
adj_matrix = [[0] * n for _ in range(n)]
edges = [(0, 1), (0, 2), (1, 2), (2, 3)]
for a, b in edges:
    adj_matrix[a][b] = 1
    adj_matrix[b][a] = 1

# 인접 리스트
adj_list = [[] for _ in range(n)]
for a, b in edges:
    adj_list[a].append(b)
    adj_list[b].append(a)

print(adj_matrix[0])  # [0, 1, 1, 0]
print(adj_list[0])    # [1, 2]
```

## 4. DFS & BFS

모든 노드를 탐색하므로 항상 답을 찾을 수 있다는 장점이 있습니다.

| 구분 | DFS (Depth First Search) | BFS (Breadth First Search) |
| :--- | :--- | :--- |
| **구현 방식** | 스택(Stack) 또는 재귀함수 | 큐(Queue) |
| **특징** | 깊이 우선 탐색 | 너비 우선 탐색 |
| **유리한 경우** | 모든 경로를 탐색해야 할 때 | 최단 거리 구하기 문제 |

### 예시 문제: 미로에서 최단 거리 구하기
`0`은 벽, `1`은 이동 가능한 칸으로 이루어진 격자에서 시작점 `(0, 0)`부터 도착점 `(N-1, M-1)`까지 최단 이동 칸 수를 구합니다. 가중치가 동일한 그래프의 최단 거리 문제이므로 BFS가 적합합니다.

```python
from collections import deque

def bfs_shortest_path(maze):
    n, m = len(maze), len(maze[0])
    visited = [[False] * m for _ in range(n)]
    queue = deque([(0, 0)])
    visited[0][0] = True
    dist = [[0] * m for _ in range(n)]
    dist[0][0] = 1

    while queue:
        x, y = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < m and not visited[nx][ny] and maze[nx][ny] == 1:
                visited[nx][ny] = True
                dist[nx][ny] = dist[x][y] + 1
                queue.append((nx, ny))

    return dist[n - 1][m - 1]

maze = [
    [1, 0, 1, 1],
    [1, 1, 1, 0],
    [0, 0, 1, 1],
]
print(bfs_shortest_path(maze))  # 6
```

## 5. 백트래킹 (Backtracking)

퇴각 검색이라고도 불리며, 모든 경우를 탐색하되 불필요한 경로를 사전에 차단합니다.

- 기본적으로 DFS/BFS와 유사하게 모든 경우를 탐색합니다.
- **가지치기 (Pruning)**를 통해 탐색 경우의 수를 줄이는 것이 핵심입니다.
- "가망이 없으면 더 이상 가지 않는다"는 전략으로 최악의 경우를 대비합니다.

### 예시 문제: N-Queen
`N x N` 체스판에 퀸 `N`개를 서로 공격하지 못하도록 배치하는 경우의 수를 구합니다. 한 행에 퀸을 하나씩 놓아가며, 이전에 놓은 퀸과 같은 열·대각선에 있으면 가지치기하여 더 이상 탐색하지 않습니다.

```python
def solve_n_queens(n):
    cols = set()
    diag1 = set()  # row - col
    diag2 = set()  # row + col
    count = 0

    def backtrack(row):
        nonlocal count
        if row == n:
            count += 1
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue  # 가지치기: 이미 공격 가능한 위치는 탐색하지 않음
            cols.add(col); diag1.add(row - col); diag2.add(row + col)
            backtrack(row + 1)
            cols.remove(col); diag1.remove(row - col); diag2.remove(row + col)

    backtrack(0)
    return count

print(solve_n_queens(4))  # 2
```

## 6. 이진 탐색 (Binary Search)

탐색 범위를 절반씩 줄여나가며 답을 찾는 효율적인 방식입니다.

- **전제 조건:** 탐색 전 데이터가 반드시 **정렬**되어 있어야 합니다.
- **파라메트릭 서치 (Parametric Search):**
    - **최적화 문제**를 **결정 문제**(YES/NO)로 바꾸어 이진 탐색으로 푸는 기법입니다.
    - 최솟값이나 최댓값을 구하는 문제에서 자주 활용됩니다.

### 예시 문제: 정렬된 배열에서 값 찾기 + 파라메트릭 서치
정렬된 배열에서 특정 값의 인덱스를 찾는 기본 이진 탐색과, "떡의 절단 높이 `H`를 최대로 할 때 요청한 길이 `M` 이상을 얻을 수 있는가?"처럼 최적화 문제를 결정 문제로 바꾸어 푸는 파라메트릭 서치를 함께 봅니다.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))  # 3

# 파라메트릭 서치: 떡볶이 떡 자르기 (절단 높이의 최댓값 구하기)
def max_cut_height(lengths, m):
    left, right = 0, max(lengths)
    answer = 0
    while left <= right:
        mid = (left + right) // 2  # 자를 높이(결정 문제의 파라미터)
        total = sum(length - mid for length in lengths if length > mid)
        if total >= m:  # 충분히 자를 수 있으면 높이를 더 높여본다
            answer = mid
            left = mid + 1
        else:
            right = mid - 1
    return answer

print(max_cut_height([19, 15, 10, 17], 6))  # 15
```

## 7. 동적 계획법 (Dynamic Programming)

문제를 작은 문제로 쪼개어 해결하고, 그 결과를 저장하여 더 큰 문제를 푸는 방식입니다.

### 구현 방식

1. **Top-down (Memoization)**
    - 재귀 함수를 사용하며, 필요한 부분 문제만 해결합니다. (Lazy-Evaluation)
    - **장점:** 직관적이며 코드 가독성이 좋습니다.
    - **단점:** 재귀 호출 오버헤드가 발생할 수 있습니다.
2. **Bottom-up (Tabulation)**
    - 반복문을 사용하며, 부분 문제의 답을 테이블에 미리 채워 나갑니다. (Eager-Evaluation)
    - **장점:** 시간과 메모리 효율이 상대적으로 좋을 수 있습니다.
    - **단점:** 테이블을 채워 나가는 올바른 순서를 알아야 합니다.

### 요약
- **핵심:** 메모이제이션(Memoization)과 점화식 정의
- 점화식을 찾고 테이블을 잘 정의하는 것이 문제 해결의 열쇠입니다.

### 예시 문제: 피보나치 수열
`f(n) = f(n-1) + f(n-2)` 점화식을 그대로 재귀로 구현하면 중복 계산이 기하급수적으로 늘어나 `f(n)`의 시간복잡도가 $O(2^N)$에 달합니다. Top-down과 Bottom-up 두 방식으로 개선한 코드를 비교합니다.

```python
# Top-down (Memoization)
def fib_memo(n, memo={}):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Bottom-up (Tabulation)
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print(fib_memo(30))  # 832040
print(fib_tab(30))   # 832040
```
