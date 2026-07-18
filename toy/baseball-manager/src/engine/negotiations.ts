import type { Coach, ContractNegotiation, GameState, NegotiationStatus, Player } from '../types/game'
import { coachOverall } from './coachGenerator'
import { overallRating } from './generator'

function roundSalary(value: number): number {
  return Math.max(100_000, Math.round(value / 10_000) * 10_000)
}

export function playerContractDemand(player: Player): { salary: number; years: number } {
  const ovr = overallRating(player)
  const performance = player.seasonStats.type === 'batter' ? player.seasonStats.pa / 600 : player.seasonStats.outs / 450
  const salary = roundSalary(player.salary * Math.max(1.02, 1 + (ovr - 55) / 130 + Math.min(0.12, performance * 0.08)))
  const years = player.age <= 27 ? 3 : player.age <= 32 ? 2 : 1
  return { salary, years }
}

export function coachContractDemand(coach: Coach): { salary: number; years: number } {
  return { salary: roundSalary(coach.salary * (1.03 + Math.max(0, coachOverall(coach) - 55) / 180)), years: coach.age < 50 ? 2 : 1 }
}

export function createRenewalNegotiations(state: GameState): ContractNegotiation[] {
  const team = state.teams.find((item) => item.id === state.userTeamId)
  if (!team) return []
  const players = team.players.filter((p) => (p.contractYears ?? 1) <= 1).map((player) => {
    const demand = playerContractDemand(player)
    return { id: `player-${player.id}`, subjectType: 'player' as const, subjectId: player.id, askingSalary: demand.salary, askingYears: demand.years, attempts: 0, status: 'pending' as const }
  })
  const coaches = team.coaches.filter((c) => (c.contractYears ?? 1) <= 1).map((coach) => {
    const demand = coachContractDemand(coach)
    return { id: `coach-${coach.id}`, subjectType: 'coach' as const, subjectId: coach.id, askingSalary: demand.salary, askingYears: demand.years, attempts: 0, status: 'pending' as const }
  })
  return [...players, ...coaches]
}

export function submitContractOffer(state: GameState, negotiationId: string, salary: number, years: number): { state: GameState; message: string } {
  const negotiation = state.contractNegotiations?.find((item) => item.id === negotiationId)
  const team = state.teams.find((item) => item.id === state.userTeamId)
  if (!negotiation || !team || !['pending', 'countered'].includes(negotiation.status)) return { state, message: '협상할 수 없는 대상입니다.' }
  if (salary <= 0 || years < 1 || years > 5 || team.budget < salary) return { state, message: '제안 또는 예산을 확인하세요.' }
  const attempts = negotiation.attempts + 1
  const value = salary * (1 + Math.min(years, negotiation.askingYears) * 0.035)
  const target = negotiation.askingSalary * (1 + negotiation.askingYears * 0.035)
  const accepted = value >= target * 0.96
  const rejected = !accepted && attempts >= 3 && value < target * 0.82
  const status: NegotiationStatus = accepted ? 'accepted' : rejected ? 'rejected' : 'countered'
  const nextNegotiation: ContractNegotiation = {
    ...negotiation, attempts, status, offeredSalary: salary, offeredYears: years,
    askingSalary: accepted || rejected ? negotiation.askingSalary : roundSalary(Math.max(salary * 1.08, negotiation.askingSalary * 0.98)),
  }
  let teams = state.teams
  if (accepted) {
    teams = state.teams.map((item) => item.id !== team.id ? item : {
      ...item,
      budget: item.budget - salary,
      players: item.players.map((p) => negotiation.subjectType === 'player' && p.id === negotiation.subjectId ? { ...p, salary, contractYears: years } : p),
      coaches: item.coaches.map((c) => negotiation.subjectType === 'coach' && c.id === negotiation.subjectId ? { ...c, salary, contractYears: years } : c),
    })
  } else if (rejected) {
    if (negotiation.subjectType === 'player') {
      const player = team.players.find((p) => p.id === negotiation.subjectId)
      if (player) {
        teams = state.teams.map((item) => item.id === team.id ? { ...item, players: item.players.filter((p) => p.id !== player.id) } : item)
        state = { ...state, freeAgents: [...state.freeAgents, { player, askingSalary: negotiation.askingSalary, formerTeamName: team.name }] }
      }
    } else {
      const coach = team.coaches.find((c) => c.id === negotiation.subjectId)
      if (coach) {
        teams = state.teams.map((item) => item.id === team.id ? { ...item, coaches: item.coaches.filter((c) => c.id !== coach.id) } : item)
        state = { ...state, coachMarket: [...state.coachMarket, coach] }
      }
    }
  }
  return {
    state: { ...state, teams, contractNegotiations: state.contractNegotiations!.map((item) => item.id === negotiationId ? nextNegotiation : item) },
    message: accepted ? '계약에 합의했습니다.' : rejected ? '협상이 결렬되었습니다.' : '상대가 역제안을 보냈습니다.',
  }
}
