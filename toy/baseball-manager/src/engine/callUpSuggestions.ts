import type { CallUpSuggestion, GameState } from '../types/game'
import { COACH_ROLE_LABEL, POSITION_LABEL } from '../types/game'
import { coachByRole } from './coachGenerator'
import {
  evaluateCallUpCandidate,
  farmPerformanceScore,
  weakestAtPosition,
} from './callUpEvaluation'
import { overallRating } from './generator'
import { countByLevel, farmPlayers, FIRST_TEAM_MAX } from './roster'
import type { Player } from '../types/game'

export function generateCallUpSuggestions(state: GameState): CallUpSuggestion[] {
  const team = state.teams.find((t) => t.id === state.userTeamId)
  if (!team) return []

  const farmCoach = coachByRole(team.coaches ?? [], 'farm')
  if (!farmCoach) return []
  if (countByLevel(team, 'first') >= FIRST_TEAM_MAX) return []

  const scoutingThreshold = 100 - farmCoach.scouting
  const existingIds = new Set(state.callUpSuggestions.map((s) => s.playerId))

  const candidates: { player: Player; score: number; reason: string }[] = []

  for (const player of farmPlayers(team)) {
    if (existingIds.has(player.id)) continue

    const evaluation = evaluateCallUpCandidate(team, player)
    if (!evaluation.eligible || !evaluation.reason) continue

    const ovr = overallRating(player)
    const posWeak = weakestAtPosition(team, player.role)
    const perf = farmPerformanceScore(player)
    const scoutRoll = Math.random() * 100

    if (scoutRoll < scoutingThreshold && ovr < 52) continue

    let reason = `${farmCoach.name}(${COACH_ROLE_LABEL.farm}): ${player.name}(${POSITION_LABEL[player.role]}) — ${evaluation.reason}`
    if (evaluation.reason === '1군 동일 포지션보다 우수') {
      reason = `${farmCoach.name}(${COACH_ROLE_LABEL.farm}): ${player.name}(${POSITION_LABEL[player.role]}) OVR ${ovr} — 1군 동일 포지션(${posWeak})보다 우수`
    } else if (evaluation.reason === '2군 성적 우수') {
      reason = `${farmCoach.name}: 2군 ${player.name} 활약 중(2군 기록 우수) — 1군 콜업 검토`
    } else if (evaluation.reason === '유망주 육성 대상') {
      reason = `${farmCoach.name}: 유망주 ${player.name}(${player.age}세) 육성 목표 — 1군 경험 필요`
    }

    candidates.push({ player, score: evaluation.score + perf * 0.01, reason })
  }

  return candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ player, reason }) => ({
      id: crypto.randomUUID(),
      week: state.currentWeek,
      playerId: player.id,
      coachId: farmCoach.id,
      coachName: farmCoach.name,
      reason,
    }))
}

export function mergeCallUpSuggestions(
  existing: CallUpSuggestion[],
  incoming: CallUpSuggestion[],
  max = 5,
): CallUpSuggestion[] {
  const ids = new Set(existing.map((s) => s.playerId))
  const merged = [...existing]
  for (const s of incoming) {
    if (ids.has(s.playerId)) continue
    merged.push(s)
    ids.add(s.playerId)
  }
  return merged.slice(-max)
}

export { evaluateCallUpCandidate, isProspect, isRehabCandidate, callUpCandidateIds } from './callUpEvaluation'
