import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const dsFarmExtended = [
  batter('DS', '배성준', 'DH', 22, 58, { ...farmOpts, potential: 77 }),
  batter('DS', '송재민', 'SS', 19, 56, { ...farmOpts, potential: 81 }),
  batter('DS', '임우진', 'CF', 20, 55, { ...farmOpts, potential: 78 }),
  batter('DS', '황민수', 'C', 21, 54, { ...farmOpts, potential: 73 }),
  batter('DS', '민태양', '3B', 20, 53, { ...farmOpts, potential: 75 }),
  batter('DS', '표준호', 'RF', 19, 52, { ...farmOpts, potential: 76 }),
  batter('DS', '고재원', '2B', 22, 51, { ...farmOpts, potential: 72 }),
  pitcher('DS', '나성민', 'SP', 21, 57, { ...farmOpts, potential: 80 }),
  pitcher('DS', '유준혁', 'SP', 20, 54, { ...farmOpts, potential: 79 }),
  pitcher('DS', '차동현', 'RP', 19, 50, { ...farmOpts, potential: 71 }),
  pitcher('DS', '허민재', 'RP', 22, 49, { ...farmOpts, potential: 70 }),
  batter('DS', '신태민', 'LF', 18, 48, { ...farmOpts, potential: 77 }),
  pitcher('DS', '조성우', 'RP', 21, 47, { ...farmOpts, potential: 69 }),
  pitcher('DS', '강민준', 'RP', 20, 46, { ...farmOpts, potential: 68 }),
]
