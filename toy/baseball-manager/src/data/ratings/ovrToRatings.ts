import type { PlayerRole } from '../../types/game'
import type { PlayerRatings } from '../types'

function clamp(n: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, Math.round(n)))
}

function spread(ovr: number, variance = 6): number[] {
  return [
    clamp(ovr + variance * 0.4),
    clamp(ovr - variance * 0.2),
    clamp(ovr + variance * 0.1),
    clamp(ovr - variance * 0.3),
    clamp(ovr),
  ]
}

export function ratingsFromOvr(role: PlayerRole, ovr: number): PlayerRatings {
  const isPitcher = role === 'SP' || role === 'RP'

  if (isPitcher) {
    const velBoost = role === 'SP' ? 2 : 4
    const sta = role === 'SP' ? clamp(ovr + 4) : clamp(ovr - 8)
    return {
      contact: clamp(ovr - 25),
      power: clamp(ovr - 30),
      eye: clamp(ovr - 22),
      speed: clamp(ovr - 18),
      fielding: clamp(ovr - 15),
      velocity: clamp(ovr + velBoost),
      control: clamp(ovr),
      movement: clamp(ovr - 2),
      stamina: sta,
    }
  }

  const [contact, power, eye, speed, fielding] = spread(ovr, role === 'SS' || role === 'CF' ? 8 : 5)
  return {
    contact,
    power,
    eye,
    speed: role === 'DH' ? clamp(speed - 5) : speed,
    fielding: role === 'DH' ? clamp(fielding - 12) : fielding,
    velocity: clamp(ovr - 35),
    control: clamp(ovr - 38),
    movement: clamp(ovr - 40),
    stamina: clamp(ovr - 10),
  }
}
