# Baseball Manager ⚾

풋볼매니저 스타일의 **야구 감독 시뮬레이션** 게임입니다.

## 기능

- **10개 구단** 중 하나를 선택해 18주 정규시즌 진행
- **1군·2군** 분리 로스터, 승격·하향, 별도 2군 리그 시뮬
- **2026 KBO 실명 로스터** — 1군 26명 + 2군 28명 (팀당, JSON 기본)
- **스쿼드 관리** — 선수 능력치, 피로도, 부상·재활, 육성(potential/XP)
- **라인업·로테이션** 편성
- **경기 시뮬레이션** — 이닝별 스코어 + 플레이-by-플레이 (희생·실책·도루·수비 반영)
- **이적·트레이드** — 정규시즌 중 타 구단 영입·1~3명 교환
- **계약 연수** — 시즌 종료마다 -1, FA 임박·스토브리그 FA 풀 연동
- **스토브리그** — FA 영입, 신인 드래프트, 시즌 리셋
- **자동 저장** — localStorage (`baseball-manager:v7`)

## 실행

```bash
cd toy/baseball-manager
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 빌드·검증

```bash
npm run build              # 프로덕션 빌드
npm run validate:rosters   # JSON 스키마·인원 검증
npm run roster:report      # 팀별 OVR 분포·밸런스 경고
npm run regression:check   # 핵심 플로우 헤드리스 회귀 테스트
npm run sim:sanity         # 시뮬 R/G·park factor 몬te카를lo 검증 (KBO ~4.5–5.5 R/G)
npm run sim:outcomes       # 타석 결과 분포 (K/BB/안타 %) 샘플
```

## 시뮬레이션

```
src/engine/sim/
  atBat.ts            # 타석 결과 (K/BB/안타/희생/실책)
  atBatSituation.ts   # 점수차·주자 상황별 희생·실책·컨택트 분기
  atBatConstants.ts   # R/G 튜닝 상수
  bullpen.ts          # SP/RP·closer·pitch count
  context.ts          # SimContext, LEAGUE_STRENGTH
  handedness.ts       # 투타·platoon 보정
  runners.ts          # 주자·RBI·도루 시도
src/data/parks/kbo2026.ts
src/data/rosters/2026/handednessOverrides.ts
```

- **Park factor** — 홈 구장 `runFactor` / `hrFactor`
- **Platoon** — 동타·동투 −4%, 이타·이투 +4%
- **도루** — 주자 speed·투수 control 기반, 성공 시 SB 기록
- **희생·실책** — 아웃 카운트·점수차·수비 fielding 반영

## 트레이드·계약·재활

| 기능 | 위치 |
|------|------|
| 트레이드 (1~3명 교환) | `src/engine/trades.ts`, `TransfersPage` |
| 계약 연수 | `Player.contractYears`, `contracts.ts`, `stoveLeague.ts` |
| 부상·재활 | `injury.ts` — 2군 회복 2일/주, 대시보드 재활 배치 |

## 데이터 구조

```
src/data/
  rosters/2026/kbo/   # 팀별 JSON (1군 26 + 2군 28)
  draft/2026.ts
  fa/external2026.ts
  ratings/
  rosterLoader.ts     # loadLeague2026, KBO JSON 기본
scripts/sync-kbo-roster.ts  # KBO 사이트 동기화 (선택)
```

### KBO 로스터 갱신

```bash
npm run sync:kbo          # 전체 동기화
npm run kbo:audit-match   # 매칭 실패 감사
npm run validate:rosters
```

## 세이브 버전

| 버전 | 변경 |
|------|------|
| v7 | `realPlayerId`, `dataSeason`, `isGenerated`, `contractYears` |
| v6 이하 | 로드 시 v7로 마이그레이션 |

## 비공식 고지

본 프로젝트는 **팬메이드** 비영리 시뮬레이션입니다. KBO·구단·선수명과 무관하며, 능력치는 추정치를 포함합니다.
