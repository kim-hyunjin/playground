import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const hhFarmExtended = [
  batter('HH', '배성민', 'DH', 22, 58, { ...farmOpts, potential: 77 }),
  batter('HH', '송준혁', 'SS', 19, 56, { ...farmOpts, potential: 81 }),
  batter('HH', '임민수', 'CF', 20, 55, { ...farmOpts, potential: 78 }),
  batter('HH', '황재원', 'C', 21, 54, { ...farmOpts, potential: 73 }),
  batter('HH', '민우진', '3B', 20, 53, { ...farmOpts, potential: 75 }),
  batter('HH', '표승현', 'RF', 19, 52, { ...farmOpts, potential: 76 }),
  batter('HH', '고태민', '2B', 22, 51, { ...farmOpts, potential: 72 }),
  pitcher('HH', '나동현', 'SP', 21, 57, { ...farmOpts, potential: 80 }),
  pitcher('HH', '유재민', 'SP', 20, 54, { ...farmOpts, potential: 79 }),
  pitcher('HH', '차민준', 'RP', 19, 50, { ...farmOpts, potential: 71 }),
  pitcher('HH', '허성우', 'RP', 22, 49, { ...farmOpts, potential: 70 }),
  batter('HH', '신준서', 'LF', 18, 48, { ...farmOpts, potential: 77 }),
  pitcher('HH', '조민성', 'RP', 21, 47, { ...farmOpts, potential: 69 }),
  pitcher('HH', '강도현', 'RP', 20, 46, { ...farmOpts, potential: 68 }),
]
