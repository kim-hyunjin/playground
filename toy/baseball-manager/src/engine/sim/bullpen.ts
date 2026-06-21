import type { Player, Team } from '../../types/game'
import type { Hand } from './handedness'
import { inferThrows } from './handedness'

export interface PickPitcherContext {
  inning: number
  rotationIndex: number
  /** 투수 소속 팀 득점 − 상대 득점 (양수 = 우리가 앞섬) */
  pitchingLead: number
  /** 이번 타석 타자 투타 (platoon·좌완 전문) */
  batterHand?: Hand
  pitchCounts: Map<string, number>
}

const SP_MAX_PITCHES = 95
const RP_MAX_PITCHES = 45

function pitcherRating(p: Player): number {
  return (p.velocity + p.control + p.movement) / 3
}

function classifyRelievers(relievers: Player[]) {
  const sorted = [...relievers].sort((a, b) => pitcherRating(b) - pitcherRating(a))
  const closer = sorted[0]
  const setup = sorted[1]
  const lefties = relievers.filter((p) => inferThrows(p) === 'L')
  return { closer, setup, lefties, sorted }
}

function underPitchLimit(p: Player, pitchCounts: Map<string, number>, max: number): boolean {
  return (pitchCounts.get(p.id) ?? 0) < max
}

function pickFromPool(pool: Player[], pitchCounts: Map<string, number>, max: number): Player | undefined {
  return pool.find((p) => underPitchLimit(p, pitchCounts, max))
}

export function pickPitcher(team: Team, ctx: PickPitcherContext): Player {
  const pool = team.players.filter(isPlayerAvailableForSim)
  const starters = pool.filter((p) => p.role === 'SP')
  const relievers = pool.filter((p) => p.role === 'RP')
  const { closer, setup, lefties, sorted } = classifyRelievers(relievers)

  const saveSituation =
    ctx.inning >= 9 && ctx.pitchingLead >= 1 && ctx.pitchingLead <= 3

  if (saveSituation && closer && underPitchLimit(closer, ctx.pitchCounts, RP_MAX_PITCHES)) {
    return closer
  }

  if (ctx.inning >= 8 && setup && underPitchLimit(setup, ctx.pitchCounts, RP_MAX_PITCHES)) {
    return setup
  }

  if (ctx.batterHand === 'L' && lefties.length > 0) {
    const lefty = pickFromPool(lefties, ctx.pitchCounts, RP_MAX_PITCHES)
    if (lefty) return lefty
  }

  if (ctx.inning <= 6 && starters.length > 0) {
    const sp = starters[ctx.rotationIndex % starters.length]!
    if (underPitchLimit(sp, ctx.pitchCounts, SP_MAX_PITCHES)) return sp
  }

  if (relievers.length > 0) {
    const idx = Math.min(ctx.inning - 1, sorted.length - 1)
    const rp = sorted[idx] ?? sorted[0]!
    if (underPitchLimit(rp, ctx.pitchCounts, RP_MAX_PITCHES)) return rp
    const fallback = pickFromPool(sorted, ctx.pitchCounts, RP_MAX_PITCHES)
    if (fallback) return fallback
  }

  return starters[0] ?? relievers[0] ?? pool[0]!
}

function isPlayerAvailableForSim(p: Player): boolean {
  return !p.injuryDays || p.injuryDays <= 0
}

export function isStarterPitcher(
  team: Team,
  pitcher: Player,
  rotationIndex: number,
  inning: number,
): boolean {
  const starters = team.players.filter((p) => p.role === 'SP')
  if (inning <= 6 && starters.length > 0) {
    return pitcher.id === starters[rotationIndex % starters.length]!.id
  }
  return false
}

export function recordPitchCount(
  pitchCounts: Map<string, number>,
  pitcherId: string,
  pitches = 1,
): void {
  pitchCounts.set(pitcherId, (pitchCounts.get(pitcherId) ?? 0) + pitches)
}

/** @deprecated use pickPitcher(team, ctx) — regression helper */
export function pickPitcherLegacy(team: Team, rotationIndex: number, inning: number): Player {
  return pickPitcher(team, {
    inning,
    rotationIndex,
    pitchingLead: 0,
    pitchCounts: new Map(),
  })
}
