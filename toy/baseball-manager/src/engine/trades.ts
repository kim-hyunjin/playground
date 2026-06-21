import type { Player, Team } from '../types/game'
import { overallRating } from './generator'
import {
  countByLevel,
  FIRST_TEAM_MAX,
  FARM_TEAM_MAX,
  rosterLevelOf,
} from './roster'

export interface TradeProposal {
  fromTeamId: string
  toTeamId: string
  outgoingIds: string[]
  incomingIds: string[]
}

function levelCounts(team: Team, ids: string[]) {
  let first = 0
  let farm = 0
  for (const id of ids) {
    const p = team.players.find((x) => x.id === id)
    if (!p) continue
    if (rosterLevelOf(p) === 'first') first++
    else farm++
  }
  return { first, farm }
}

export function validateTrade(teams: Team[], proposal: TradeProposal): string | null {
  const { fromTeamId, toTeamId, outgoingIds, incomingIds } = proposal

  if (fromTeamId === toTeamId) return '같은 팀끼리는 트레이드할 수 없습니다.'
  if (outgoingIds.length === 0 || incomingIds.length === 0) {
    return '교환할 선수를 각각 1명 이상 선택하세요.'
  }
  if (outgoingIds.length > 3 || incomingIds.length > 3) {
    return '한 번에 최대 3명까지 교환할 수 있습니다.'
  }

  const userTeam = teams.find((t) => t.id === fromTeamId)
  const cpuTeam = teams.find((t) => t.id === toTeamId)
  if (!userTeam || !cpuTeam) return '팀을 찾을 수 없습니다.'

  for (const id of outgoingIds) {
    if (!userTeam.players.some((p) => p.id === id)) return '보낼 선수가 우리 팀에 없습니다.'
  }
  for (const id of incomingIds) {
    if (!cpuTeam.players.some((p) => p.id === id)) return '받을 선수가 상대 팀에 없습니다.'
  }

  const out = levelCounts(userTeam, outgoingIds)
  const inc = levelCounts(cpuTeam, incomingIds)

  const userFirstAfter = countByLevel(userTeam, 'first') - out.first + inc.first
  const userFarmAfter = countByLevel(userTeam, 'farm') - out.farm + inc.farm
  const cpuFirstAfter = countByLevel(cpuTeam, 'first') - inc.first + out.first
  const cpuFarmAfter = countByLevel(cpuTeam, 'farm') - inc.farm + out.farm

  if (userFirstAfter > FIRST_TEAM_MAX || userFarmAfter > FARM_TEAM_MAX) {
    return '트레이드 후 우리 팀 등록 정원을 초과합니다.'
  }
  if (cpuFirstAfter > FIRST_TEAM_MAX || cpuFarmAfter > FARM_TEAM_MAX) {
    return '상대 팀 등록 정원 초과로 거래가 불가합니다.'
  }

  return null
}

export function cpuAcceptsTrade(
  userTeam: Team,
  cpuTeam: Team,
  outgoingIds: string[],
  incomingIds: string[],
  rand = Math.random,
): boolean {
  const sumOvr = (ids: string[], team: Team) =>
    ids.reduce((s, id) => {
      const p = team.players.find((x) => x.id === id)
      return s + (p ? overallRating(p) : 0)
    }, 0)

  const cpuDelta = sumOvr(outgoingIds, userTeam) - sumOvr(incomingIds, cpuTeam)

  if (cpuDelta >= 5) return rand() < 0.9
  if (cpuDelta >= 0) return rand() < 0.62
  if (cpuDelta >= -5) return rand() < 0.25
  return rand() < 0.07
}

function assignIncomingLevel(team: Team, player: Player): Player {
  if (countByLevel(team, 'first') < FIRST_TEAM_MAX) {
    return { ...player, rosterLevel: 'first' }
  }
  return { ...player, rosterLevel: 'farm' }
}

export function executeTrade(teams: Team[], proposal: TradeProposal): Team[] | null {
  const err = validateTrade(teams, proposal)
  if (err) return null

  const { fromTeamId, toTeamId, outgoingIds, incomingIds } = proposal
  const outSet = new Set(outgoingIds)
  const inSet = new Set(incomingIds)

  let userTeam = teams.find((t) => t.id === fromTeamId)!
  let cpuTeam = teams.find((t) => t.id === toTeamId)!

  const outgoing = userTeam.players.filter((p) => outSet.has(p.id))
  const incoming = cpuTeam.players.filter((p) => inSet.has(p.id))

  const newUserPlayers = [
    ...userTeam.players.filter((p) => !outSet.has(p.id)),
    ...incoming.map((p) => assignIncomingLevel(userTeam, p)),
  ]
  userTeam = { ...userTeam, players: newUserPlayers }

  const newCpuPlayers = [
    ...cpuTeam.players.filter((p) => !inSet.has(p.id)),
    ...outgoing.map((p) => assignIncomingLevel(cpuTeam, p)),
  ]
  cpuTeam = { ...cpuTeam, players: newCpuPlayers }

  return teams.map((t) => {
    if (t.id === fromTeamId) return userTeam
    if (t.id === toTeamId) return cpuTeam
    return t
  })
}
