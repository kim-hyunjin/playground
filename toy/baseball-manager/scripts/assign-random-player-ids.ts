/**
 * One-off: replace team-prefixed player ids in players.csv with random UUIDs.
 * Run: npx tsx scripts/assign-random-player-ids.ts
 */
import { randomUUID } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePlayersCsv } from '../src/data/csvPlayerLoader'
import { PLAYERS_CSV_COLUMNS } from '../src/data/playersCsvSchema'

const csvPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/players.csv')

function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function serializeCsv(rows: ReturnType<typeof parsePlayersCsv>): string {
  const header = `# Baseball Manager player database — edit this file; SQLite migration planned
${PLAYERS_CSV_COLUMNS.join(',')}`
  const lines = rows.map((row) =>
    PLAYERS_CSV_COLUMNS.map((col) => escapeCell(row[col] ?? '')).join(','),
  )
  return `${header}\n${lines.join('\n')}\n`
}

const text = readFileSync(csvPath, 'utf8')
const rows = parsePlayersCsv(text)
const used = new Set<string>()

for (const row of rows) {
  let id = randomUUID()
  while (used.has(id)) id = randomUUID()
  used.add(id)
  row.id = id
}

writeFileSync(csvPath, serializeCsv(rows), 'utf8')
console.log(`✓ Reassigned ${rows.length} player ids in ${csvPath}`)
