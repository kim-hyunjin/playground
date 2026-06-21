import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'
import { ssgFarmExtended } from '../farm/ssg'

const T = 'SSG' as const

const first = [
  batter(T, '최정', '3B', 38, 86, { salaryKrw: 1_200_000_000 }),
  batter(T, '에레디아', 'CF', 30, 85, { salaryKrw: 950_000_000 }),
  batter(T, '고명준', 'SS', 25, 82, { salaryKrw: 450_000_000, potential: 88 }),
  batter(T, '한유섬', 'LF', 32, 80, { salaryKrw: 500_000_000 }),
  batter(T, '최지훈', 'RF', 28, 78, { salaryKrw: 380_000_000 }),
  batter(T, '이재원', 'C', 30, 76, { salaryKrw: 320_000_000 }),
  batter(T, '박성한', 'SS', 27, 74, { salaryKrw: 280_000_000 }),
  batter(T, '오태곤', '1B', 33, 73, { salaryKrw: 260_000_000 }),
  batter(T, '김성현', '2B', 29, 72, { salaryKrw: 240_000_000 }),
  batter(T, '최준우', 'DH', 31, 71, { salaryKrw: 220_000_000 }),
  batter(T, '김강민', 'CF', 26, 69, { salaryKrw: 180_000_000 }),
  batter(T, '이현석', 'C', 28, 68, { salaryKrw: 150_000_000 }),
  batter(T, '정준재', '2B', 25, 67, { salaryKrw: 140_000_000 }),
  pitcher(T, '김광현', 'SP', 36, 83, { salaryKrw: 800_000_000 }),
  pitcher(T, '앤더슨', 'SP', 29, 82, { salaryKrw: 900_000_000 }),
  pitcher(T, '문승원', 'SP', 27, 79, { salaryKrw: 400_000_000 }),
  pitcher(T, '백승건', 'SP', 25, 76, { salaryKrw: 300_000_000, potential: 84 }),
  pitcher(T, '송영진', 'SP', 24, 73, { salaryKrw: 220_000_000, potential: 81 }),
  pitcher(T, '김택형', 'RP', 35, 81, { salaryKrw: 450_000_000 }),
  pitcher(T, '서진용', 'RP', 30, 78, { salaryKrw: 320_000_000 }),
  pitcher(T, '노경은', 'RP', 32, 76, { salaryKrw: 280_000_000 }),
  pitcher(T, '이로운', 'RP', 28, 74, { salaryKrw: 230_000_000 }),
  pitcher(T, '한두솔', 'RP', 27, 72, { salaryKrw: 190_000_000 }),
  pitcher(T, '조병현', 'RP', 26, 70, { salaryKrw: 160_000_000 }),
  pitcher(T, '김민', 'RP', 25, 69, { salaryKrw: 140_000_000 }),
  pitcher(T, '박지환', 'RP', 24, 68, { salaryKrw: 120_000_000, potential: 76 }),
]

const farm = [
  batter(T, '김도윤', 'SS', 21, 60, { rosterLevel: 'farm', potential: 81 }),
  batter(T, '이서준', 'CF', 20, 57, { rosterLevel: 'farm', potential: 79 }),
  pitcher(T, '박민호', 'SP', 21, 58, { rosterLevel: 'farm', potential: 83 }),
  batter(T, '최재민', 'C', 22, 55, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '김태양', 'SP', 20, 54, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '한지훈', '3B', 21, 53, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '오승민', 'RP', 22, 52, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '정우진', 'RF', 20, 51, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '이민재', 'RP', 19, 50, { rosterLevel: 'farm', potential: 71 }),
  batter(T, '장서연', '2B', 21, 49, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '윤호준', 'SP', 20, 48, { rosterLevel: 'farm', potential: 77 }),
  batter(T, '신우진', 'LF', 19, 47, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '박재훈', 'RP', 21, 46, { rosterLevel: 'farm', potential: 70 }),
  batter(T, '김준혁', '1B', 20, 45, { rosterLevel: 'farm', potential: 71 }),
  ...ssgFarmExtended,
]

export const ssg2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
