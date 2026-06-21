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

- [ ] 3. 2026 실제 선수들로 선수 데이터베이스 구성
- [ ] 4. 경기 시뮬레이션시 그래픽 적용
- [ ] 5. 시뮬레이션 고도화
