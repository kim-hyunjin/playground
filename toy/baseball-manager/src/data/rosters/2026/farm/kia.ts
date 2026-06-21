import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

/** KIA 2군 추가 14명 (총 28) */
export const kiaFarmExtended = [
  batter('KIA', '나승우', 'DH', 22, 59, { ...farmOpts, potential: 78 }),
  batter('KIA', '문재윤', 'SS', 19, 57, { ...farmOpts, potential: 82 }),
  batter('KIA', '송민준', 'CF', 20, 56, { ...farmOpts, potential: 79 }),
  batter('KIA', '유태오', 'C', 21, 55, { ...farmOpts, potential: 74 }),
  batter('KIA', '배준영', '3B', 20, 54, { ...farmOpts, potential: 76 }),
  batter('KIA', '강현수', 'RF', 19, 53, { ...farmOpts, potential: 77 }),
  batter('KIA', '조윤서', '2B', 22, 52, { ...farmOpts, potential: 73 }),
  pitcher('KIA', '황지훈', 'SP', 21, 58, { ...farmOpts, potential: 81 }),
  pitcher('KIA', '임도현', 'SP', 20, 55, { ...farmOpts, potential: 80 }),
  pitcher('KIA', '신우빈', 'RP', 19, 51, { ...farmOpts, potential: 72 }),
  pitcher('KIA', '고영민', 'RP', 22, 50, { ...farmOpts, potential: 71 }),
  batter('KIA', '류지환', 'LF', 18, 49, { ...farmOpts, potential: 78 }),
  pitcher('KIA', '백승호', 'RP', 21, 48, { ...farmOpts, potential: 70 }),
  pitcher('KIA', '전민규', 'RP', 20, 47, { ...farmOpts, potential: 69 }),
]
