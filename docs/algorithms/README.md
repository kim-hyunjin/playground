# 알고리즘 문제 해결 전략: Grind 75와 함께하는 실전 패턴 분석

본 프로젝트는 프로그래밍 인터뷰의 표준이라 불리는 **Grind 75** 문제들을 중심으로, 데이터 구조와 알고리즘의 핵심 개념을 학습하고 다양한 언어(C++, Python, Go, JS)로 구현한 공간입니다.

단순히 정답을 맞히는 것이 아니라, **시간 및 공간 복잡도(Big-O)**를 최적화하는 사고방식을 기르는 데 집중하였습니다.

---

## 🛠 주요 문제 해결 패턴 (Problem Solving Patterns)

### 1. 해시 맵 (Hash Map) - 조회 성능 최적화
배열에서 특정 값을 찾을 때 $O(n)$이 걸리는 검색을 $O(1)$로 단축합니다.

*   **대표 문제:** `Two Sum`
*   **전략:** 보수(Complement) 값을 키로, 인덱스를 값으로 저장하여 한 번의 순회로 결과를 도출합니다.

```cpp
// algorithms/grind75/two-sum.cpp
map<int, int> numIndexMap;
for (int i = 0; i < nums.size(); i++) {
    int diff = target - nums[i]; // 타겟과의 차이 계산
    if (numIndexMap.find(diff) != numIndexMap.end()) {
        return {numIndexMap[diff], i}; // O(1) 시간 복잡도로 인덱스 조회
    }
    numIndexMap[nums[i]] = i;
}
```

### 2. 투 포인터 (Two Pointers) - 정렬된 데이터 처리
두 개의 인덱스 변수를 활용하여 배열이나 리스트를 효율적으로 탐색합니다.

*   **대표 문제:** `Valid Palindrome`, `Reverse Linked List`
*   **전략:** 양쪽 끝에서 시작하여 중앙으로 모이거나, 이전 노드와 현재 노드를 가리키며 전진합니다.

```cpp
// algorithms/grind75/reverse-linked-list.cpp
while (current != nullptr) {
    next = current->next; // 1. 다음 노드 임시 저장
    current->next = prev; // 2. 현재 노드의 방향 뒤집기
    prev = current;       // 3. 포인터 이동
    current = next;
}
```

### 3. 슬라이딩 윈도우 (Sliding Window) - 연속 구간 분석
고정되거나 가변적인 크기의 구간을 이동시키며 최적의 부분 구간을 찾습니다.

*   **대표 문제:** `Best Time to Buy and Sell Stock`
*   **전략:** 최소값을 갱신하며 현재 값과의 차이(이익)를 최대로 유지합니다.

### 4. 이진 탐색 (Binary Search) - 탐색 범위 절반씩 축소
정렬된 데이터에서 $O(\log n)$의 속도로 특정 값을 찾습니다.

*   **대표 문제:** `Binary Search`, `First Bad Version`
*   **전략:** `low`, `high`, `mid` 포인터를 사용하여 매 단계마다 탐색 범위를 절반으로 줄입니다.

### 5. 깊이/너비 우선 탐색 (DFS/BFS) - 그래프 및 트리 순회
연결된 모든 정점을 체계적으로 방문합니다.

*   **대표 문제:** `Flood Fill`, `Invert Binary Tree`
*   **전략:** 재귀(DFS) 또는 큐(BFS)를 사용하여 상태 공간을 탐색합니다.

---

## 📂 유형별 문제 리스트 (Grind 75)

| 유형 | 문제 목록 |
| :--- | :--- |
| **Array** | Two Sum, Best Time to Buy, Maximum Subarray, Majority Element |
| **String** | Valid Palindrome, Valid Anagram, Longest Palindrome |
| **Linked List** | Merge Sorted Lists, Reverse Linked List, Linked List Cycle |
| **Binary Tree** | Invert Binary Tree, Balanced Binary Tree, Lowest Common Ancestor |
| **Stack/Queue** | Valid Parentheses, Implement Queue using Stacks |

---

## 📈 학습 포인트
- **복잡도 분석:** 모든 문제 풀이 시 최선의 시간 복잡도($O(n \log n)$, $O(n)$ 등)를 목표로 함.
- **엣지 케이스 처리:** 빈 배열, 단일 노드 리스트, 중복 값 등 예외 상황 고려.
- **다양한 접근:** 반복문(Iterative)과 재귀(Recursive) 방식을 모두 구현하여 장단점 비교.

---
*본 저장소는 꾸준한 알고리즘 훈련을 통해 문제 해결 능력을 증명하는 기록입니다.*
