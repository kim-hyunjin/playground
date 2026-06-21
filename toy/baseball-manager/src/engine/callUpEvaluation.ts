import type { Player, Team } from '../types/game'
import { coachByRole } from './coachGenerator'
import { isPitcher, overallRating } from './generator'
import { calcWoba } from './sabermetrics'
import { farmPlayers, firstTeamPlayers } from './roster'

export interface CallUpEvaluation {
  score: number
  eligible: boolean
  reason?: string
}

export function weakestAtPosition(team: Team, role: Player['role']): number {
  const pool = firstTeamPlayers(team).filter((p) => p.role === role)
  if (pool.length === 0) return 0
  return Math.min(...pool.map(overallRating))
}

export function farmPerformanceScore(player: Player): number {
  if (isPitcher(player)) {
    const s = player.farmSeasonStats
    if (s.type !== 'pitcher' || s.outs === 0) return 0
    return Math.max(0, 60 - s.er * 3 + s.k * 0.5)
  }
  const s = player.farmSeasonStats
  if (s.type !== 'batter' || s.pa < 8) return 0
  return calcWoba(s) * 100
}

/** UI 배지·필터용 — 랜덤 스카우트 롤 없이 결정적 판정 */
export function evaluateCallUpCandidate(team: Team, player: Player): CallUpEvaluation {
  if (player.rosterLevel !== 'farm' || player.age > 29) {
    return { score: 0, eligible: false }
  }

  const farmCoach = coachByRole(team.coaches ?? [], 'farm')
  const ovr = overallRating(player)
  const posWeak = weakestAtPosition(team, player.role)
  const perf = farmPerformanceScore(player)
  const scoutBonus = farmCoach ? farmCoach.scouting * 0.2 : 0

  let score = ovr + perf * 0.4 + scoutBonus
  let reason: string | undefined

  if (ovr >= posWeak + 4) {
    score += 15
    reason = '1군 동일 포지션보다 우수'
  } else if (perf > 35 && ovr >= 58) {
    score += 10
    reason = '2군 성적 우수'
  } else if (player.age <= 23 && ovr >= 55 && ovr >= posWeak) {
    score += 8
    reason = '유망주 육성 대상'
  } else {
    return { score, eligible: false }
  }

  return { score, eligible: true, reason }
}

export function isProspect(player: Player): boolean {
  return player.age <= 24
}

export function isRehabCandidate(player: Player): boolean {
  return player.rosterLevel === 'farm' && player.fatigue >= 50
}

export function callUpCandidateIds(
  team: Team,
  suggestionPlayerIds: string[] = [],
): Set<string> {
  const ids = new Set(suggestionPlayerIds)
  for (const p of farmPlayers(team)) {
    if (evaluateCallUpCandidate(team, p).eligible) ids.add(p.id)
  }
  return ids
}
