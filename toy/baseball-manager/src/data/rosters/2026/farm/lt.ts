import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const ltFarmExtended = [
  batter('LT', '배민준', 'DH', 22, 57, { ...farmOpts, potential: 76 }),
  batter('LT', '송도현', 'SS', 19, 55, { ...farmOpts, potential: 80 }),
  batter('LT', '임준영', 'CF', 20, 54, { ...farmOpts, potential: 77 }),
  batter('LT', '황재민', 'C', 21, 53, { ...farmOpts, potential: 72 }),
  batter('LT', '민성우', '3B', 20, 52, { ...farmOpts, potential: 74 }),
  batter('LT', '표동민', 'RF', 19, 51, { ...farmOpts, potential: 75 }),
  batter('LT', '고승현', '2B', 22, 50, { ...farmOpts, potential: 71 }),
  pitcher('LT', '나재훈', 'SP', 21, 56, { ...farmOpts, potential: 79 }),
  pitcher('LT', '유민재', 'SP', 20, 53, { ...farmOpts, potential: 78 }),
  pitcher('LT', '차우진', 'RP', 19, 49, { ...farmOpts, potential: 70 }),
  pitcher('LT', '허준서', 'RP', 22, 48, { ...farmOpts, potential: 69 }),
  batter('LT', '신민성', 'LF', 18, 47, { ...farmOpts, potential: 76 }),
  pitcher('LT', '조재민', 'RP', 21, 46, { ...farmOpts, potential: 68 }),
  pitcher('LT', '강태양', 'RP', 20, 45, { ...farmOpts, potential: 67 }),
]
