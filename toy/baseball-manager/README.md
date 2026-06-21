# Baseball Manager ⚾

풋볼매니저 스타일의 **야구 감독 시뮬레이션** 게임입니다.

## 기능

- **10개 구단** 중 하나를 선택해 18주 정규시즌 진행
- **1군·2군** 분리 로스터, 승격·하향, 별도 2군 리그 시뮬
- **2026 KBO 실명 로스터** — 1군 26명 + 2군 28명 (팀당)
- **스쿼드 관리** — 선수 능력치, 피로도, 육성(potential/XP)
- **라인업·로테이션** 편성
- **경기 시뮬레이션** — 이닝별 스코어 + 플레이-by-플레이
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
```

## 데이터 구조

```
src/data/
  rosters/2026/
    teams/*.ts      # 1군 26 + 2군 28 (farm 확장 포함)
    farm/*.ts       # 팀별 2군 추가 14명
  draft/2026.ts     # 드래프트 실명 유망주
  fa/external2026.ts # 외부 FA 실명 풀
  ratings/          # sourceStats → OVR 환산
  rosterLoader.ts   # loadLeague2026, fillFarmGaps
```

### 능력치 파이프라인

1. `builder.ts` — `batter()` / `pitcher()` 로 `PlayerRecord` 생성
2. `sourceStats` — Statiz·기록실 등에서 환산한 타격/투구 입력값
3. `targetOvr` — 게임 내 목표 OVR; `alignRatingsToTarget()` 으로 스탯 보정
4. `fillFarmGaps()` — 2군 28명 미만일 때만 `(퓨처스)` 프로시저럴 보충 (현재 0명)

### 데이터 갱신 방법

1. `src/data/rosters/2026/teams/<팀>.ts` 또는 `farm/<팀>.ts` 수정
2. `npm run validate:rosters && npm run roster:report` 실행
3. OVR 이상치·팀 간 편차 경고 확인 후 `targetOvr` 또는 `sourceStats` 조정
4. `npm run regression:check` 로 승하향·시뮬·드래프트 회귀 확인

## 세이브 버전

| 버전 | 변경 |
|------|------|
| v7 | `realPlayerId`, `dataSeason`, `isGenerated` 선수 메타데이터 |
| v6 이하 | 로드 시 v7로 마이그레이션 (기존 세이브 유지, 신규 필드 기본값) |

**정책:** 구 세이브는 강제 삭제하지 않음. `(퓨처스)` 접두·`isGenerated` 로 생성 선수 구분.

## 비공식 고지

본 프로젝트는 **팬메이드** 비영리 시뮬레이션입니다. KBO·구단·선수명과 무관하며, 능력치는 추정치를 포함합니다. 상업적 이용·실제 리그 데이터 재배포 시 해당 권리자 정책을 따르세요.
