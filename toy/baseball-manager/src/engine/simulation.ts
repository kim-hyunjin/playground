import type {
  AtBatOutcome,
  FieldPosition,
  GameBoxScore,
  GameResult,
  GameSituation,
  InningScore,
  PlayLog,
  Player,
  ScheduledGame,
  Team,
  BullpenStrategy,
  ManagerCommand,
} from '../types/game'
import { FIELD_POSITIONS } from '../types/game'
import { parkForTeamAbbr } from '../data/parks/kbo2026'
import { isPitcher } from './generator'
import {
  recordPitcherRuns,
  recordPlateAppearance,
  recordRunsScored,
  recordStolenBase,
  applyBoxScoreToPlayers,
} from './statsAccumulator'
import { resolveAtBat, teamDefenseFielding } from './sim/atBat'
import { isStarterPitcher, pickPitcher, recordPitchCount } from './sim/bullpen'
import { createSimContext, type SimLeagueLevel } from './sim/context'
import { ensureHandedness } from './sim/handedness'
import {
  advanceRunners,
  calcRbi,
  emptyRunners,
  tryStealAttempt,
  type RunnerState,
} from './sim/runners'
import { isPlayerAvailable } from './injury'
import { pickSavePitcher } from './rosterAvailability'

function rosterForSim(team: Team, level: SimLeagueLevel = 'first'): Player[] {
  const hasLevels = team.players.some((p) => p.rosterLevel === 'farm')
  if (!hasLevels) return team.players
  return team.players.filter((p) => (p.rosterLevel ?? 'first') === level)
}

function teamRoster(team: Team, level: SimLeagueLevel = 'first'): Team {
  return { ...team, players: rosterForSim(team, level) }
}

function battingOrder(team: Team, lineup?: Record<FieldPosition, string>): Player[] {
  const pool = team.players.filter(isPlayerAvailable)
  if (lineup) {
    return FIELD_POSITIONS.map((pos) => {
      const id = lineup[pos]
      return pool.find((p) => p.id === id) ?? pool.find((p) => !isPitcher(p))!
    }).filter(Boolean)
  }
  return pool.filter((p) => !isPitcher(p)).slice(0, 9)
}

const OUTCOME_TEXT: Record<AtBatOutcome, (b: string) => string> = {
  strikeout: (b) => `${b} 삼진`,
  walk: (b) => `${b} 볼넷`,
  single: (b) => `${b} 안타`,
  double: (b) => `${b} 2루타`,
  triple: (b) => `${b} 3루타`,
  homerun: (b) => `${b} 홈런!`,
  out: (b) => `${b} 아웃`,
  sacrifice: (b) => `${b} 희생번트`,
  error: (b) => `${b} 실책 출루`,
}

export function cpuManagerCommand(
  inning: number,
  outs: number,
  runners: RunnerState,
  scoreDiff: number,
): ManagerCommand {
  const lateClose = inning >= 7 && Math.abs(scoreDiff) <= 2
  const offense = lateClose && outs < 2 && Boolean(runners.firstId) ? 'bunt'
    : Boolean(runners.firstId) && !runners.secondId && outs < 2 ? 'steal'
      : scoreDiff < -2 ? 'aggressive' : 'normal'
  const pitching = inning >= 8 && scoreDiff > 0 ? 'nibble'
    : scoreDiff < -2 ? 'challenge' : 'normal'
  return { offense, pitching }
}

export interface SimOptions {
  homeLineup?: Record<FieldPosition, string>
  awayLineup?: Record<FieldPosition, string>
  homeRotationIndex?: number
  awayRotationIndex?: number
  skipLogs?: boolean
  rosterLevel?: SimLeagueLevel
  /** 테스트·저장 경기 재현을 위한 난수 공급자 */
  random?: () => number
  homeBullpenStrategy?: BullpenStrategy
  awayBullpenStrategy?: BullpenStrategy
  homeCommand?: ManagerCommand
  awayCommand?: ManagerCommand
}

function playHalfInning(
  inning: number,
  half: 'top' | 'bottom',
  battingTeam: Player[],
  pitchingTeam: Team,
  rotIndex: number,
  leagueLevel: SimLeagueLevel,
  homeAbbr: string,
  box: GameBoxScore,
  logs: PlayLog[],
  pitchCounts: Map<string, number>,
  battingScore: number,
  pitchingScore: number,
  random: () => number,
  bullpenStrategy?: BullpenStrategy,
  battingCommand?: ManagerCommand,
  pitchingCommand?: ManagerCommand,
): number {
  let outs = 0
  let runners: RunnerState = emptyRunners()
  let runs = 0
  let idx = 0
  const pitchingLead = pitchingScore - battingScore
  const ctx = createSimContext(leagueLevel, parkForTeamAbbr(homeAbbr), inning, half)
  const defenseFielding = teamDefenseFielding(pitchingTeam.players)

  const situation = (
    currentOuts: number,
    currentRunners: RunnerState,
    currentRuns: number,
    batterId?: string,
    pitcherId?: string,
  ): GameSituation => ({
    inning,
    half,
    outs: currentOuts,
    runners: {
      firstId: currentRunners.firstId,
      secondId: currentRunners.secondId,
      thirdId: currentRunners.thirdId,
    },
    homeScore: half === 'bottom' ? battingScore + currentRuns : pitchingScore,
    awayScore: half === 'top' ? battingScore + currentRuns : pitchingScore,
    batterId,
    pitcherId,
  })

  while (outs < 3) {
    const scoreDiff = battingScore + runs - pitchingScore
    const offenseCommand = battingCommand ?? cpuManagerCommand(inning, outs, runners, scoreDiff)
    const defenseCommand = pitchingCommand ?? cpuManagerCommand(inning, outs, runners, -scoreDiff)
    const batter = ensureHandedness(battingTeam[idx % battingTeam.length]!)
    const pitcher = ensureHandedness(
      pickPitcher(pitchingTeam, {
        inning,
        rotationIndex: rotIndex,
        pitchingLead,
        batterHand: batter.bats,
        pitchCounts,
        strategy: bullpenStrategy,
      }),
    )

    const runnerSpeed =
      runners.firstId != null
        ? battingTeam.find((p) => p.id === runners.firstId)?.speed ?? batter.speed
        : batter.speed

    const steal = tryStealAttempt(runners, runnerSpeed, pitcher.control, outs, random, offenseCommand.offense === 'steal')
    if (steal.stolen && steal.stealerId) {
      const beforeSteal = situation(outs, runners, runs, batter.id, pitcher.id)
      runners = steal.state
      recordStolenBase(box, steal.stealerId)
      logs.push({
        inning,
        half,
        text: `${battingTeam.find((p) => p.id === steal.stealerId)?.name ?? '주자'} 도루 성공`,
        outcome: 'single',
        runsScored: 0,
        batterId: steal.stealerId,
        pitcherId: pitcher.id,
        rbi: 0,
        eventType: 'stolenBase',
        situationBefore: beforeSteal,
        situationAfter: situation(outs, runners, runs, batter.id, pitcher.id),
      })
    }

    const pitcherGs = isStarterPitcher(pitchingTeam, pitcher, rotIndex, inning)
    const managedBatter = offenseCommand.offense === 'patient' ? { ...batter, eye: Math.min(99, batter.eye + 8), power: Math.max(1, batter.power - 4) }
      : offenseCommand.offense === 'aggressive' ? { ...batter, power: Math.min(99, batter.power + 7), eye: Math.max(1, batter.eye - 7) } : batter
    const managedPitcher = defenseCommand.pitching === 'challenge' ? { ...pitcher, velocity: Math.min(99, pitcher.velocity + 5), control: Math.min(99, pitcher.control + 3), movement: Math.max(1, pitcher.movement - 3) }
      : defenseCommand.pitching === 'nibble' ? { ...pitcher, movement: Math.min(99, pitcher.movement + 5), control: Math.max(1, pitcher.control - 6) } : pitcher
    const forceWalk = defenseCommand.pitching === 'intentionalWalk' && runners.firstId === undefined
    const forceBunt = offenseCommand.offense === 'bunt' && outs < 2 && Boolean(runners.firstId || runners.secondId)
    const outcome = forceWalk ? 'walk' : forceBunt && random() < 0.72 ? 'sacrifice' : resolveAtBat(
      managedBatter,
      managedPitcher,
      ctx,
      random,
      { outs, runners },
      defenseFielding,
    )
    recordPitchCount(pitchCounts, pitcher.id, outcome === 'walk' ? 4 : 1)

    const situationBefore = situation(outs, runners, runs, batter.id, pitcher.id)
    if (outcome === 'out' || outcome === 'strikeout' || outcome === 'sacrifice') outs++

    const { runs: scored, state } = advanceRunners(runners, outcome, batter.id, random)
    const rbi = calcRbi(outcome, scored)

    recordPlateAppearance(box, batter.id, pitcher.id, outcome, rbi, pitcherGs)
    recordRunsScored(box, batter.id, scored, outcome)
    if (scored > 0) recordPitcherRuns(box, pitcher.id, scored)

    runs += scored
    runners = state

    logs.push({
      inning,
      half,
      text: OUTCOME_TEXT[outcome](batter.name) + (scored > 0 ? ` (${scored}득점)` : ''),
      outcome,
      runsScored: scored,
      batterId: batter.id,
      pitcherId: pitcher.id,
      rbi,
      eventType: 'plateAppearance',
      situationBefore,
      situationAfter: situation(outs, runners, runs, batter.id, pitcher.id),
    })

    if (half === 'bottom' && inning >= 9 && battingScore + runs > pitchingScore) break
    idx++
  }

  return runs
}

export function simulateGame(
  game: ScheduledGame,
  home: Team,
  away: Team,
  options: SimOptions = {},
): GameResult {
  const level = options.rosterLevel ?? 'first'
  const homeTeam = teamRoster(home, level)
  const awayTeam = teamRoster(away, level)
  const logs: PlayLog[] = []
  const innings: InningScore[] = []
  let homeTotal = 0
  let awayTotal = 0
  const homeRot = options.homeRotationIndex ?? 0
  const awayRot = options.awayRotationIndex ?? 0

  const homeOrder = battingOrder(homeTeam, options.homeLineup)
  const awayOrder = battingOrder(awayTeam, options.awayLineup)
  const random = options.random ?? Math.random

  const awayStarter = pickPitcher(homeTeam, {
    inning: 1,
    rotationIndex: homeRot,
    pitchingLead: 0,
    pitchCounts: new Map(),
  })
  const homeStarter = pickPitcher(awayTeam, {
    inning: 1,
    rotationIndex: awayRot,
    pitchingLead: 0,
    pitchCounts: new Map(),
  })

  const box: GameBoxScore = {
    batters: {},
    pitchers: {},
    awayStarterId: awayStarter.id,
    homeStarterId: homeStarter.id,
  }

  const pitchCounts = new Map<string, number>()
  const MAX_INNINGS = 15

  for (let inning = 1; inning <= MAX_INNINGS; inning++) {
    const awayRuns = playHalfInning(
      inning,
      'top',
      awayOrder,
      homeTeam,
      homeRot,
      level,
      home.abbr,
      box,
      logs,
      pitchCounts,
      awayTotal,
      homeTotal,
      random,
      options.homeBullpenStrategy,
      options.awayCommand,
      options.homeCommand,
    )
    innings[inning - 1] ??= {}
    innings[inning - 1]!.top = awayRuns
    awayTotal += awayRuns

    const homeRuns = playHalfInning(
      inning,
      'bottom',
      homeOrder,
      awayTeam,
      awayRot,
      level,
      home.abbr,
      box,
      logs,
      pitchCounts,
      homeTotal,
      awayTotal,
      random,
      options.awayBullpenStrategy,
      options.homeCommand,
      options.awayCommand,
    )
    innings[inning - 1]!.bottom = homeRuns
    homeTotal += homeRuns

    if (inning >= 9 && homeTotal !== awayTotal) break
  }

  if (homeTotal === awayTotal) {
    homeTotal += 1
  }

  const homeWon = homeTotal > awayTotal
  box.winningPitcherId = homeWon ? box.homeStarterId : box.awayStarterId
  box.losingPitcherId = homeWon ? box.awayStarterId : box.homeStarterId
  const saveId = pickSavePitcher(box, box.winningPitcherId)
  if (saveId) {
    box.savePitcherId = saveId
    const saveLine = box.pitchers[saveId]
    if (saveLine) saveLine.saves = 1
  }

  return {
    gameId: game.id,
    homeId: game.homeId,
    awayId: game.awayId,
    homeScore: homeTotal,
    awayScore: awayTotal,
    innings,
    logs: options.skipLogs ? [] : logs,
    week: game.week,
    day: game.day,
    boxScore: box,
    parkAbbr: home.abbr,
    parkStadium: home.stadium,
  }
}

export function applyResult(
  teams: Team[],
  schedule: ScheduledGame[],
  result: GameResult,
): { teams: Team[]; schedule: ScheduledGame[] } {
  const { boxScore } = result

  const newTeams = teams.map((t) => {
    const isHome = t.id === result.homeId
    const isAway = t.id === result.awayId
    if (!isHome && !isAway) return t

    const scored = isHome ? result.homeScore : result.awayScore
    const allowed = isHome ? result.awayScore : result.homeScore
    const win = scored > allowed

    const starterId = isHome ? boxScore.homeStarterId : boxScore.awayStarterId

    return {
      ...t,
      wins: t.wins + (win ? 1 : 0),
      losses: t.losses + (win ? 0 : 1),
      runsScored: t.runsScored + scored,
      runsAllowed: t.runsAllowed + allowed,
      players: applyBoxScoreToPlayers(t.players, boxScore, win, !win, starterId),
    }
  })

  const newSchedule = schedule.map((g) =>
    g.id === result.gameId
      ? { ...g, played: true, homeScore: result.homeScore, awayScore: result.awayScore }
      : g,
  )

  return { teams: newTeams, schedule: newSchedule }
}

export function simulateCpuGames(
  schedule: ScheduledGame[],
  teams: Team[],
  week: number,
  userTeamId: string,
): { results: GameResult[]; teams: Team[]; schedule: ScheduledGame[] } {
  const weekGames = schedule.filter(
    (g) => g.week === week && !g.played && g.homeId !== userTeamId && g.awayId !== userTeamId,
  )

  let currentTeams = teams
  let currentSchedule = schedule
  const results: GameResult[] = []

  for (const game of weekGames) {
    const home = currentTeams.find((t) => t.id === game.homeId)!
    const away = currentTeams.find((t) => t.id === game.awayId)!
    const result = simulateGame(game, home, away)
    results.push(result)
    const applied = applyResult(currentTeams, currentSchedule, result)
    currentTeams = applied.teams
    currentSchedule = applied.schedule
  }

  return { results, teams: currentTeams, schedule: currentSchedule }
}

// Re-export for tests / sanity scripts
export { LEAGUE_STRENGTH, createSimContext } from './sim/context'
export { resolveAtBat } from './sim/atBat'
export { parkForTeamAbbr, PARKS_2026 } from '../data/parks/kbo2026'
