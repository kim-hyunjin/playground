export const PLAYERS_CSV_COLUMNS = [
  'season',
  'pool',
  'teamAbbr',
  'rosterLevel',
  'id',
  'name',
  'role',
  'age',
  'salaryKrw',
  'potential',
  'targetOvr',
  'generated',
  'bats',
  'throws',
  'pa',
  'woba',
  'iso',
  'bbPct',
  'kPct',
  'sb',
  'ip',
  'era',
  'fip',
  'k9',
  'bb9',
  'gs',
  'games',
  'pitchingStyle',
] as const

export type PlayersCsvColumn = (typeof PLAYERS_CSV_COLUMNS)[number]

export type PlayerPool = 'roster' | 'draft' | 'fa'
