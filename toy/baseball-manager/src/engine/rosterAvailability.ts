import type { FieldPosition, GameBoxScore, Player, Team } from '../types/game'
import { FIELD_POSITIONS } from '../types/game'
import { isPlayerAvailable } from './injury'
import { defaultLineup, defaultRotation, isPitcher } from './generator'

export function availableBatters(players: Player[]): Player[] {
  return players.filter((p) => !isPitcher(p) && isPlayerAvailable(p))
}

export function availableStarters(players: Player[]): Player[] {
  return players.filter((p) => p.role === 'SP' && isPlayerAvailable(p))
}

/** 승리 팀 구원투수 중 가장 많이 던진 선수 — 세이브 후보 */
export function pickSavePitcher(box: GameBoxScore, winningStarterId: string): string | undefined {
  let best: { id: string; outs: number } | undefined
  for (const [id, line] of Object.entries(box.pitchers)) {
    if (id === winningStarterId || line.outs <= 0) continue
    if (!best || line.outs > best.outs) best = { id, outs: line.outs }
  }
  return best?.id
}

export function formatHandedness(p: Player): string {
  const bats = p.bats ?? '?'
  const throws = p.throws ?? '?'
  return `${bats}/${throws}`
}

/** 라인업·로테이션에서 부상/출전 불가 선수 제거 후 빈 슬롯은 가용 선수로 채움 */
export function sanitizeLineup(
  team: Team,
  lineup: Record<FieldPosition, string>,
): Record<FieldPosition, string> {
  const pool = availableBatters(team.players.filter((p) => p.rosterLevel !== 'farm'))
  const used = new Set<string>()
  const next: Record<FieldPosition, string> = { ...lineup }

  for (const pos of FIELD_POSITIONS) {
    const id = next[pos]
    const player = team.players.find((p) => p.id === id)
    if (player && isPlayerAvailable(player) && !isPitcher(player)) {
      used.add(id)
      continue
    }
    const replacement =
      pool.find((p) => p.role === pos && !used.has(p.id)) ??
      pool.find((p) => !used.has(p.id))
    if (replacement) {
      next[pos] = replacement.id
      used.add(replacement.id)
    }
  }

  return next
}

export function sanitizeRotation(team: Team, rotation: string[]): string[] {
  const available = availableStarters(team.players)
  const valid = rotation.filter((id) => available.some((p) => p.id === id))
  const missing = available.filter((p) => !valid.includes(p.id)).map((p) => p.id)
  return [...valid, ...missing].slice(0, 5)
}

export function ensureValidLineupAndRotation(team: Team): {
  lineup: Record<FieldPosition, string>
  rotation: string[]
} {
  return {
    lineup: sanitizeLineup(team, defaultLineup(team)),
    rotation: sanitizeRotation(team, defaultRotation(team)),
  }
}
