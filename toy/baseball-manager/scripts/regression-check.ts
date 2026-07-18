import './load-csv-shim.ts'
/**
 * Headless regression checks for core game flows (no browser).
 * Run: npm run regression:check
 */
import { DATA_SEASON, loadLeague2026, validateAllRosters } from '../src/data/rosterLoader'
import { getDraftRecords, getFaRecords } from '../src/data/playerDataset'
import { generateProspectPool } from '../src/engine/draft'
import {
  defaultLineup,
  defaultRotation,
  overallRating,
} from '../src/engine/generator'
import { simulateFarmWeek } from '../src/engine/farmSimulation'
import { generateFarmSchedule, generateSchedule } from '../src/engine/schedule'
import {
  canPromote,
  countByLevel,
  demotePlayerInTeam,
  FIRST_TEAM_MAX,
  FARM_TEAM_MAX,
  promotePlayerInTeam,
  validateFarmRoster,
  validateFirstTeamRoster,
} from '../src/engine/roster'
import { simulateCpuGames, simulateGame } from '../src/engine/simulation'
import { buildStoveLeagueState } from '../src/engine/stoveLeague'
import type { GameState } from '../types/game'

let passed = 0
let failed = 0

function ok(label: string) {
  passed++
  console.log(`  ✓ ${label}`)
}

function assert(cond: boolean, label: string): asserts cond {
  if (!cond) {
    failed++
    console.error(`  ✗ ${label}`)
    throw new Error(label)
  }
  ok(label)
}

function section(title: string) {
  console.log(`\n── ${title}`)
}

try {
  section('Roster validation')
  const validation = validateAllRosters()
  assert(validation.ok, `validateAllRosters (${validation.errors.length} errors)`)

  section('League load (2026)')
  const teams = loadLeague2026(0)
  assert(teams.length === 10, '10 teams loaded')

  for (const team of teams) {
    const first = countByLevel(team, 'first')
    const farm = countByLevel(team, 'farm')
    assert(first === FIRST_TEAM_MAX, `${team.abbr} 1군 ${FIRST_TEAM_MAX}명`)
    assert(farm >= 28 && farm <= FARM_TEAM_MAX, `${team.abbr} 2군 ${farm}명 (28~${FARM_TEAM_MAX})`)

    const firstVal = validateFirstTeamRoster(team)
    assert(firstVal.valid, `${team.abbr} validateFirstTeamRoster`)

    const farmVal = validateFarmRoster(team)
    assert(farmVal.valid, `${team.abbr} validateFarmRoster`)
  }

  section('Player metadata (real roster)')
  const userTeam = teams[0]!
  const realFirst = userTeam.players.filter(
    (p) => p.rosterLevel === 'first' && !p.isGenerated,
  )
  assert(realFirst.length === FIRST_TEAM_MAX, '1군 실명 선수 전원 비생성')
  assert(
    realFirst.every((p) => p.dataSeason === DATA_SEASON && p.realPlayerId === p.id),
    '1군 실명 dataSeason·realPlayerId',
  )
  assert(
    userTeam.players.every((p) => !p.isGenerated || p.name.startsWith('(퓨처스)')),
    '생성 선수는 (퓨처스) 접두 또는 isGenerated',
  )

  section('Lineup / rotation (1군 only)')
  const lineup = defaultLineup(userTeam)
  const rotation = defaultRotation(userTeam)
  const firstIds = new Set(
    userTeam.players.filter((p) => p.rosterLevel === 'first').map((p) => p.id),
  )
  for (const id of Object.values(lineup)) {
    assert(firstIds.has(id), `lineup slot uses 1군 선수 (${id})`)
  }
  for (const id of rotation) {
    assert(firstIds.has(id), `rotation uses 1군 투수 (${id})`)
  }

  section('Promote / demote')
  const firstPlayer = userTeam.players.find((p) => p.rosterLevel === 'first')!
  const farmPlayer = userTeam.players.find((p) => p.rosterLevel === 'farm')!

  assert(!canPromote(userTeam) || countByLevel(userTeam, 'first') < FIRST_TEAM_MAX, '1군 정원 시 canPromote=false')

  const afterDemote = demotePlayerInTeam(userTeam, firstPlayer.id)
  assert(afterDemote !== null, '1군 → 2군 하향')
  assert(canPromote(afterDemote!), '하향 후 승격 가능')

  const afterPromote = promotePlayerInTeam(afterDemote!, farmPlayer.id)
  assert(afterPromote !== null, '2군 → 1군 승격')
  assert(countByLevel(afterPromote!, 'first') === FIRST_TEAM_MAX, '승격 후 1군 정원 유지')

  section('Week simulation (CPU + farm)')
  const schedule = generateSchedule(teams, 18)
  const farmSchedule = generateFarmSchedule(teams, 18)
  const cpu = simulateCpuGames(schedule, teams, 1, userTeam.id)
  assert(cpu.results.length > 0, 'CPU 경기 결과 생성')
  const farm = simulateFarmWeek(farmSchedule, cpu.teams, 1)
  assert(farm.results.length > 0, '2군 경기 결과 생성')

  section('Draft pool')
  const draftRecords = getDraftRecords()
  const pool = generateProspectPool(20)
  assert(pool.length === 20, '드래프트 풀 20명')
  const named = pool.filter((p) => draftRecords.some((r) => r.id === p.id))
  assert(named.length >= Math.min(20, draftRecords.length), '실명 유망주 포함')

  section('Stove league bootstrap')
  const stubState: GameState = {
    userTeamId: userTeam.id,
    teams,
    schedule,
    farmSchedule,
    coachMarket: [],
    callUpSuggestions: [],
    seasonYear: DATA_SEASON,
    phase: 'regular',
    freeAgents: [],
    currentWeek: 18,
    totalWeeks: 18,
    lineup,
    rotation,
    rotationIndex: 0,
    results: [],
    farmResults: [],
    managerName: 'Test',
  }
  const stove = buildStoveLeagueState(stubState)
  assert(stove.phase === 'stove', '스토브리그 phase 전환')
  assert((stove.freeAgents?.length ?? 0) > 0, 'FA 풀 생성')
  assert(stove.draft !== undefined, '드래프트 상태 생성')

  section('Simulation (park + league strength + extras)')
  const parkGame = simulateGame(
    { id: 'reg-park', week: 1, day: 'tue', homeId: userTeam.id, awayId: teams[1]!.id, played: false },
    userTeam,
    teams[1]!,
    { skipLogs: true },
  )
  assert(parkGame.parkAbbr === userTeam.abbr, 'GameResult.parkAbbr = home abbr')
  assert(parkGame.parkStadium === userTeam.stadium, 'GameResult.parkStadium = home stadium')
  assert(parkGame.innings.length >= 9, '최소 9이닝 기록')
  assert(parkGame.homeScore !== parkGame.awayScore, '경기 승패 확정 (동점 타breaker)')

  const situationGame = simulateGame(
    { id: 'reg-situation', week: 1, day: 'wed', homeId: userTeam.id, awayId: teams[1]!.id, played: false },
    userTeam,
    teams[1]!,
  )
  assert(situationGame.logs.length > 0, '상황 스냅샷용 플레이 로그 생성')
  assert(
    situationGame.logs.every((log) => log.situationBefore && log.situationAfter),
    '모든 플레이에 전후 상황 스냅샷',
  )
  assert(
    situationGame.logs.every((log) => {
      const after = log.situationAfter!
      return after.outs >= 0 && after.outs <= 3 && after.inning === log.inning && after.half === log.half
    }),
    '아웃·이닝·초말 상황 범위',
  )
  const finalSituation = situationGame.logs.at(-1)!.situationAfter!
  assert(
    finalSituation.homeScore === situationGame.homeScore && finalSituation.awayScore === situationGame.awayScore,
    '최종 상황 스코어와 경기 결과 일치',
  )

  const withHand = userTeam.players.filter((p) => p.bats && p.throws)
  assert(withHand.length >= FIRST_TEAM_MAX, '1군 선수 투타 정보')

  const farmOnly = userTeam.players.filter((p) => p.rosterLevel === 'farm')
  assert(farmOnly.length >= 28, '2군 28명 이상 (farm sim 대상)')

  section('External FA data pool')
  assert(getFaRecords().length >= 10, '외부 FA 실명 10명 이상')
  console.log(`\n=== Regression: ${passed} passed, ${failed} failed ===`)
  process.exit(failed > 0 ? 1 : 0)
} catch (e) {
  console.error('\nRegression aborted:', e instanceof Error ? e.message : e)
  console.log(`\n=== Regression: ${passed} passed, ${failed + 1} failed ===`)
  process.exit(1)
}
