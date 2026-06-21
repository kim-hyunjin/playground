import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'
import { woFarmExtended } from '../farm/wo'

const T = 'WO' as const

const first = [
  batter(T, '이정후', 'CF', 27, 88, { salaryKrw: 1_300_000_000, potential: 92 }),
  batter(T, '김혜성', '2B', 26, 80, { salaryKrw: 450_000_000, potential: 86 }),
  batter(T, '송성문', '3B', 28, 78, { salaryKrw: 380_000_000 }),
  batter(T, '김웅빈', '1B', 25, 76, { salaryKrw: 320_000_000, potential: 84 }),
  batter(T, '이용규', 'LF', 34, 74, { salaryKrw: 280_000_000 }),
  batter(T, '박동원', 'C', 30, 73, { salaryKrw: 260_000_000 }),
  batter(T, '임병욱', 'SS', 29, 72, { salaryKrw: 240_000_000 }),
  batter(T, '김재현', 'RF', 27, 71, { salaryKrw: 220_000_000 }),
  batter(T, '박주홍', 'DH', 26, 70, { salaryKrw: 200_000_000 }),
  batter(T, '김성민', 'C', 28, 68, { salaryKrw: 160_000_000 }),
  batter(T, '오태곤', '1B', 25, 67, { salaryKrw: 150_000_000 }),
  batter(T, '이재원', 'SS', 24, 66, { salaryKrw: 140_000_000, potential: 78 }),
  batter(T, '김동혁', '2B', 27, 65, { salaryKrw: 130_000_000 }),
  pitcher(T, '앤더슨', 'SP', 28, 81, { salaryKrw: 700_000_000 }),
  pitcher(T, '하영민', 'SP', 27, 77, { salaryKrw: 350_000_000 }),
  pitcher(T, '김민', 'SP', 26, 74, { salaryKrw: 280_000_000 }),
  pitcher(T, '이로운', 'SP', 25, 72, { salaryKrw: 220_000_000, potential: 80 }),
  pitcher(T, '박윤성', 'SP', 24, 70, { salaryKrw: 180_000_000, potential: 78 }),
  pitcher(T, '조영우', 'RP', 30, 76, { salaryKrw: 260_000_000 }),
  pitcher(T, '김성훈', 'RP', 29, 74, { salaryKrw: 230_000_000 }),
  pitcher(T, '원종현', 'RP', 28, 72, { salaryKrw: 200_000_000 }),
  pitcher(T, '이태양', 'RP', 27, 71, { salaryKrw: 180_000_000 }),
  pitcher(T, '박상원', 'RP', 26, 69, { salaryKrw: 150_000_000 }),
  pitcher(T, '김재윤', 'RP', 25, 68, { salaryKrw: 130_000_000 }),
  pitcher(T, '최원준', 'RP', 24, 67, { salaryKrw: 120_000_000 }),
  pitcher(T, '이민우', 'RP', 23, 66, { salaryKrw: 110_000_000, potential: 74 }),
]

const farm = [
  batter(T, '박준서', 'SS', 21, 58, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '김민수', 'CF', 20, 55, { rosterLevel: 'farm', potential: 78 }),
  pitcher(T, '이태민', 'SP', 21, 56, { rosterLevel: 'farm', potential: 82 }),
  batter(T, '최동현', 'C', 22, 54, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '정우성', 'SP', 20, 53, { rosterLevel: 'farm', potential: 79 }),
  batter(T, '한승민', '3B', 21, 52, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '오민재', 'RP', 22, 51, { rosterLevel: 'farm', potential: 71 }),
  batter(T, '윤서진', 'RF', 20, 50, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '김도현', 'RP', 19, 49, { rosterLevel: 'farm', potential: 70 }),
  batter(T, '장민우', '2B', 21, 48, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '박서준', 'SP', 20, 47, { rosterLevel: 'farm', potential: 76 }),
  batter(T, '신재훈', 'LF', 19, 46, { rosterLevel: 'farm', potential: 71 }),
  pitcher(T, '이준호', 'RP', 21, 45, { rosterLevel: 'farm', potential: 69 }),
  batter(T, '김우성', '1B', 20, 44, { rosterLevel: 'farm', potential: 70 }),
  ...woFarmExtended,
]

export const wo2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
