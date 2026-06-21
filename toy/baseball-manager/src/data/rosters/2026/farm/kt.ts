import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const ktFarmExtended = [
  batter('KT', '배재훈', 'DH', 22, 58, { ...farmOpts, potential: 77 }),
  batter('KT', '송우진', 'SS', 19, 56, { ...farmOpts, potential: 81 }),
  batter('KT', '임성민', 'CF', 20, 55, { ...farmOpts, potential: 78 }),
  batter('KT', '황도현', 'C', 21, 54, { ...farmOpts, potential: 73 }),
  batter('KT', '민준혁', '3B', 20, 53, { ...farmOpts, potential: 75 }),
  batter('KT', '표지민', 'RF', 19, 52, { ...farmOpts, potential: 76 }),
  batter('KT', '고태민', '2B', 22, 51, { ...farmOpts, potential: 72 }),
  pitcher('KT', '나균안', 'SP', 21, 57, { ...farmOpts, potential: 80 }),
  pitcher('KT', '유승민', 'SP', 20, 54, { ...farmOpts, potential: 79 }),
  pitcher('KT', '차민호', 'RP', 19, 50, { ...farmOpts, potential: 71 }),
  pitcher('KT', '허태양', 'RP', 22, 49, { ...farmOpts, potential: 70 }),
  batter('KT', '신동현', 'LF', 18, 48, { ...farmOpts, potential: 77 }),
  pitcher('KT', '조민재', 'RP', 21, 47, { ...farmOpts, potential: 69 }),
  pitcher('KT', '강우성', 'RP', 20, 46, { ...farmOpts, potential: 68 }),
]
