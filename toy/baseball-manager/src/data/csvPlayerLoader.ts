import type { PitchingStyle, PlayerRole, RosterLevel } from '../types/game'
import type {
  BatterSourceStats,
  PitcherSourceStats,
  PlayerRecord,
  TeamAbbr,
  TeamRosterFile,
} from './types'
import { batterSourceForOvr, pitcherSourceForOvr } from './ratings/statsProfiles'
import { PLAYERS_CSV_COLUMNS, type PlayerPool } from './playersCsvSchema'

export type { PlayerPool } from './playersCsvSchema'
export { PLAYERS_CSV_COLUMNS } from './playersCsvSchema'

export type PlayersCsvRow = Record<(typeof PLAYERS_CSV_COLUMNS)[number], string>

const TEAM_ABBRS = new Set<TeamAbbr>(['KIA', 'NC', 'SSG', '키움', 'KT', '두산', 'LG', '롯데', '한화', '삼성'])

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

function num(val: string | undefined): number | undefined {
  if (val == null || val.trim() === '') return undefined
  const n = Number(val)
  return Number.isFinite(n) ? n : undefined
}

function bool(val: string | undefined): boolean {
  return val === '1' || val?.toLowerCase() === 'true' || val?.toLowerCase() === 'yes'
}

function hand(val: string | undefined): 'L' | 'R' | 'S' | undefined {
  if (val === 'L' || val === 'R' || val === 'S') return val
  return undefined
}

function pitchingStyle(val: string | undefined): PitchingStyle | undefined {
  if (val === 'overhand' || val === 'threeQuarter' || val === 'sidearm' || val === 'underhand') return val
  return undefined
}

export function parsePlayersCsv(text: string): PlayersCsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'))

  if (lines.length < 2) return []

  const header = parseCsvLine(lines[0]!).map((h) => h.trim())
  const idx = new Map(header.map((h, i) => [h, i]))
  const rows: PlayersCsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]!)
    const row = {} as PlayersCsvRow
    for (const key of PLAYERS_CSV_COLUMNS) {
      const j = idx.get(key)
      row[key] = j == null ? '' : (cells[j] ?? '')
    }
    if (!row.id || !row.name) continue
    rows.push(row)
  }

  return rows
}

function sourceStatsFromRow(row: PlayersCsvRow): BatterSourceStats | PitcherSourceStats | undefined {
  const pa = num(row.pa)
  if (pa != null && pa > 0) {
    return {
      pa,
      woba: num(row.woba),
      iso: num(row.iso),
      bbPct: num(row.bbPct),
      kPct: num(row.kPct),
      sb: num(row.sb),
    }
  }

  const ip = num(row.ip)
  if (ip != null && ip > 0) {
    return {
      ip,
      era: num(row.era),
      fip: num(row.fip),
      k9: num(row.k9),
      bb9: num(row.bb9),
      gs: num(row.gs),
      games: num(row.games),
    }
  }

  const target = num(row.targetOvr)
  if (target != null) {
    const role = row.role as PlayerRole
    if (role === 'SP' || role === 'RP') {
      return pitcherSourceForOvr(target, role)
    }
    return batterSourceForOvr(target, role)
  }

  return undefined
}

export function recordFromCsvRow(row: PlayersCsvRow): PlayerRecord {
  const teamAbbr = row.teamAbbr as TeamAbbr
  if (!TEAM_ABBRS.has(teamAbbr)) {
    throw new Error(`Invalid teamAbbr in CSV row ${row.id}: ${row.teamAbbr}`)
  }

  const rosterLevel = row.rosterLevel as RosterLevel
  const record: PlayerRecord = {
    id: row.id,
    name: row.name,
    teamAbbr,
    role: row.role as PlayerRole,
    rosterLevel,
    age: num(row.age) ?? 25,
    salaryKrw: num(row.salaryKrw),
    potential: num(row.potential),
    targetOvr: num(row.targetOvr),
    generated: bool(row.generated),
    bats: hand(row.bats),
    throws: hand(row.throws),
    pitchingStyle: pitchingStyle(row.pitchingStyle),
  }

  const stats = sourceStatsFromRow(row)
  if (stats) record.sourceStats = stats

  return record
}

export interface PlayersDataset {
  season: number
  rosterFiles: TeamRosterFile[]
  draftRecords: PlayerRecord[]
  faRecords: PlayerRecord[]
}

export function buildPlayersDataset(csvText: string): PlayersDataset {
  const rows = parsePlayersCsv(csvText)
  if (rows.length === 0) {
    throw new Error('players.csv is empty. Add player rows to src/data/players.csv')
  }

  const season = num(rows[0]!.season) ?? 2026
  const byTeam = new Map<TeamAbbr, TeamRosterFile>()

  for (const abbr of TEAM_ABBRS) {
    byTeam.set(abbr, { teamAbbr: abbr, season, first: [], farm: [] })
  }

  const draftRecords: PlayerRecord[] = []
  const faRecords: PlayerRecord[] = []

  for (const row of rows) {
    const pool = row.pool as PlayerPool
    const record = recordFromCsvRow(row)

    if (pool === 'draft') {
      draftRecords.push(record)
      continue
    }
    if (pool === 'fa') {
      faRecords.push(record)
      continue
    }

    const file = byTeam.get(record.teamAbbr)
    if (!file) {
      throw new Error(`Unknown team in CSV: ${record.teamAbbr} (${record.id})`)
    }
    if (record.rosterLevel === 'first') file.first.push(record)
    else file.farm.push(record)
  }

  return {
    season,
    rosterFiles: [...byTeam.values()],
    draftRecords,
    faRecords,
  }
}
