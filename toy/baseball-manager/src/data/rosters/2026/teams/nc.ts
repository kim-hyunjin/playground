import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'
import { ncFarmExtended } from '../farm/nc'

const T = 'NC' as const

const first = [
  batter(T, '박민우', '2B', 34, 84, { salaryKrw: 750_000_000 }),
  batter(T, '김주원', 'SS', 25, 83, { salaryKrw: 500_000_000, potential: 90 }),
  batter(T, '데이비슨', '1B', 30, 82, { salaryKrw: 850_000_000 }),
  batter(T, '김성욱', 'CF', 31, 80, { salaryKrw: 480_000_000 }),
  batter(T, '김형준', 'C', 28, 78, { salaryKrw: 400_000_000 }),
  batter(T, '서호철', '3B', 29, 76, { salaryKrw: 320_000_000 }),
  batter(T, '박건우', 'RF', 35, 75, { salaryKrw: 380_000_000 }),
  batter(T, '김태군', 'DH', 33, 74, { salaryKrw: 300_000_000 }),
  batter(T, '이상호', 'LF', 27, 72, { salaryKrw: 250_000_000 }),
  batter(T, '김한별', 'SS', 26, 70, { salaryKrw: 200_000_000 }),
  batter(T, '박세혁', 'C', 30, 69, { salaryKrw: 170_000_000 }),
  batter(T, '도태훈', '2B', 28, 68, { salaryKrw: 150_000_000 }),
  batter(T, '김태현', '3B', 25, 67, { salaryKrw: 140_000_000 }),
  pitcher(T, '구창모', 'SP', 28, 84, { salaryKrw: 550_000_000 }),
  pitcher(T, '로건', 'SP', 27, 82, { salaryKrw: 700_000_000 }),
  pitcher(T, '이재학', 'SP', 26, 78, { salaryKrw: 350_000_000 }),
  pitcher(T, '신민혁', 'SP', 25, 75, { salaryKrw: 280_000_000, potential: 84 }),
  pitcher(T, '김녹두', 'SP', 24, 72, { salaryKrw: 200_000_000, potential: 80 }),
  pitcher(T, '이용찬', 'RP', 32, 79, { salaryKrw: 320_000_000 }),
  pitcher(T, '김영규', 'RP', 30, 77, { salaryKrw: 280_000_000 }),
  pitcher(T, '김태훈', 'RP', 28, 74, { salaryKrw: 220_000_000 }),
  pitcher(T, '박세웅', 'RP', 27, 72, { salaryKrw: 190_000_000 }),
  pitcher(T, '이준호', 'RP', 26, 71, { salaryKrw: 170_000_000 }),
  pitcher(T, '최성영', 'RP', 25, 69, { salaryKrw: 140_000_000 }),
  pitcher(T, '김재열', 'RP', 24, 68, { salaryKrw: 120_000_000, potential: 76 }),
  pitcher(T, '박민석', 'RP', 23, 67, { salaryKrw: 110_000_000, potential: 75 }),
]

const farm = [
  batter(T, '이준서', 'SS', 21, 61, { rosterLevel: 'farm', potential: 82 }),
  batter(T, '김민재', 'CF', 20, 57, { rosterLevel: 'farm', potential: 79 }),
  pitcher(T, '박준영', 'SP', 21, 58, { rosterLevel: 'farm', potential: 83 }),
  batter(T, '최우성', 'C', 22, 55, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '이동현', 'SP', 20, 54, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '한승우', '3B', 21, 53, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '정태양', 'RP', 22, 52, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '오민준', 'RF', 20, 51, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '김서준', 'RP', 19, 50, { rosterLevel: 'farm', potential: 71 }),
  batter(T, '장현우', '2B', 21, 49, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '윤재민', 'SP', 20, 48, { rosterLevel: 'farm', potential: 77 }),
  batter(T, '신동혁', 'LF', 19, 47, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '박현우', 'RP', 21, 46, { rosterLevel: 'farm', potential: 70 }),
  batter(T, '김우진', '1B', 20, 45, { rosterLevel: 'farm', potential: 71 }),
  ...ncFarmExtended,
]

export const nc2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
