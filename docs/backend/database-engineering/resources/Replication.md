# Replication


## Master/Backup Replication

- 하나의 **Master/Leader 노드**가 쓰기(writes)와 DDL을 처리
- 하나 이상의 **Backup/Standby 노드**가 마스터로부터 쓰기 내용을 수신
- 구현이 **간단**하고 **충돌(conflict)이 없음**

### 쓰기 (Write)

```
Client → [INSERT/UPDATE/CREATE] → Master(빨간색) → Backup1(초록색)
                                                  → Backup2(초록색)
```

- 모든 쓰기 작업은 Master 노드로만 전송됨
- Master가 Backup 노드들에게 변경사항을 전파

### 읽기 (Read)

```
Client1 → [SELECT] → Master → (또는) Backup 노드들
Client2 →                       → Backup1
Client3 →                       → Backup2
```

- 읽기 작업은 Master 또는 Backup 노드 어디서든 처리 가능

---

## Multi-Master Replication

- **여러 개의 Master/Leader 노드**가 쓰기(writes)와 DDL을 처리
- 하나 이상의 Backup/Follower 노드가 마스터들로부터 쓰기 내용을 수신
- **충돌 해결(conflict resolution)이 필요함**

---

## Synchronous vs Asynchronous Replication

### Synchronous Replication (동기 복제)

- 마스터에 대한 쓰기 트랜잭션이 **Backup/Standby 노드에 기록될 때까지 블로킹(차단)**됨
- 옵션: First 2, First 1 또는 Any (몇 개의 노드에 쓰기가 완료되어야 하는지)

### Asynchronous Replication (비동기 복제)

- 쓰기 트랜잭션이 **마스터에 기록되면 성공으로 간주**
- 이후 **비동기적으로** Backup 노드들에 쓰기가 적용됨

---

## Demo - Postgres 13 예시

1. Docker로 두 개의 Postgres 인스턴스 실행
2. 하나를 Master, 다른 하나를 Standby로 설정
3. Standby를 Master에 연결
4. Master가 Standby를 인식하도록 설정

---

## Pros (장점)

- **수평 확장 (Horizontal Scaling)** 가능
- **지역 기반 쿼리** - 지역별 DB 배치로 지연 시간 감소

## Cons (단점)

- **Eventual Consistency** (최종 일관성) - 비동기 복제 시 일시적 데이터 불일치
- **느린 쓰기** (동기 복제의 경우)
- **구현이 복잡** (특히 Multi-Master의 경우)
