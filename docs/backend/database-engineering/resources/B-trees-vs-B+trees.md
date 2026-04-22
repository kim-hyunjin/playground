# B-Trees vs B+Trees


## 목차

1. [Full Table Scan](#full-table-scan)
2. [B-Tree](#b-tree)
3. [B-Tree의 한계](#b-tree의-한계)
4. [B+Tree](#btree)
5. [B+Tree & DBMS 고려사항](#btree--dbms-고려사항)
6. [B+Tree 스토리지 비용: MySQL vs Postgres](#btree-스토리지-비용-mysql-vs-postgres)
7. [Summary](#summary)

---

## Full Table Scan

- 큰 테이블에서 특정 행을 찾으려면 **Full Table Scan**을 수행해야 한다
- 큰 테이블을 읽는 것은 느리다
- 모든 페이지를 읽기 위해 많은 I/O가 필요하다
- **검색 공간(search space)을 줄일 방법이 필요하다**

### 예시

약 10억 행이 있는 테이블에서:

| ID | Name |
|----|------|
| 1 | John |
| 2 | Ali |
| 3 | Rick |
| 4 | Sara |
| 5 | Edmond |
| ... | ... |
| 591828734 | Chansy |
| 591828735 | Bird |
| 591828736 | Chip |
| ... | ... |
| 999991929 | Dorit |
| 999991930 | Sally |
| 999991931 | Kory |

- `ID = 5`를 찾는 것은 빠를 수 있지만, `ID = 591828738`이나 `ID = 999991931`을 찾으려면 거의 모든 행을 스캔해야 한다

---

## B-Tree

### 기본 개념

- **균형 잡힌(Balanced) 데이터 구조**로 빠른 탐색을 위해 설계됨
- B-Tree는 **노드(Node)** 로 구성됨
- 차수(degree) "m"인 B-Tree에서 일부 노드는 최대 **m개의 자식 노드**를 가질 수 있음
- 각 노드는 최대 **(m-1)개의 요소(element)** 를 가짐

### 노드 구조

- 각 요소는 **key**와 **value**를 가짐
- value는 보통 해당 행에 대한 **데이터 포인터(data pointer)**
- 데이터 포인터는 primary key 또는 tuple을 가리킬 수 있음
- 노드의 종류: **Root Node**, **Internal Node**, **Leaf Node**
- **1 노드 = 1 디스크 페이지**

### B-Tree가 검색을 돕는 방식

```
         [2:702 | 4:704]          ← Root Node
        /       |       \
  [1:701]   [3:703]   [5:705]    ← Leaf Nodes
```

- 각 요소는 `Key:Value` 형태 (예: `5:705`에서 5는 Key, 705는 TID)
- Value(TID)는 실제 테이블의 tuple id / page# / rowid를 가리킴

### 검색 예시

**Find ID 3:**
1. Root 노드 접근 → `2:702`, `4:704` 확인
2. 3은 2와 4 사이 → 가운데 자식으로 이동
3. `3:703` 발견 → TID 703으로 실제 행 접근

**Find ID 1:**
1. Root 노드 접근 → 1은 2보다 작음 → 왼쪽 자식으로 이동
2. `1:701` 발견 → TID 701로 실제 행 접근

### 더 많은 항목이 추가된 B-Tree (11개 항목)

```
              [4:704 | 8:802]              ← ROOT 노드
             /       |       \
      [2:702]    [6:800]    [10:804]       ← Internal 노드
       /   \      /   \       /    \
 [1:701][3:703][5:705][7:801][9:803][11:805] ← Leaf 노드
```

> 참고: B-Tree 시각화 도구 - https://www.cs.usfca.edu/~galles/visualization/BTree.html

---

## B-Tree의 한계

- **모든 노드의 요소가 key와 value를 모두 저장**한다
- Internal 노드가 더 많은 공간을 차지하므로 → **더 많은 I/O가 필요**하고 탐색이 느려질 수 있다
- **범위 쿼리(Range Query)가 느리다** - 랜덤 액세스 때문 (예: 1~5 사이의 모든 값 조회)
- Internal 노드를 메모리에 올리기 어렵다

### 범위 쿼리 예시: `ID BETWEEN 4 AND 9`

B-Tree에서는 4, 5, 6, 7, 8, 9를 찾기 위해 **트리를 여러 번 탐색**해야 한다:
- Root에서 4 발견, 8 발견
- 다시 내려가서 5, 6, 7 발견
- 다시 내려가서 9 발견
- 각 값을 찾을 때마다 Root부터 다시 탐색 → **비효율적**

→ **B+Tree가 이 두 가지 문제를 모두 해결한다**

---

## B+Tree

### 핵심 특징

- B-Tree와 거의 동일하지만, **Internal 노드에는 key만 저장**
- **Value는 Leaf 노드에만 저장**
- Internal 노드가 작아지므로 **더 많은 요소를 담을 수 있음**
- **Leaf 노드끼리 연결(linked)** 되어 있어, 한 key를 찾으면 앞뒤 값도 쉽게 찾을 수 있음
- **범위 쿼리에 매우 유리함**

### B+Tree 구조 (차수 3)

```
                    [5]                         ← Root (key만)
                   /   \
              [3]       [7 | 9]                 ← Internal (key만)
             /   \     /   |   \
           [2]  [4]  [6]  [8]  [10]             ← Internal (key만)
           / \  / \  / \  / \   / \
Leaf:  1→ 2→ 3→ 4→ 5→ 6→ 7→ 8→ 9→ 10→ 11      ← Leaf (key:value, 서로 연결됨)
       701 702 703 704 705 800 801 802 803 804 805
```

- Leaf 노드: `1:701 → 2:702 → 3:703 → ... → 11:805` (링크드 리스트로 연결)

### 범위 쿼리 예시: `ID BETWEEN 4 AND 9`

1. Root(5)에서 시작 → 4는 5보다 작으므로 왼쪽으로
2. Internal(3) → 4는 3보다 크므로 오른쪽 자식으로
3. Internal(4) → Leaf 노드에서 `4:704` 발견
4. **Leaf 노드의 링크를 따라가며** 5, 6, 7, 8, 9까지 순차적으로 접근
5. 트리를 다시 탐색할 필요 없이 **순차 접근으로 완료**

---

## B+Tree & DBMS 고려사항

- Leaf 포인터의 비용은 저렴하다 (cheap)
- **1 노드 = 1 DBMS 페이지** (대부분의 DBMS)
- Internal 노드는 key만 저장하므로 **메모리에 쉽게 올릴 수 있어** 빠른 탐색 가능
- Leaf 노드는 **힙(heap)의 데이터 파일에 존재**할 수 있음
- **대부분의 DBMS 시스템이 B+Tree를 사용**한다

### 스토리지 구조

```
┌─────────────────────────────────────────┐
│  Internal 노드 (key만)                    │  ← 메모리에 올려야 함
│  Root + Internal Nodes                   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Leaf 노드 (key + value)                  │  ← 디스크에 있어도 되지만
│  1:701 → 2:702 → 3:703 → ...            │     메모리에 있는 것이 좋음
└─────────────────────────────────────────┘
```

---

## B+Tree 스토리지 비용: MySQL vs Postgres

### Secondary Index의 Value가 가리키는 대상

| DBMS | Secondary Index Value가 가리키는 대상 |
|------|----------------------------------|
| **Postgres** | tuple을 직접 가리킴 (TID) |
| **MySQL (InnoDB)** | Primary Key를 가리킴 |

### 주요 차이점

- **MySQL (InnoDB)**: Primary Key 데이터 타입이 크면 (예: UUID) **모든 secondary index에서 bloat 발생** 가능
- **MySQL (InnoDB)**: Leaf 노드에 **전체 행(row) 데이터가 포함**됨 (IOT / Clustered Index이므로)
- **Postgres**: Secondary index가 tuple을 직접 가리키므로 primary key 크기의 영향을 덜 받음

---

## Summary

| 항목 | B-Tree | B+Tree |
|------|--------|--------|
| Internal 노드 저장 | key + value | **key만** |
| Leaf 노드 연결 | 연결 없음 | **링크드 리스트로 연결** |
| 범위 쿼리 | 느림 (랜덤 액세스) | **빠름 (순차 접근)** |
| Internal 노드 크기 | 큼 | **작음 (더 많은 key 저장 가능)** |
| 메모리 효율성 | 낮음 | **높음** |
| DBMS 채택 | 드묾 | **대부분의 DBMS가 사용** |
