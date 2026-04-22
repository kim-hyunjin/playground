# SQL 튜닝 리포트: 파티셔닝을 이용한 급여 조회 최적화

제공해주신 인덱스 구조와 데이터 분포를 분석한 결과, 기존 복합 인덱스의 한계를 극복하기 위한 **파티셔닝(Partitioning)** 전략을 제안합니다.

---

## 1. Analysis Overview

### 대상 쿼리
```sql
select count(1) from 급여 where 시작일자 between str_to_date('2000-01-01', '%Y-%m-%d') and str_to_date('2000-12-31', '%Y-%m-%d');
```

### 현황 분석 (Index)
| Table | Key_name | Seq | Column_name | Cardinality | 비고 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **급여** | **PRIMARY** | 1 | **사원번호** | 315,340 | **Leading Column** |
| **급여** | **PRIMARY** | 2 | **시작일자** | 2,838,065 | 복합 PK의 두 번째 열 |
| **급여** | I_사용여부 | 1 | 사용여부 | 1 | 카디널리티 매우 낮음 |

### 기존 방식의 문제점
*   **인덱스 선두 컬럼 미사용**: `PRIMARY KEY`가 `(사원번호, 시작일자)` 순서로 구성되어 있습니다. `시작일자` 단독 조건으로 조회 시, 인덱스의 첫 번째 컬럼인 `사원번호`가 조건에 없으므로 효율적인 **Index Range Scan**이 불가능합니다.
*   **결과**: 옵티마이저는 차선책으로 `I_사용여부` 인덱스 전체를 읽는 **Full Index Scan**을 수행하여 약 283만 건을 전수 조사하고 있습니다.

---

## 2. Optimization Strategy: Range Partitioning

`시작일자`는 연도별로 데이터가 누적되는 성격이 강하므로, 날짜 범위를 기준으로 데이터를 물리적으로 분리하는 **Range Partitioning**이 가장 효과적입니다.

### 1) 파티션 테이블 재구성 (제안)
MySQL에서 파티션 키는 반드시 모든 고유 키(PK 포함)의 일부여야 합니다. 현재 `시작일자`가 PK의 일부이므로 즉시 적용 가능합니다.

```sql
-- 기존 테이블을 연도별 파티션으로 재구성
ALTER TABLE 급여
PARTITION BY RANGE (YEAR(시작일자)) (
    PARTITION p1985 VALUES LESS THAN (1986),
    PARTITION p1986 VALUES LESS THAN (1987),
    PARTITION p1987 VALUES LESS THAN (1988),
    PARTITION p1988 VALUES LESS THAN (1989),
    PARTITION p1989 VALUES LESS THAN (1990),
    PARTITION p1990 VALUES LESS THAN (1991),
    PARTITION p1991 VALUES LESS THAN (1992),
    PARTITION p1992 VALUES LESS THAN (1993),
    PARTITION p1993 VALUES LESS THAN (1994),
    PARTITION p1994 VALUES LESS THAN (1995),
    PARTITION p1995 VALUES LESS THAN (1996),
    PARTITION p1996 VALUES LESS THAN (1997),
    PARTITION p1997 VALUES LESS THAN (1998),
    PARTITION p1998 VALUES LESS THAN (1999),
    PARTITION p1999 VALUES LESS THAN (2000),
    PARTITION p2000 VALUES LESS THAN (2001), -- 2000년 데이터 전용 파티션
    PARTITION p2001 VALUES LESS THAN (2002),
    PARTITION p2002 VALUES LESS THAN (2003),
    PARTITION p_max VALUES LESS THAN MAXVALUE
);
```

---

## 3. Expected Impact

### 1) 파티션 프루닝 (Partition Pruning) 적용
2000년 데이터를 조회할 때, 옵티마이저는 전체 283만 건의 데이터가 담긴 테이블이 아닌, **`p2000` 파티션 세그먼트**만 읽습니다.

*   **개선 전 스캔 범위**: 약 2,838,065건 (전체 데이터)
*   **개선 후 스캔 범위**: **약 255,785건** (`p2000` 파티션 내 데이터만 스캔)

### 2) 성능 및 관리 이점
| 항목 | 상세 내용 |
| :--- | :--- |
| **I/O 감소** | 불필요한 연도의 데이터 페이지를 메모리(Buffer Pool)로 올리지 않아 효율적임 |
| **Full Scan 방지** | 인덱스 선두 컬럼 제약 없이 물리적으로 분리된 구역만 스캔하므로 압도적으로 빠름 |
| **유지보수** | 오래된 데이터 삭제 시 `DELETE` 대신 `DROP PARTITION`을 사용하여 성능 저하 없이 즉시 삭제 가능 |

### 3) 예상 실행 계획 변화
| id | select_type | partitions | type | rows | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | SIMPLE | **p2000** | ALL (or index) | **255,785** | Using where |

**결론**: 복합 PK의 순서상 발생하는 비효율을 **물리적인 데이터 분할(파티셔닝)**을 통해 해결할 수 있습니다. 2000년 조회 시 해당 파티션만 액세스하게 되어, 현재보다 약 **11배 이상의 성능 향상**이 예상됩니다.
