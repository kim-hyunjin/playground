import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const csvPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/data/players.csv',
)

declare global {
  // eslint-disable-next-line no-var
  var __PLAYERS_CSV__: string | undefined
}

if (typeof globalThis.__PLAYERS_CSV__ !== 'string') {
  globalThis.__PLAYERS_CSV__ = readFileSync(csvPath, 'utf8')
}
