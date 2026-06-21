import type {
  AtBatOutcome,
  FieldPosition,
  GameBoxScore,
  GameResult,
  InningScore,
  PlayLog,
  Player,
  ScheduledGame,
  Team,
} from '../types/game'
import { FIELD_POSITIONS } from '../types/game'
import { isPitcher } from './generator'
import {
  recordPitcherRuns,
  recordPlateAppearance,
  recordRunsScored,
  applyBoxScoreToPlayers,
} from './statsAccumulator'

function rosterForSim(team: Team, level: 'first' | 'farm' = 'first'): Player[] {
  const hasLevels = team.players.some((p) => p.rosterLevel === 'farm')
  if (!hasLevels) return team.players
  return team.players.filter((p) => (p.rosterLevel ?? 'first') === level)
}

function teamRoster(team: Team, level: 'first' | 'farm' = 'first'): Team {
  return { ...team, players: rosterForSim(team, level) }
}

function rand() {
  return Math.random()
}

function pickPitcher(team: Team, rotationIndex: number, inning: number): Player {
  const pool = team.players
  const starters = pool.filter((p) => p.role === 'SP')
  const relievers = pool.filter((p) => p.role === 'RP')

  if (inning <= 6 && starters.length > 0) {
    return starters[rotationIndex % starters.length]!
  }
  if (relievers.length > 0) {
    return relievers[Math.min(inning - 7, relievers.length - 1)] ?? relievers[0]!
  }
  return starters[0]!
}

function isStarterPitcher(team: Team, pitcher: Player, rotationIndex: number, inning: number) {
  const starters = team.players.filter((p) => p.role === 'SP')
  if (inning <= 6 && starters.length > 0) {
    return pitcher.id === starters[rotationIndex % starters.length]!.id
  }
  return false
}

function battingOrder(team: Team, lineup?: Record<FieldPosition, string>): Player[] {
  const pool = team.players
  if (lineup) {
    return FIELD_POSITIONS.map((pos) => {
      const id = lineup[pos]
      return pool.find((p) => p.id === id) ?? pool.find((p) => !isPitcher(p))!
    }).filter(Boolean)
  }
  return pool.filter((p) => !isPitcher(p)).slice(0, 9)
}

function resolveAtBat(batter: Player, pitcher: Player): AtBatOutcome {
  const contactSkill = batter.contact * (1 - batter.fatigue / 200)
  const powerSkill = batter.power * (1 - batter.fatigue / 200)
  const eyeSkill = batter.eye
  const pitchSkill = (pitcher.control + pitcher.movement + pitcher.velocity) / 3

  const kRate = clamp((pitchSkill - contactSkill * 0.6) / 180, 0.08, 0.32)
  const bbRate = clamp((eyeSkill - pitcher.control * 0.5) / 200, 0.04, 0.14)

  const r = rand()
  if (r < kRate) return 'strikeout'
  if (r < kRate + bbRate) return 'walk'

  const contactRoll = rand() * 100
  const contactThreshold = clamp(55 - (contactSkill - pitchSkill) * 0.25, 18, 62)

  if (contactRoll > contactThreshold) return 'out'

  const powerRoll = rand() * 100
  const hrThreshold = clamp(96 - powerSkill * 0.35, 88, 99)
  if (powerRoll > hrThreshold) return 'homerun'

  const extraBase = rand() * 100
  if (extraBase > 94 - powerSkill * 0.08) return 'triple'
  if (extraBase > 82 - powerSkill * 0.12) return 'double'
  return 'single'
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

interface RunnerState {
  first: boolean
  second: boolean
  third: boolean
}

function advanceRunners(state: RunnerState, outcome: AtBatOutcome): { runs: number; state: RunnerState } {
  let runs = 0
  const next: RunnerState = { first: false, second: false, third: false }

  if (outcome === 'walk') {
    if (state.first && state.second && state.third) runs++
    next.third = state.second || state.third
    next.second = state.first || state.second
    next.first = true
    if (state.first && state.second && state.third) {
      next.third = true
      next.second = true
      next.first = true
    } else if (state.first && state.second) {
      next.third = true
      next.second = true
      next.first = true
    } else if (state.first) {
      next.second = true
      next.first = true
    } else {
      next.first = true
    }
    return { runs, state: next }
  }

  if (outcome === 'single') {
    if (state.third) runs++
    next.third = state.second
    next.second = state.first
    next.first = true
    return { runs, state: next }
  }

  if (outcome === 'double') {
    if (state.third) runs++
    if (state.second) runs++
    next.third = state.first
    next.second = true
    return { runs, state: next }
  }

  if (outcome === 'triple') {
    runs += [state.first, state.second, state.third].filter(Boolean).length
    next.third = true
    return { runs, state: next }
  }

  if (outcome === 'homerun') {
    runs += 1 + [state.first, state.second, state.third].filter(Boolean).length
    return { runs, state: next }
  }

  if (outcome === 'out' && rand() < 0.12 && state.third) {
    runs++
    next.second = state.second
    next.first = state.first
    return { runs, state: next }
  }

  return { runs, state }
}

function calcRbi(outcome: AtBatOutcome, runs: number): number {
  if (outcome === 'homerun') return runs
  if (['single', 'double', 'triple', 'walk', 'out', 'sacrifice'].includes(outcome)) return runs
  return 0
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

export interface SimOptions {
  homeLineup?: Record<FieldPosition, string>
  awayLineup?: Record<FieldPosition, string>
  homeRotationIndex?: number
  awayRotationIndex?: number
  skipLogs?: boolean
  rosterLevel?: 'first' | 'farm'
}

function playHalfInning(
  inning: number,
  half: 'top' | 'bottom',
  battingTeam: Player[],
  pitchingTeam: Team,
  rotIndex: number,
  box: GameBoxScore,
  logs: PlayLog[],
): number {
  let outs = 0
  let runners: RunnerState = { first: false, second: false, third: false }
  let runs = 0
  let idx = 0
  const pitcher = pickPitcher(pitchingTeam, rotIndex, inning)
  const pitcherGs = isStarterPitcher(pitchingTeam, pitcher, rotIndex, inning)

  while (outs < 3) {
    const batter = battingTeam[idx % battingTeam.length]!
    const outcome = resolveAtBat(batter, pitcher)
    if (outcome === 'out' || outcome === 'strikeout') outs++

    const { runs: scored, state } = advanceRunners(runners, outcome)
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
    })
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
  const innings: InningScore[] = Array.from({ length: 9 }, () => ({}))
  let homeTotal = 0
  let awayTotal = 0
  const homeRot = options.homeRotationIndex ?? 0
  const awayRot = options.awayRotationIndex ?? 0

  const homeOrder = battingOrder(homeTeam, options.homeLineup)
  const awayOrder = battingOrder(awayTeam, options.awayLineup)

  const awayStarter = pickPitcher(homeTeam, homeRot, 1)
  const homeStarter = pickPitcher(awayTeam, awayRot, 1)

  const box: GameBoxScore = {
    batters: {},
    pitchers: {},
    awayStarterId: awayStarter.id,
    homeStarterId: homeStarter.id,
  }

  for (let inning = 1; inning <= 9; inning++) {
    const awayRuns = playHalfInning(inning, 'top', awayOrder, homeTeam, homeRot, box, logs)
    innings[inning - 1]!.top = awayRuns
    awayTotal += awayRuns

    const homeRuns = playHalfInning(inning, 'bottom', homeOrder, awayTeam, awayRot, box, logs)
    innings[inning - 1]!.bottom = homeRuns
    homeTotal += homeRuns
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
    boxScore: box,
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
