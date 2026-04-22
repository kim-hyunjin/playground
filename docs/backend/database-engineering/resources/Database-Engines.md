# Database Engines

## Database Engine이란?

- 디스크 저장소와 CRUD를 담당하는 **라이브러리**
  - 단순한 key-value 저장소일 수도 있고
  - ACID, 트랜잭션, 외래 키를 완전히 지원하는 복잡한 것일 수도 있음
- DBMS는 데이터베이스 엔진을 사용하고 그 위에 기능을 구축한다 (서버, 복제, 격리, 저장 프로시저 등)
- 새 데이터베이스를 만들고 싶다면? 처음부터 만들지 말고 엔진을 사용하라
- **Storage Engine** 또는 **Embedded Database**라고도 불림

### 엔진 교체 가능 여부

| DBMS | 엔진 교체 |
|------|---------|
| MySQL, MariaDB | 엔진을 자유롭게 교체 가능 |
| Postgres | 내장 엔진을 변경할 수 없음 |

---

## MyISAM

- **Indexed Sequential Access Method**의 약자
- B-tree (Balanced tree) 인덱스가 행(row)을 **직접 가리킴**
- 트랜잭션 지원 **없음**
- Open Source, Oracle 소유
- Insert는 빠르지만, **Update와 Delete는 문제가 있음** (단편화 발생)
- 데이터베이스 충돌 시 **테이블이 손상됨** (수동 복구 필요)
- **테이블 레벨 잠금** (Table level locking)
- MySQL, MariaDB, Percona (MySQL 포크)에서 지원
- MySQL의 **과거 기본 엔진** (현재는 InnoDB)

---

## Aria

- Michael Widenius가 개발
- MyISAM과 매우 유사
- MyISAM과 달리 **Crash-safe** (충돌 안전)
- Oracle 소유가 아님
- **MariaDB** (MySQL 포크) 전용으로 설계
- MariaDB 10.4부터 모든 시스템 테이블이 Aria 사용

---

## InnoDB

- **B+Tree** 사용 - 인덱스가 Primary Key를 가리키고, PK가 행을 가리킴
- MyISAM을 대체
- **MySQL & MariaDB의 기본 엔진**
- ACID 호환 트랜잭션 지원
- 외래 키 (Foreign Keys) 지원
- Tablespace 지원
- **행 레벨 잠금** (Row level locking)
- 공간 연산 (Spatial operations) 지원
- Oracle 소유

---

## XtraDB

- InnoDB의 **포크**
- MariaDB 10.1까지 기본 엔진이었음
- MariaDB 10.2에서 **다시 InnoDB로 전환**
- "XtraDB는 InnoDB의 최신 기능을 따라갈 수 없어 더 이상 사용할 수 없다"
- MariaDB 10.4부터 시스템 테이블은 모두 Aria

---

## LevelDB

- Google의 Jeff Dean과 Sanjay Ghemawat이 **2011년** 개발
- **LSM (Log Structured Merge Tree)** 기반 (높은 삽입 성능, SSD에 적합)
- 트랜잭션 지원 없음
- Google BigTable에서 영감을 받음
- 파일 레벨 구조:
  - **Memtable** (메모리)
  - **Level 0** (young level)
  - **Level 1 - 6**
- 파일이 커지면 레벨 간 **병합(merge)** 수행
- 사용처: Bitcoin Core 블록체인, AutoCAD, Minecraft

---

## RocksDB

- Facebook이 **2012년** LevelDB를 포크하여 개발
- **트랜잭션 지원**
- 고성능, **멀티스레드 컴팩션**
- LevelDB에 없는 많은 기능 추가
- 다양한 DBMS에서 사용:
  - **MyRocks** - MySQL, MariaDB, Percona용
  - **MongoRocks** - MongoDB용
  - 그 외 수많은 시스템에서 사용

---

## SQLite

- D. Richard Hipp이 **2000년** 설계
- 로컬 데이터를 위한 매우 인기 있는 **임베디드 데이터베이스**
- B-Tree 기반 (LSM은 확장으로 지원)
- Postgres와 유사한 문법
- **Full ACID** 지원 & 테이블 잠금
- 동시 읽기/쓰기 지원
- 브라우저의 Web SQL에서 사용
- 많은 운영체제에 기본 포함

---

## Berkeley DB

- Sleepycat Software가 **1994년** 개발 (현재 Oracle 소유)
- **Key-value 임베디드 데이터베이스**
- ACID 트랜잭션, 잠금, 복제 등 지원
- Bitcoin Core에서 사용했으나 (이후 LevelDB로 전환)
- MemcacheDB에서 사용

---

## B-Tree vs LSM Tree 기반 데이터베이스

| B-Tree 기반 | LSM Tree 기반 |
|-----------|-------------|
| Oracle | Cassandra |
| Microsoft SQL Server | Apache HBase |
| IBM DB2 | Google Cloud Bigtable |
| PostgreSQL | Elasticsearch |
| MySQL (InnoDB) | InfluxDB |
| MongoDB | LevelDB |
| Couchbase | RocksDB |
| | YugaByte DB |

---

## Demo: MySQL에서 엔진 전환

1. MySQL Docker 컨테이너 실행
2. MyISAM 테이블 생성
3. InnoDB 테이블 생성
4. JavaScript로 데이터베이스 연결
5. MyISAM vs InnoDB에서 트랜잭션 동작 비교

---

## Summary

| 엔진 | 자료구조 | 트랜잭션 | 잠금 방식 | 주요 사용처 |
|------|---------|---------|---------|-----------|
| MyISAM | B-Tree | X | 테이블 레벨 | MySQL (과거 기본) |
| Aria | B-Tree | X | 테이블 레벨 | MariaDB 시스템 테이블 |
| InnoDB | B+Tree | O (ACID) | 행 레벨 | MySQL/MariaDB (현재 기본) |
| XtraDB | B+Tree | O (ACID) | 행 레벨 | MariaDB (과거 기본) |
| LevelDB | LSM | X | - | Bitcoin, Minecraft |
| RocksDB | LSM | O | - | Facebook, MyRocks |
| SQLite | B-Tree | O (ACID) | 테이블 레벨 | 임베디드/모바일/브라우저 |
| Berkeley DB | B-Tree | O (ACID) | - | MemcacheDB |
