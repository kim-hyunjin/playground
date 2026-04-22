# ACID 트랜잭션 정리

## 목차
- 1. ACID란?
- 2. Atomicity (원자성)
- 3. Consistency (일관성)
- 4. Isolation (격리성)
- 5. Durability (지속성)
- 6. 트랜잭션의 상태와 제어 (BEGIN, COMMIT, ROLLBACK, SAVEPOINT)
- 7. 격리 수준(Isolation Levels)과 동시성 현상
- 8. 동시성 제어 기법: 락킹, MVCC, 낙관적/비관적 제어
- 9. 로그와 복구: WAL, 체크포인트, 크래시 복구
- 10. 모범 사례와 실무 팁
- 11. ACID와 다른 개념 비교: CAP, BASE
- 12. 참고 SQL 예시

---

## 1. ACID란?
ACID는 데이터베이스 트랜잭션이 안전하게 수행되기 위한 네 가지 핵심 속성의 약자입니다.
- Atomicity: 트랜잭션은 전부 수행되거나(ALL) 전혀 수행되지 않아야 한다(NOTHING)
- Consistency: 트랜잭션 전후로 데이터는 모든 제약과 규칙을 만족하는 일관된 상태를 유지해야 한다
- Isolation: 동시에 실행되는 트랜잭션들이 서로에게 미치는 영향을 최소화하여 각 트랜잭션이 독립적으로 실행된 것처럼 보이게 한다
- Durability: 커밋된 결과는 시스템 장애가 발생하더라도 사라지지 않고 영속적으로 보존된다

ACID는 금융, 결제, 재고, 예약 등 정합성이 중요한 업무에서 필수적입니다.

## 2. Atomicity (원자성)
- 정의: 트랜잭션 내의 모든 작업이 하나의 단위로 취급되어 전부 성공하거나 실패 시 전부 취소(rollback)됩니다.
- 구현 포인트:
  - ROLLBACK을 통한 전체 작업 취소
  - 중간 저장점(SAVEPOINT)으로 부분 롤백 가능하지만, 최종적으로 트랜잭션의 커밋 여부가 전체 결과를 결정
- 예: 계좌 A→B 이체에서 A의 출금과 B의 입금이 둘 다 성공해야 하며 하나라도 실패하면 둘 다 취소

## 3. Consistency (일관성)
- 정의: 트랜잭션 수행 전후로 데이터는 스키마 제약(Primary/Foreign Key, Unique), 체크 제약, 트리거, 애플리케이션 규칙을 항상 만족해야 합니다.
- 핵심: DBMS는 제약을 통해 데이터의 무결성을 보장하며, 트랜잭션은 이러한 제약을 깨지 않도록 설계되어야 합니다.
- 예: 재고 수량이 음수가 되지 않도록 CHECK 제약을 두고, 트랜잭션에서 이를 준수

## 4. Isolation (격리성)
- 정의: 동시에 실행되는 트랜잭션 간의 상호 간섭을 통제하여 각 트랜잭션이 마치 단독으로 실행되는 것처럼 보이게 합니다.
- 목적: 더티 리드, 반복 불가능 읽기, 팬텀 리드 등의 이상 현상을 방지
- 성능/정합성 트레이드오프: 높은 격리는 정합성을 강화하지만 동시성/성능 비용이 큼

## 5. Durability (지속성)
- 정의: 트랜잭션이 커밋되면, 시스템 크래시나 전원 장애 후에도 결과가 유지됩니다.
- 구현 수단:
  - Write-Ahead Logging(WAL): 변경 내용을 데이터 파일에 쓰기 전 로그에 선기록
  - 체크포인트, 리두/언두 로그를 통한 복구
  - 스토리지 신뢰성(배터리 백업 캐시, SSD 플러시 보장, RAID), 백업/아카이빙

## 6. 트랜잭션의 상태와 제어
- BEGIN / START TRANSACTION: 트랜잭션 시작
- COMMIT: 모든 변경사항을 영구 반영
- ROLLBACK: 트랜잭션 전체 취소
- SAVEPOINT / ROLLBACK TO SAVEPOINT: 트랜잭션 내부의 중간 지점으로 부분 취소
- SET TRANSACTION ISOLATION LEVEL: 격리 수준 설정 (세션/트랜잭션 범위)

## 7. 격리 수준과 동시성 현상
동시성 이상 현상 정의:
- Dirty Read: 커밋되지 않은 데이터를 읽음
- Non-Repeatable Read: 같은 조건으로 같은 행을 두 번 읽을 때 값이 달라짐
- Phantom Read: 같은 조건으로 읽을 때 처음에는 없던(또는 있던) 행 집합의 변화가 발생

표준 격리 수준(낮→높):
1) Read Uncommitted
- 허용되는 현상: Dirty Read, Non-Repeatable Read, Phantom Read 가능
- 대부분의 RDBMS는 실제로 이 수준을 사용하지 않거나 Read Committed와 동일 처리

2) Read Committed
- 방지: Dirty Read
- 여전히 가능: Non-Repeatable Read, Phantom Read
- 예: 다른 트랜잭션이 커밋한 최신 데이터를 읽을 수 있음

3) Repeatable Read
- 방지: Dirty Read, Non-Repeatable Read
- 여전히 가능: Phantom Read(시스템에 따라 방지되기도 함; PostgreSQL은 MVCC로 팬텀까지 방지)

4) Serializable
- 가장 강력한 격리: 직렬 실행과 동등한 결과 보장
- 비용: 동시성 저하 가능, 충돌 시 재시도 필요



## 8. 동시성 제어 기법
- Locking(잠금)
  - 공유(S) 잠금: 읽기 공유
  - 배타(X) 잠금: 쓰기 배타
  - 의도 잠금, 행/페이지/테이블 락, 갭락/넥스트키락(InnoDB)
- MVCC (Multi-Version Concurrency Control)
  - 읽기는 스냅샷(버전)을 통해 잠금 없이 일관된 뷰 제공
  - 쓰기는 새로운 버전 생성, 커밋 시 가시성 전환
  - PostgreSQL, MySQL InnoDB 등에서 널리 사용
- 낙관적 vs 비관적 동시성 제어
  - 낙관적: 충돌이 드물다고 가정, 커밋 시점 검증/재시도
  - 비관적: 충돌이 잦다고 가정, 선잠금으로 충돌 방지

## 9. 로그와 복구
- WAL(Write-Ahead Logging)
  - 변경 전에 로그에 기록하여 크래시 후 재생 가능
- 체크포인트
  - 특정 시점까지의 변경 사항을 데이터 파일에 동기화해 복구 시간 단축
- 리두/언두
  - 리두: 커밋되었지만 아직 반영되지 않은 변경을 재적용
  - 언두: 커밋되지 않은 변경을 되돌림

## 10. 모범 사례와 실무 팁
- 트랜잭션은 짧게 유지: 잠금 경합과 데드락을 줄임
- 일관된 작업 순서 채택: 데드락 가능성 감소
- 필요한 최소 격리 수준 사용: 성능-정합성 균형
- 재시도 로직: Serializable/낙관적 제어에서 충돌 시 재시도
- 명시적 타임아웃 설정: 무한 대기 방지
- 적합한 인덱스 설계: 락 범위 축소, 팬텀 방지에 도움
- 모니터링: 락 대기, 데드락, 장시간 트랜잭션 추적
- 백업/아카이브/복구 테스트 정례화

## 11. ACID와 다른 개념 비교
- CAP 정리(분산 시스템): 일관성(Consistency), 가용성(Availability), 파티션 허용성(Partition tolerance) 간 트레이드오프에 관한 이론. 단일 노드/고전 RDB의 ACID와 맥락이 다름.
- BASE(점진적 일관성): 분산 NoSQL에서 최종 일관성(Eventual Consistency)을 강조. ACID의 강한 일관성과 비교됨.

## 12. 참고 SQL 예시
```sql
-- PostgreSQL 예시
BEGIN;                          -- 트랜잭션 시작
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;  -- 격리 수준 설정

-- 예: 계좌 이체
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;  -- 출금
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;  -- 입금

-- 제약 조건(예: CHECK balance >= 0)이 있다면 Consistency 보장에 도움

COMMIT;                         -- 커밋(지속성 보장: WAL에 의해 크래시 후에도 유지)

-- 오류 발생 시
-- ROLLBACK;                    -- 전체 취소(원자성)
```


