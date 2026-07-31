# Baseball Manager ⚾

풋볼매니저 스타일의 **야구 감독 시뮬레이션** 게임입니다.

## 기능

- **10개 구단** 중 하나를 선택해 18주 정규시즌 진행
- **1군·2군** 분리 로스터, 승격·하향, 별도 2군 리그 시뮬
- **선수 데이터** — `src/data/players.csv` 단일 파일 (로스터·드래프트·FA)
- **스쿼드 관리** — 선수 능력치, 피로도, 부상·재활, 육성(potential/XP)
- **라인업·로테이션** 편성
- **경기 시뮬레이션** — 이닝·점수·아웃·주자·타자·투수를 확인하는 타석 단위 진행
- **감독 작전** — 번트·도루·고의사구·타격/투구 성향, 대타·대주자·투수 교체
- **불펜 전략** — 선발 투구 한계, 셋업·마무리 이닝, 좌완 매치업 설정
- **이적·트레이드** — 정규시즌 중 타 구단 영입·1~3명 교환
- **계약 협상** — 선수·코치 다년 계약, 역제안·결렬, FA/코치 시장 연동
- **스토브리그** — FA 영입, 신인 드래프트, 시즌 리셋
- **자동 저장** — 웹에서는 브라우저 localStorage, 데스크톱에서는 WebView2 앱 전용 저장소
- **Windows 데스크톱 앱** — Tauri 2 기반 NSIS·MSI 설치 파일
- **라이트·다크 모드** — 시스템 설정을 기본으로 사용하고 선택한 테마를 브라우저에 저장

## 경기 조작

- 경기 전 기본 작전을 선택하고 `경기 시작`을 누릅니다.
- 경기 중 현재 이닝·아웃·주자·타자·투수를 확인한 뒤 작전 버튼을 누르면 진행을 끊지 않고 다음 미진행 타석부터 즉시 반영됩니다.
- 불펜, 대타, 대주자 교체도 정지 상태에서 지시할 수 있습니다.
- 기본 수동 진행에서는 `다음 투구` 버튼 또는 스페이스바를 눌러 투구 하나씩 진행합니다.
- 자동 진행으로 전환하면 속도는 0.5×·1×·2×이며 배속 버튼 옆에서 일시정지하거나 계속 진행할 수 있습니다.
- 진행 중 경기 세션은 별도 자동 저장되며 새로고침 후 이어서 재생할 수 있습니다.
- 시작 화면 우측 상단 또는 게임 메뉴 하단에서 라이트·다크 모드를 전환할 수 있습니다.

## 실행

```bash
cd toy/baseball-manager
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### Windows 데스크톱 앱

사전 요구사항:

- Node.js 24 이상
- Rust stable (`rustup`, `cargo`)
- Microsoft C++ Build Tools와 WebView2

```bash
cd toy/baseball-manager
npm install
npm run desktop:dev       # Tauri 개발 창 실행
npm run desktop:build     # NSIS .exe와 MSI 설치 파일 생성
npm run desktop:info      # 로컬 Tauri 개발 환경 확인
```

설치 파일은 `src-tauri/target/release/bundle` 아래에 생성됩니다. 데스크톱
자동 저장은 Windows 사용자별 WebView2 데이터 디렉터리에 보관되어 브라우저
버전의 저장 데이터와 분리됩니다.

## 빌드·검증

```bash
npm run build              # 프로덕션 빌드
npm run validate:rosters   # CSV 로스터 스키마·인원 검증
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
| 계약 협상 | `negotiations.ts`, `ContractNegotiationPanel` |
| 경기 교체 | `substitutions.ts`, `GameManagementPanel` |
| 실시간 작전 | `gameSession.ts`, `ManagerTacticsPanel` |
| 부상·재활 | `injury.ts` — 2군 회복 2일/주, 대시보드 재활 배치 |

기존 저장 데이터에는 불펜·작전·협상 정보와 코치 계약 기간이 없을 수 있습니다. 로드 시 안전한 기본값으로 자동 보완됩니다.

## 선수 데이터 (CSV)

모든 선수 정보는 **`src/data/players.csv`** 한 파일에서 관리합니다. 팀별 로스터는 나중에 직접 지정하면 됩니다.

| `pool` | 의미 |
|--------|------|
| `roster` | 구단 로스터 (`teamAbbr`, `rosterLevel` = `first` \| `farm`) |
| `draft` | 드래프트 실명 유맹주 풀 |
| `fa` | 외부 FA 실명 풀 |

컬럼 정의: `src/data/playersCsvSchema.ts`  
로드: `src/data/csvPlayerLoader.ts`, `src/data/playerDataset.ts`, `src/data/rosterLoader.ts`

향후 SQLite 등 DB로 마이그레이션할 예정입니다.

```bash
npm run validate:rosters   # 편집 후 검증
```

## 비공식 고지

본 프로젝트는 **팬메이드** 비영리 시뮬레이션입니다. KBO·구단·선수명과 무관하며, 능력치는 추정치를 포함합니다.
