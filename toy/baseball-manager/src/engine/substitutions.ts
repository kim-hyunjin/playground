import type { FieldPosition, Player, Team } from '../types/game'
import { FIELD_POSITIONS } from '../types/game'
import { isPlayerAvailable } from './injury'

export interface ActiveLineupSlot {
  battingOrder: number
  position: FieldPosition
  playerId: string
}

export interface GameRosterState {
  lineup: ActiveLineupSlot[]
  benchIds: string[]
  bullpenIds: string[]
  currentPitcherId: string
  usedPlayerIds: string[]
  removedPlayerIds: string[]
}

export interface SubstitutionResult {
  ok: boolean
  message: string
  roster: GameRosterState
}

export function createGameRoster(
  team: Team,
  lineup: Record<FieldPosition, string>,
  starterId: string,
): GameRosterState {
  const active = FIELD_POSITIONS.map((position, battingOrder) => ({
    battingOrder,
    position,
    playerId: lineup[position],
  }))
  const activeIds = new Set(active.map((slot) => slot.playerId))
  const available = team.players.filter((p) => p.rosterLevel === 'first' && isPlayerAvailable(p))
  return {
    lineup: active,
    benchIds: available.filter((p) => !activeIds.has(p.id) && p.role !== 'SP' && p.role !== 'RP').map((p) => p.id),
    bullpenIds: available.filter((p) => p.role === 'RP' && p.id !== starterId).map((p) => p.id),
    currentPitcherId: starterId,
    usedPlayerIds: [...activeIds, starterId],
    removedPlayerIds: [],
  }
}

function unavailable(roster: GameRosterState, playerId: string): boolean {
  return roster.usedPlayerIds.includes(playerId) || roster.removedPlayerIds.includes(playerId)
}

export function substituteBatter(
  roster: GameRosterState,
  battingOrder: number,
  incoming: Player,
  position?: FieldPosition,
): SubstitutionResult {
  const slot = roster.lineup.find((item) => item.battingOrder === battingOrder)
  if (!slot) return { ok: false, message: '해당 타순이 없습니다.', roster }
  if (!roster.benchIds.includes(incoming.id) || unavailable(roster, incoming.id)) {
    return { ok: false, message: '교체 가능한 벤치 선수가 아닙니다.', roster }
  }
  const nextPosition = position ?? slot.position
  if (incoming.role !== nextPosition && incoming.role !== 'DH') {
    return { ok: false, message: '선수가 해당 수비 포지션을 맡을 수 없습니다.', roster }
  }
  return {
    ok: true,
    message: '타자 교체 완료',
    roster: {
      ...roster,
      lineup: roster.lineup.map((item) => item.battingOrder === battingOrder
        ? { ...item, playerId: incoming.id, position: nextPosition }
        : item),
      benchIds: roster.benchIds.filter((id) => id !== incoming.id),
      usedPlayerIds: [...roster.usedPlayerIds, incoming.id],
      removedPlayerIds: [...roster.removedPlayerIds, slot.playerId],
    },
  }
}

export function changePitcher(roster: GameRosterState, incoming: Player): SubstitutionResult {
  if (incoming.role !== 'RP' || !roster.bullpenIds.includes(incoming.id) || unavailable(roster, incoming.id)) {
    return { ok: false, message: '등판 가능한 불펜 투수가 아닙니다.', roster }
  }
  return {
    ok: true,
    message: '투수 교체 완료',
    roster: {
      ...roster,
      currentPitcherId: incoming.id,
      bullpenIds: roster.bullpenIds.filter((id) => id !== incoming.id),
      usedPlayerIds: [...roster.usedPlayerIds, incoming.id],
      removedPlayerIds: [...roster.removedPlayerIds, roster.currentPitcherId],
    },
  }
}
