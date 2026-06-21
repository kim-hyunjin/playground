import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const ncFarmExtended = [
  batter('NC', '서민재', 'DH', 22, 58, { ...farmOpts, potential: 77 }),
  batter('NC', '황준혁', 'SS', 19, 56, { ...farmOpts, potential: 81 }),
  batter('NC', '노시후', 'CF', 20, 55, { ...farmOpts, potential: 78 }),
  batter('NC', '민경환', 'C', 21, 54, { ...farmOpts, potential: 73 }),
  batter('NC', '표승민', '3B', 20, 53, { ...farmOpts, potential: 75 }),
  batter('NC', '하태양', 'RF', 19, 52, { ...farmOpts, potential: 76 }),
  batter('NC', '곽민성', '2B', 22, 51, { ...farmOpts, potential: 72 }),
  pitcher('NC', '최범석', 'SP', 21, 57, { ...farmOpts, potential: 80 }),
  pitcher('NC', '김한솔', 'SP', 20, 54, { ...farmOpts, potential: 79 }),
  pitcher('NC', '이도윤', 'RP', 19, 50, { ...farmOpts, potential: 71 }),
  pitcher('NC', '박성진', 'RP', 22, 49, { ...farmOpts, potential: 70 }),
  batter('NC', '안재현', 'LF', 18, 48, { ...farmOpts, potential: 77 }),
  pitcher('NC', '송지후', 'RP', 21, 47, { ...farmOpts, potential: 69 }),
  pitcher('NC', '장우성', 'RP', 20, 46, { ...farmOpts, potential: 68 }),
]
