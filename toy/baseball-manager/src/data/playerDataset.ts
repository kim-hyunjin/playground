import { buildPlayersDataset, type PlayersDataset } from './csvPlayerLoader'

declare global {
  var __PLAYERS_CSV__: string | undefined
}

let cached: PlayersDataset | null = null

function loadPlayersCsvText(): string {
  const csv = globalThis.__PLAYERS_CSV__
  if (typeof csv !== 'string' || csv.length === 0) {
    throw new Error(
      'players.csv가 로드되지 않았습니다. 브라우저에서는 main.tsx, Node 스크립트에서는 scripts/load-csv-shim.ts 를 먼저 import 하세요.',
    )
  }
  return csv
}

export function getPlayersDataset(): PlayersDataset {
  if (!cached) cached = buildPlayersDataset(loadPlayersCsvText())
  return cached
}

export function getRosterFiles() {
  return getPlayersDataset().rosterFiles
}

export function getDraftRecords() {
  return getPlayersDataset().draftRecords
}

export function getFaRecords() {
  return getPlayersDataset().faRecords
}
