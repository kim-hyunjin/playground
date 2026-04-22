---
name: sql-optimizer
description: |
  SQL 쿼리와 실행 계획(EXPLAIN), 테이블 구조(DESC), 인덱스 정보를 분석하여 
  성능을 진단하고 최적화된 마크다운 보고서와 튜닝 방향을 제안합니다.
---

# SQL Performance Optimizer

이 스킬은 데이터베이스 성능 분석을 자동화하고 가독성 높은 튜닝 리포트를 생성합니다.

## Workflow

### 1. 데이터 파싱 및 표 변환

- 사용자가 입력한 텍스트 기반의 ASCII 표(+, -, | 기호 포함)를 감지합니다.
- `EXPLAIN`, `DESC`, `SHOW INDEX` 등의 결과를 즉시 정교한 **Markdown 테이블**로 변환하여 출력합니다.

### 2. 실행 계획(EXPLAIN) 정밀 진단

- **Access Type 분석**: `ALL`, `index`, `range` 등 접근 방식에 따른 위험도를 평가합니다.
- **Key 활용도**: `possible_keys`와 실제 사용된 `key`를 비교하여 인덱스 누락 여부를 확인합니다.
- **Extra 필드 해석**: `Using filesort`, `Using temporary`, `Using where` 등을 통해 부하 원인을 파악합니다.

### 3. 구조 기반 튜닝 제안

- `DESC` 정보를 바탕으로 컬럼의 데이터 타입과 널 허용 여부를 확인합니다.
- `SHOW INDEX` 정보를 통해 중복 인덱스나 복합 인덱스 순서의 부적절함을 찾아냅니다.
- 성능 개선을 위한 구체적인 `CREATE INDEX` 구문이나 쿼리 리팩토링 안을 제시합니다.

## Guidelines

- **형식 엄수**: 모든 분석 결과는 `#`를 활용한 계층적 마크다운 구조로 작성합니다.
- **인풋 데이터 표시**: 사용자로부터 받은 입력값들을 표시하여 어떤 데이터들을 기반으로 튜닝이 들어갔는지 보여줍니다.
- **객관적 근거**: 튜닝 제안 시 반드시 실행 계획의 특정 지표(예: rows 수치, type 등)를 근거로 제시합니다.
- **코드 제공**: 최적화된 SQL 문법이나 인덱스 생성문은 반드시 코드 블록(```sql)을 사용합니다.
- **파일 생성**: 결과는 md 파일로 생성합니다.

## Output Template

보고서는 항상 다음 구조를 포함해야 합니다:

1. **Analysis Overview**: 입력된 쿼리와 변환된 메타데이터 표.
2. **Performance Diagnosis**: 실행 계획의 문제점 요약.
3. **Optimization Strategy**: 인덱스 전략 및 쿼리 수정 제안.
4. **Expected Impact**: 개선 후 예상되는 성능 변화.
