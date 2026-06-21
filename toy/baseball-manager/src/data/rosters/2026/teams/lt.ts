import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'

const T = 'LT' as const

const first = [
  batter(T, '손아섭', 'RF', 32, 84, { salaryKrw: 650_000_000 }),
  batter(T, '윤동희', 'CF', 25, 82, { salaryKrw: 450_000_000, potential: 88 }),
  batter(T, '전준우', 'LF', 37, 81, { salaryKrw: 550_000_000 }),
  batter(T, '한동희', '3B', 25, 80, { salaryKrw: 480_000_000, potential: 87 }),
  batter(T, '정훈', '1B', 33, 78, { salaryKrw: 380_000_000 }),
  batter(T, '김민수', 'C', 30, 76, { salaryKrw: 320_000_000 }),
  batter(T, '박민우', '2B', 28, 74, { salaryKrw: 280_000_000 }),
  batter(T, '김성민', 'SS', 27, 72, { salaryKrw: 240_000_000 }),
  batter(T, '이대호', 'DH', 31, 71, { salaryKrw: 220_000_000 }),
  batter(T, '김재유', 'CF', 26, 70, { salaryKrw: 200_000_000 }),
  batter(T, '박성욱', 'C', 29, 68, { salaryKrw: 160_000_000 }),
  batter(T, '이호준', 'SS', 25, 67, { salaryKrw: 150_000_000, potential: 78 }),
  batter(T, '김동헌', '2B', 24, 66, { salaryKrw: 140_000_000, potential: 76 }),
  pitcher(T, '나균안', 'SP', 28, 83, { salaryKrw: 500_000_000 }),
  pitcher(T, '찰스', 'SP', 29, 82, { salaryKrw: 750_000_000 }),
  pitcher(T, '박세웅', 'SP', 27, 78, { salaryKrw: 350_000_000 }),
  pitcher(T, '이민석', 'SP', 26, 75, { salaryKrw: 280_000_000, potential: 83 }),
  pitcher(T, '김원중', 'SP', 25, 72, { salaryKrw: 220_000_000, potential: 80 }),
  pitcher(T, '김진욱', 'RP', 32, 79, { salaryKrw: 320_000_000 }),
  pitcher(T, '김강현', 'RP', 30, 77, { salaryKrw: 280_000_000 }),
  pitcher(T, '정철원', 'RP', 29, 74, { salaryKrw: 230_000_000 }),
  pitcher(T, '박진', 'RP', 28, 72, { salaryKrw: 190_000_000 }),
  pitcher(T, '이민준', 'RP', 27, 70, { salaryKrw: 160_000_000 }),
  pitcher(T, '김태현', 'RP', 26, 69, { salaryKrw: 140_000_000 }),
  pitcher(T, '오윤석', 'RP', 25, 68, { salaryKrw: 130_000_000 }),
  pitcher(T, '최준영', 'RP', 24, 67, { salaryKrw: 120_000_000, potential: 75 }),
]

const farm = [
  batter(T, '박준민', 'SS', 21, 59, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '김태준', 'CF', 20, 56, { rosterLevel: 'farm', potential: 78 }),
  pitcher(T, '이서준', 'SP', 21, 57, { rosterLevel: 'farm', potential: 82 }),
  batter(T, '최민재', 'C', 22, 54, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '박동현', 'SP', 20, 53, { rosterLevel: 'farm', potential: 79 }),
  batter(T, '한지민', '3B', 21, 52, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '김우진', 'RP', 22, 51, { rosterLevel: 'farm', potential: 71 }),
  batter(T, '오태민', 'RF', 20, 50, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '정서준', 'RP', 19, 49, { rosterLevel: 'farm', potential: 70 }),
  batter(T, '윤재민', '2B', 21, 48, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '신우진', 'SP', 20, 47, { rosterLevel: 'farm', potential: 76 }),
  batter(T, '장민호', 'LF', 19, 46, { rosterLevel: 'farm', potential: 71 }),
  pitcher(T, '이태우', 'RP', 21, 45, { rosterLevel: 'farm', potential: 69 }),
  batter(T, '김준영', '1B', 20, 44, { rosterLevel: 'farm', potential: 70 }),
]

export const lt2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
