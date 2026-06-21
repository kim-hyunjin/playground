import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const lgFarmExtended = [
  batter('LG', '배준서', 'DH', 22, 58, { ...farmOpts, potential: 77 }),
  batter('LG', '송현우', 'SS', 19, 56, { ...farmOpts, potential: 81 }),
  batter('LG', '임재민', 'CF', 20, 55, { ...farmOpts, potential: 78 }),
  batter('LG', '황서준', 'C', 21, 54, { ...farmOpts, potential: 73 }),
  batter('LG', '민도현', '3B', 20, 53, { ...farmOpts, potential: 75 }),
  batter('LG', '표재훈', 'RF', 19, 52, { ...farmOpts, potential: 76 }),
  batter('LG', '고민준', '2B', 22, 51, { ...farmOpts, potential: 72 }),
  pitcher('LG', '나우진', 'SP', 21, 57, { ...farmOpts, potential: 80 }),
  pitcher('LG', '유성민', 'SP', 20, 54, { ...farmOpts, potential: 79 }),
  pitcher('LG', '차재원', 'RP', 19, 50, { ...farmOpts, potential: 71 }),
  pitcher('LG', '허동민', 'RP', 22, 49, { ...farmOpts, potential: 70 }),
  batter('LG', '신우성', 'LF', 18, 48, { ...farmOpts, potential: 77 }),
  pitcher('LG', '조태양', 'RP', 21, 47, { ...farmOpts, potential: 69 }),
  pitcher('LG', '강재혁', 'RP', 20, 46, { ...farmOpts, potential: 68 }),
]
