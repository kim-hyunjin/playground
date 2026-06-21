import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'

const T = 'KIA' as const

const first = [
  batter(T, '김도영', 'SS', 25, 88, { salaryKrw: 1_200_000_000, potential: 94 }),
  batter(T, '나성범', 'LF', 35, 85, { salaryKrw: 1_000_000_000 }),
  batter(T, '최원준', 'CF', 27, 82, { salaryKrw: 550_000_000 }),
  batter(T, '변우혁', '1B', 26, 80, { salaryKrw: 480_000_000, potential: 88 }),
  batter(T, '김석환', 'DH', 29, 79, { salaryKrw: 420_000_000 }),
  batter(T, '김선빈', '2B', 36, 78, { salaryKrw: 380_000_000 }),
  batter(T, '김태군', 'C', 33, 76, { salaryKrw: 350_000_000 }),
  batter(T, '최정용', '3B', 28, 74, { salaryKrw: 280_000_000 }),
  batter(T, '박찬호', 'SS', 32, 72, { salaryKrw: 250_000_000 }),
  batter(T, '윤도현', 'RF', 24, 71, { salaryKrw: 180_000_000, potential: 82 }),
  batter(T, '한승택', 'C', 30, 70, { salaryKrw: 160_000_000 }),
  batter(T, '오선진', '3B', 34, 69, { salaryKrw: 140_000_000 }),
  batter(T, '김규성', '2B', 26, 68, { salaryKrw: 120_000_000 }),
  pitcher(T, '양현종', 'SP', 36, 84, { salaryKrw: 1_000_000_000 }),
  pitcher(T, '네일', 'SP', 28, 83, { salaryKrw: 900_000_000 }),
  pitcher(T, '윤영철', 'SP', 25, 78, { salaryKrw: 320_000_000, potential: 86 }),
  pitcher(T, '황동하', 'SP', 24, 76, { salaryKrw: 280_000_000, potential: 84 }),
  pitcher(T, '이준영', 'SP', 27, 72, { salaryKrw: 200_000_000 }),
  pitcher(T, '정해영', 'RP', 26, 80, { salaryKrw: 350_000_000 }),
  pitcher(T, '전상현', 'RP', 29, 77, { salaryKrw: 260_000_000 }),
  pitcher(T, '이의욱', 'RP', 28, 75, { salaryKrw: 220_000_000 }),
  pitcher(T, '김기훈', 'RP', 27, 74, { salaryKrw: 190_000_000 }),
  pitcher(T, '김대유', 'RP', 31, 73, { salaryKrw: 170_000_000 }),
  pitcher(T, '장현식', 'RP', 30, 72, { salaryKrw: 150_000_000 }),
  pitcher(T, '임기영', 'RP', 26, 71, { salaryKrw: 130_000_000 }),
  pitcher(T, '이호민', 'RP', 25, 69, { salaryKrw: 110_000_000, potential: 78 }),
]

const farm = [
  batter(T, '김정호', 'SS', 21, 62, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '박민', 'CF', 20, 58, { rosterLevel: 'farm', potential: 78 }),
  batter(T, '이재원', 'C', 22, 56, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '최지민', '3B', 21, 55, { rosterLevel: 'farm', potential: 74 }),
  batter(T, '한준수', 'RF', 20, 54, { rosterLevel: 'farm', potential: 76 }),
  pitcher(T, '박시훈', 'SP', 21, 60, { rosterLevel: 'farm', potential: 82 }),
  pitcher(T, '김민수', 'SP', 22, 57, { rosterLevel: 'farm', potential: 79 }),
  pitcher(T, '이태양', 'SP', 20, 55, { rosterLevel: 'farm', potential: 81 }),
  pitcher(T, '정우영', 'RP', 21, 53, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '오현석', 'RP', 22, 52, { rosterLevel: 'farm', potential: 73 }),
  batter(T, '장현민', '2B', 19, 51, { rosterLevel: 'farm', potential: 77 }),
  batter(T, '윤재혁', 'LF', 20, 50, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '서재민', 'RP', 19, 49, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '홍길동', '1B', 21, 48, { rosterLevel: 'farm', potential: 70 }),
]

export const kia2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
