# TODO

## 1. 2군 기능 추가 ✅ 완료

> FM 스타일로 1군·2군 로스터를 분리하고, 승격·하향·2군 시즌을 운영할 수 있게 한다.

### 1.1 목표

- 유저 팀뿐 아니라 **리그 10개 구단 모두** 2군 로스터를 갖도록 한다.
- 1군 등록(26~28명)과 2군 등록(20~30명)을 분리하고, **승격 / 하향 / 방출**을 관리할 수 있게 한다.
- 2군은 **별도 일정·순위·기록**을 갖되, 1군 시즌 진행(주차 단위)과 함께 자동 시뮬레이션한다.
- 2군 활약은 **선수 육성(TODO 2번)** 과 연결될 수 있도록 기록·상태를 남긴다.

### 1.2 현재 상태 (as-is)

| 영역 | 현재 |
|------|------|
| 로스터 | `Team.players[]` 단일 배열, 구단당 약 26명 |
| 등급 구분 | 없음 (1군/2군 개념 없음) |
| 일정 | `schedule.ts` — 1군 10팀 리그만 존재 |
| 시뮬 | `simulation.ts` — 1군 경기만 처리 |
| UI | `SquadPage` — 전원 1군으로 표시 |
| 세이브 | `GameState` v2, `teams[].players` flat 구조 |

### 1.3 설계 방향

**KBO에 맞춘 단순화 규칙**

- 1군 등록: 타자 13 + 투수 13 = **26명** (초기 목표, 이후 28명까지 확장 가능)
- 2군 등록: **최대 30명** (유망주·재활·1군 백업)
- 승격/하향: 유저는 자유 이동, AI는 성적·부상·피로도 기준으로 자동 처리
- 2군 리그: 10팀 **더블헤더 없는 주 5경기** 수준으로 경량화 (1군과 동일 주차에 병렬 진행)
- 2군 경기: 유저 경기는 텍스트 로그 생략, **결과·박스스코어·순위만** 저장 (성능·UX)

**1군과의 연동**

- 1군 경기 출전 선수는 `lineup` / `rotation` 에 등록된 1군 선수만 가능
- 1군 로스터 부족 시(부상·피로·방출) 2군에서 **콜업 제안** UI
- 2군에서 좋은 성적 → 승격 후보 배지 표시 (육성 TODO와 공유)

### 1.4 데이터 모델 변경

#### Player 확장

```ts
type RosterLevel = 'first' | 'farm'

interface Player {
  // ... 기존 필드
  rosterLevel: RosterLevel      // 1군 / 2군
  optionYears?: number          // (선택) 2군 잔류 연한, 추후 FA/트레이드와 연계
  injuryDays?: number           // (선택) 부상 일수, 2군 재활 연계
}
```

#### Team 확장

```ts
interface Team {
  // ... 기존 필드
  // players[] 유지하되 rosterLevel로 구분
  // 또는 명시적 분리:
  firstTeamPlayerIds: string[]
  farmPlayerIds: string[]
}
```

**권장:** `players[]` 단일 배열 + `rosterLevel` 필드  
→ `playerLookup`, `PlayerDetailModal`, 트레이드 로직 변경 최소화

#### GameState 확장 (v3)

```ts
interface GameState {
  version: 3
  // ... 기존 1군 필드
  farmSchedule: ScheduledGame[]   // 2군 일정
  farmResults: GameResult[]       // 2군 결과 (로그 optional / 축약)
  farmStandings?: FarmStanding[]  // 또는 teams별 farmWins/farmLosses
}
```

#### 2군 전용 타입 (신규)

```ts
interface FarmStanding {
  teamId: string
  wins: number
  losses: number
  runsScored: number
  runsAllowed: number
}
```

#### 세이브 마이그레이션

- v2 → v3: 기존 `players` 전원 `rosterLevel: 'first'`, 2군 선수 자동 생성(`generateFarmRoster`)
- `STORAGE_KEY` → `baseball-manager:v3`

### 1.5 엔진 작업

#### `generator.ts`

- [x] `FARM_ROSTER_TEMPLATE` — 2군 포지션 구성 (年輕 tier 위주, age 18~24 비율 높게)
- [x] `generateFarmRoster(team)` — 구단당 2군 25~30명 생성
- [x] `generateLeague()` — 1군 생성 후 각 팀에 2군 로스터 부여
- [x] 1군/2군 **등록 인원 검증** (`validateFirstTeamRoster`, `validateFarmRoster`)

#### `schedule.ts`

- [x] `generateFarmSchedule(teams, totalWeeks)` — 10팀 라운드로빈 (1군과 주차 동기)
- [ ] 홈/원정 균형, 주당 5경기 또는 3경기(경량 모드) 선택 가능

#### `simulation.ts`

- [x] `simulateFarmWeek(state)` — 해당 주 2군 CPU 경기 일괄 처리
- [x] `simulateFarmGame(home, away)` — 1군 sim 재사용, 로그 생략 옵션
- [x] `advanceWeek()` 에 2군 sim hook 추가 (1군 CPU 경기와 병렬)
- [x] 2군 stats 누적: `farmSeasonStats` 필드 (1군 기록과 분리)

#### `roster.ts` (신규 모듈)

- [x] `promotePlayer(team, playerId)` — 2군 → 1군 (1군 정원 초과 시 거부)
- [x] `demotePlayer(team, playerId)` — 1군 → 2군 (라인업/로테이션에서 자동 제거)
- [x] `canPromote / canDemote` — 포지션·정원·필수 포지션 검사
- [x] AI `autoAdjustRoster(team)` — 주차마다 CPU 구단 승하향

### 1.6 UI 작업

#### 네비게이션

- [x] `View` 에 `'farm'` 추가
- [x] `Layout` 사이드바: **2군** 메뉴

#### `FarmSquadPage` (신규)

- [x] 2군 선수 목록 (나이, OVR, 포지션, 2군 wOBA/FIP)
- [x] **승격** 버튼 → 1군 정원 확인 후 이동
- [x] 필터: 유망주(24세 이하), 재활(피로↑), 콜업 후보

#### `SquadPage` (1군) 수정

- [x] 1군 등록 선수만 표시 (`rosterLevel === 'first'`)
- [x] **하향** 버튼
- [x] 1군 등록 인원 카운터 (예: `26/26`)

#### `FarmStandingsPage` 또는 Standings 탭

- [x] 2군 리그 순위표 (승·패·득실) — Standings 1군/2군 탭
- [x] 유저 2군 팀 순위 하이라이트

#### `PlayerDetailModal` 확장

- [x] 1군 / 2군 표시
- [x] 2군 시즌 기록 (SabermetricsPanel farm 소스)
- [x] 승격 / 하향 액션 + 콜업 후보 배지

#### `DashboardPage`

- [x] 2군 순위 요약
- [x] 콜업 제안 카드 (2군 감독)

### 1.7 gameStore 액션

- [x] `promotePlayer(playerId: string)`
- [x] `demotePlayer(playerId: string)`
- [x] `advanceWeek()` — 2군 sim + AI roster adjust 포함
- [x] `openPlayer()` — 2군 선수도 league 전체 lookup 유지

### 1.8 구현 단계 (권장 순서)

| Phase | 내용 | 산출물 |
|-------|------|--------|
| **P1** | 타입·생성·마이그레이션 | `rosterLevel`, 2군 로스터 생성, v3 세이브 |
| **P2** | 승격/하향 로직 | `roster.ts`, store 액션, 정원 검증 |
| **P3** | 2군 일정·시뮬 | `farmSchedule`, `simulateFarmWeek`, farmStats |
| **P4** | UI (2군 스쿼드·순위) | `FarmSquadPage`, Standings 탭 |
| **P5** | AI·대시보드 연동 | CPU 승하향, 콜업 제안, Dashboard 요약 |
| **P6** | 폴리싱 | PlayerDetail 2군 탭, 트랜스퍼 시 1/2군 표시, 밸런스 튜닝 |

### 1.9 수용 기준 (Definition of Done)

- [x] 새 게임 시작 시 각 구단 1군 26명 + 2군 28명 생성
- [x] 유저가 2군 선수를 1군으로 승격·하향 가능, 1군 정원 초과 불가
- [x] 주차 진행 시 2군 경기 자동 시뮬 + 순위 반영
- [x] 1군 라인업/로테이션에 2군 선수 배치 불가
- [x] 2군 선수 시즌 기록 조회 가능
- [x] 세이브 마이그레이션 (v2→v4, 출시 전 정리 예정)
- [x] `npm run build` 통과

### 1.10 이후 연계 (TODO 2·3번)

| TODO | 연계 내용 |
|------|-----------|
| **2. 선수 육성** | 2군 출전 시간 → potential/exp 성장, 2군 코치 효과 |
| **3. 2026 실제 선수 DB** | 1군/2군 등록 명단 분리 데이터, 실제 2군(퓨처스) 명단 |
| **5. 시뮬 고도화** | 2군·1군 다른 리그 강도 계수, 부상·재활 시스템 |

### 1.11 오픈 이슈 (구현 전 결정)

- [x] 2군 경기 텍스트 로그: **전부 생략** (결과·기록만)
- [x] `farmSeasonStats` vs `seasonStats` **분리 표시**
- [x] 트레이드: **1군·2군 모두 대상**, 영입 시 1군 우선·마감 시 2군
- [ ] 2군 일정 밀도: 주 5경기 vs 주 3경기 (시즌 길이·성능) — 추후 튜닝

---

- [x] 2. 선수 육성 기능 추가 ✅

### 2.1 구현 요약

- **potential** — 선수별 OVR 성장 상한 (티어·나이·2군 반영)
- **developmentXp** — 1군/2군 경기 출전 시 누적 (2군·젊을수록 많음)
- **주간 육성** — 코치 teaching + XP + 2군 보너스 → 능력치 +1 시도
- **UI** — PlayerDetail 「육성」탭, FarmSquad 잠재력 컬럼·POT 배지

- [x] 2.5 스토브리그 · FA 영입 ✅

### 2.5 구현 요약

- **시즌 페이즈** — `regular` → `stove` → 다음 시즌 (`seasonYear` 증가)
- **FA 풀** — 계약 만료(29세+ 등) 선수 + 해외·独立 FA 10명
- **영입** — `StoveLeaguePage`에서 희망 연봉 지불, 1군 우선·2군 마감 시 2군 등록
- **CPU** — 스토브 주차 진행 시 AI 구단 FA 영입
- **시즌 리셋** — W/L·기록 초기화, 나이 +1, XP 일부 유지, 일정 재생성
- **UI** — 18주차 종료 후 「스토브리그 진입」, 오프시즌 전용 네비

- [x] 2.6 신인 드래프트 ✅

### 2.6 구현 요약

- **5라운드** · 10팀 역순 지명 (시즌 최하위부터)
- **유망주 풀** — 18~22세, 2군 등록·계약금 지급
- **UI** — `DraftPage`, 내 차례까지 / 자동 진행

- [x] 3. 2026 실제 선수들로 선수 데이터베이스 구성 *(P1~P5 1차 완료 — 드래프트/FA 실데이터는 2차)*

> 프로시저럴 생성(`generatePlayer`) 대신 **KBO 10개 구단 실명·실제 포지션·(가능하면) 실제 스탯 기반** 로스터로 게임을 시작한다.

### 3.1 목표

- **1군 등록 명단** — 2026 시즌 기준 각 구단 **26명** (현재 게임 규칙과 동일)
- **2군 등록 명단** — 퓨처스/2군 등록 선수 위주 **최대 28명** (데이터 부족 시 **부분 실데이터 + 생성 보충**)
- **능력치** — 2025 시즌(또는 최근 1~2년) 성적을 게임 속성(`contact`, `power`, `velocity` 등)으로 **환산**
- **연봉·나이** — 공개 정보 기반 추정치 (게임 예산 스케일에 맞게 **정규화**)
- **신규 게임** — `generateLeague()` 대신 `loadRoster2026()` 로 10팀 초기화
- **오프시즌 연동** — 드래프트 유망주·FA는 **실데이터 풀 확장** 또는 기존 생성 혼합 (1차는 생성 유지 가능)

### 3.2 현재 상태 (as-is)

| 영역 | 현재 |
|------|------|
| 선수 생성 | `generator.ts` — 랜덤 한국식 이름, `ROSTER_TEMPLATE` 포지션 고정 |
| 구단 | `TEAM_DEFS` 10팀 — 실제 구단명·색·구장은 일치 |
| 선수 ID | `crypto.randomUUID()` — 세이브 간 동일 선수 추적 불가 |
| 2군 | `FARM_ROSTER_TEMPLATE` 전량 프로시저럴 |
| 스탯 출처 | 없음 — tier(`star/avg/weak`) + 랜덤 분산 |
| 드래프트/FA | 프로시저럴 유망주·가상 FA |

### 3.3 설계 방향

**데이터 소스 (권장: 정적 JSON + 수동 큐레이션)**

| 우선순위 | 소스 | 용도 |
|----------|------|------|
| 1 | 수동 작성 JSON (`src/data/rosters/2026/`) | 1군 엔트리, 핵심 2군 |
| 2 | 공개 기록 참고 (KBO 기록실, Statiz, 위키 등) | 능력치 환산 입력값 |
| 3 | `generatePlayer()` | 2군 잔여 슬롯·드래프트·FA 보충 |

> 자동 크롤링은 1차 범위 **제외** (법적 이슈·유지보수·파서 깨짐). 대신 **시즌별 JSON 갱신** 워크플로를 문서화.

**능력치 환산 (개념)**

```
타자: wOBA/OPS, ISO, BB%, K%, SB  → contact, power, eye, speed (+ fielding은 포지션·골드글러브 보정)
투수: ERA, FIP, K/9, BB/9, IP   → velocity, control, movement, stamina (SP/RP 역할 분리)
```

- 리그 평균 = OVR 55~60 앵커, MVP급 = 80+, 2군 유망주 = 45~65
- **단일 시즌 소样本** 보정: PA/IP minimum 미달 시 regressed stats (SHRINK)

**연봉 스케일**

- 실제 KBO 연봉(원) → 게임 `$` 로 **선형 스케일** (예: 1억원 ≈ $100K, 팀 예산 $8~15M 유지)
- 데이터 없으면 OVR·나이 기반 `estimateSalary()`

**선수 ID**

- 안정 ID: `{teamAbbr}-{slug}` 또는 `{teamAbbr}-{backNumber}` (예: `KIA-김도영`)
- 런타임 `Player.id`는 데이터 ID 그대로 사용 → 트레이드·기록·세이브 일관성

### 3.4 데이터 모델

#### 원본 스키마 (JSON, `PlayerRecord`)

```ts
/** src/data/types.ts — 런타임 Player와 분리 */
export interface PlayerRecord {
  id: string                    // 안정 식별자
  name: string
  teamAbbr: keyof typeof TEAM_MAP
  role: PlayerRole              // 게임 포지션 (SP/RP/SS 등)
  rosterLevel: 'first' | 'farm'
  age: number
  /** 원화 연봉(선택) — 로더에서 게임 salary로 변환 */
  salaryKrw?: number
  /** 환산 입력용 (선택, 로더-only) */
  sourceStats?: BatterSource | PitcherSource
  /** 직접 지정 시 sourceStats 무시 */
  ratings?: Partial<Pick<Player, 'contact' | 'power' | 'eye' | 'speed' | 'fielding' | 'velocity' | 'control' | 'movement' | 'stamina'>>
  potential?: number            // 미지정 시 rollPotential
}
```

#### 디렉터리 구조 (안)

```
src/data/
  types.ts
  ratings/
    batterFromStats.ts      # wOBA 등 → contact/power/eye
    pitcherFromStats.ts
    salaryScale.ts
  rosters/
    2026/
      index.ts              # re-export + validate
      kia.json
      lg.json
      ... (10 files)
      farm/                 # (선택) 2군만 별도
        kia-farm.json
```

#### GameState / Player 확장 (선택)

```ts
interface Player {
  // ... 기존
  realPlayerId?: string       // = id from JSON, 디버그·출처 표시
  dataSeason?: number         // 2026
}
```

- **세이브 버전:** v7 (`baseball-manager:v6`)
- **마이그레이션:** v6 → v7 시 기존 세이브는 **프로시저럴 유지** 또는 “실데이터로 새 게임 권장” (출시 전 결정)

### 3.5 엔진 작업

#### `rosterLoader.ts` (신규)

- [x] `loadTeamRoster(abbr): Player[]` — JSON → `Player` (stats·potential·morale 초기화)
- [x] `loadLeague2026(userTeamIndex): Team[]` — 10팀 + `generateDefaultStaff`
- [x] `validateRoster(records)` — 1군 26 / 2군 28, 포지션 중복 허용 범위, 필수 SP/RP/C
- [x] `fillFarmGaps(team)` — 2군 미달 시 `generatePlayer`로 **이름만 가상** 보충 (표시: `(퓨처스)` 접두?)

#### `ratings/batterFromStats.ts` / `pitcherFromStats.ts` (신규)

- [x] 리그 평균 상수 테이블 (2025 KBO 기준, 추후 `data/constants/league2025.json`)
- [x] z-score 또는 percentile → 1~99 스케일
- [x] SP/RP 분류: GS%, IP/G

#### `generator.ts` 수정

- [ ] `generateLeague()` — `USE_REAL_ROSTERS` 플래그 또는 `createInitialState`에서 분기
- [ ] `generateTeam()` — 실데이터 모드에서는 **사용 안 함** (fallback만)
- [ ] `TEAM_DEFS` — `abbr`를 JSON `teamAbbr`와 **단일 소스**로 통합

#### 오프시즌 연동 (2차)

- [ ] **드래프트** — `generateProspectPool()` 일부를 `2026-draft-class.json` 실명 후보로 교체
- [ ] **FA** — `collectContractExpirations` 시 실명 유지, `formerTeamName` 정확도 향상
- [ ] **스토브** — 실제 FA 예상 명단 시즌별 JSON (선택)

#### 검증 스크립트 (신규, `scripts/`)

- [x] `npm run validate:rosters` — JSON 스키마·인원·중복 ID·팀별 payroll 합계
- [ ] (선택) `npm run roster:report` — 팀별 OVR 분포 출력 (밸런스 튜닝용)

### 3.6 UI 작업

#### `StartScreen`

- [x] 구단 선택 시 **1군 핵심 선수 3~5명** 프리뷰 (OVR·포지션)
- [x] “2026 실제 명단 기반” 배지

#### `SquadPage` / `FarmSquadPage` / `PlayerDetailModal`

- [ ] 실명 표시 (이미 name 필드)
- [ ] (선택) `dataSeason` / 프로시저럴 보충 선수 구분 배지

#### `StatsPage`

- [ ] (선택) 실제 등번호·포지션 표기 확장

### 3.7 gameStore 변경

- [x] `createInitialState()` → `loadLeague2026(teamIndex)` 호출 *(generateLeague 대체)*
- [ ] `migrateState` v7 필드 (`realPlayerId`, `dataSeason`)
- [ ] 개발 플래그: `localStorage` 또는 `.env` `VITE_USE_REAL_ROSTERS=true` 로 A/B 테스트

### 3.8 구현 단계 (권장 순서)

| Phase | 내용 | 산출물 | 예상 규모 |
|-------|------|--------|-----------|
| **P1** | 스키마·로더·환산기 골격 | `PlayerRecord`, `rosterLoader`, 1팀 POC (KIA 1군 26) | 2~3일 |
| **P2** | 능력치 환산 + 연봉 스케일 | `batterFromStats`, `pitcherFromStats`, `salaryScale` | 2~3일 |
| **P3** | 10팀 1군 JSON 완성 | `rosters/2026/*.json`, `validate:rosters` | 3~5일 (데이터 입력 병목) |
| **P4** | 2군 데이터 (부분) + gap fill | `farm/*.json` 또는 팀 JSON에 `farm` 배열 | 2~4일 |
| **P5** | 게임 통합·밸런스 | `createInitialState` 전환, 시뮬 1시즌 플레이테스트, OVR 분포 튜닝 | 2~3일 |
| **P6** | 오프시즌·문서 | 드래프트/FA 실데이터(선택), README·데이터 갱신 가이드 | 1~2일 |

**POC 완료 기준 (P1+P2):** KIA 한 팀만 실데이터로 새 게임 시작 → 라인업·경기 시뮬·OVR 체감 OK

### 3.9 수용 기준 (Definition of Done)

- [x] 새 게임 시 10팀 **1군 26명 실명** (2군은 최소 50% 실데이터 또는 문서화된 보충 규칙)
- [ ] 각 팀 OVR 분포가 **비현실적 편차 없음** (1팀 전원 90+ / 전원 40- 금지)
- [x] `validate:rosters` CI 통과
- [ ] 기존 기능 회귀 없음: 승하향, 라인업, 시뮬, 스토브, 드래프트, FA
- [x] `npm run build` 통과
- [ ] README에 데이터 출처·갱신 방법·비공식 팬메이드 고지

### 3.10 이후 연계

| TODO | 연계 |
|------|------|
| **5. 시뮬 고도화** | 실제 투타 플atoon, 구종, park factor |
| **스토브/FA** | 실제 FA 명단 JSON, 멀티-year contract |
| **2군** | 퓨처스 실제 순위·팀명 (현재는 1군 구단명 공유) |

### 3.11 오픈 이슈 (구현 전 결정)

- [ ] **기준 시점:** 2026 시즌 개막 엔트리 vs 2025 종료 rosters + 트레이드 반영
- [ ] **2군 커버리지:** 전원 수동 vs 1군만 실데이터 + 2군 프로시저럴
- [ ] **등번호·사진:** 1차 범위 포함 여부 (권장: **제외**, 이름·포지션·스탯만)
- [ ] **저작권/고지:** 팬메이드 비영리 고지 문구 위치 (StartScreen footer)
- [ ] **세이브 호환:** v6 세이브 강제 마이그레이션 vs 새 게임만 v7
- [ ] **데이터 언어:** 선수명 한글만 vs `nameEn` 병기

### 3.12 데이터 입력 워크플로 (운영)

1. KBO 1군 엔트리 스프링캠프/개막 기준 스프레드시트 작성 (팀·이름·포지션·나이·연봉·2025 기록)
2. `scripts/csv-to-roster.ts` (선택)로 JSON 변환
3. `npm run validate:rosters` → OVR 리포트 확인
4. 게임 내 5~10경기 플레이 → 팀 강세/열세 조정 (ratings 직접 override 또는 sourceStats 수정)
5. 시즌 중: JSON patch 버전 (`2026.1`, `2026.2`)

---

- [ ] 4. 경기 시뮬레이션시 그래픽 적용
- [x] 5. 시뮬레이션 고도화 (텍스트 엔진) — **부분 완료** (그래픽 제외)

### 5.1 구현 요약 (2026-06)

- [x] 희생번트·실책·수비 fielding (`atBatSituation.ts`, `pickContactOutcome`)
- [x] 도루 시도·SB 기록 (`runners.tryStealAttempt`, `recordStolenBase`)
- [x] platoon·park factor·2군 리그 강도 (기존)
- [ ] 구종·세밀한 투구전 (미구현)
- [ ] 경기 화면 그래픽 (TODO 4)

### 5.2 트레이드·계약·재활

- [x] CPU 트레이드 (`trades.ts`, `TransfersPage` 탭)
- [x] `contractYears` — 로스터 기본값, FA 만료, 스토브 FA 영입 시 갱신
- [x] 부상 2군 재활 가속, 대시보드·선수 상세 재활 배치
- [x] UI 배지 (부상·계약·등록), Stats SB 컬럼
