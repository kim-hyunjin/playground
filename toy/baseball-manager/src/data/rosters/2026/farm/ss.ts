import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const ssFarmExtended = [
  batter('SS', '배재민', 'DH', 22, 58, { ...farmOpts, potential: 77 }),
  batter('SS', '송민호', 'SS', 19, 56, { ...farmOpts, potential: 81 }),
  batter('SS', '임태양', 'CF', 20, 55, { ...farmOpts, potential: 78 }),
  batter('SS', '황준서', 'C', 21, 54, { ...farmOpts, potential: 73 }),
  batter('SS', '민재훈', '3B', 20, 53, { ...farmOpts, potential: 75 }),
  batter('SS', '표우진', 'RF', 19, 52, { ...farmOpts, potential: 76 }),
  batter('SS', '고승민', '2B', 22, 51, { ...farmOpts, potential: 72 }),
  pitcher('SS', '나민재', 'SP', 21, 57, { ...farmOpts, potential: 80 }),
  pitcher('SS', '유동현', 'SP', 20, 54, { ...farmOpts, potential: 79 }),
  pitcher('SS', '차재민', 'RP', 19, 50, { ...farmOpts, potential: 71 }),
  pitcher('SS', '허태민', 'RP', 22, 49, { ...farmOpts, potential: 70 }),
  batter('SS', '신성우', 'LF', 18, 48, { ...farmOpts, potential: 77 }),
  pitcher('SS', '조우성', 'RP', 21, 47, { ...farmOpts, potential: 69 }),
  pitcher('SS', '강민성', 'RP', 20, 46, { ...farmOpts, potential: 68 }),
]
