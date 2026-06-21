import type { Player } from '../types/game'
import { overallRating } from './generator'

export function defaultContractYears(age: number, ovr: number): number {
  if (age >= 33 || ovr >= 78) return 1
  if (age <= 26) return 3
  return 2
}

export function contractYearsForPlayer(player: Pick<Player, 'age' | 'role' | 'contact' | 'power' | 'velocity' | 'control' | 'movement' | 'stamina' | 'eye' | 'speed' | 'fielding'>): number {
  return defaultContractYears(player.age, overallRating(player as Player))
}
