/**
 * Monte Carlo sanity check for simulation balance.
 * Run: npm run sim:sanity
 */
import './load-csv-shim.ts'
import { PARKS_2026 } from '../src/data/parks/kbo2026'
import { loadLeague2026 } from '../src/data/rosterLoader'
import { simulateGame } from '../src/engine/simulation'
import type { ScheduledGame, Team } from '../src/types/game'

const GAMES = 600

function avgRunsPerTeam(results: { homeScore: number; awayScore: number }[]): number {
  if (results.length === 0) return 0
  const total = results.reduce((s, r) => s + r.homeScore + r.awayScore, 0)
  return total / results.length / 2
}

function simulateBlock(teams: Team[], level: 'first' | 'farm'): number {
  const results: { homeScore: number; awayScore: number }[] = []

  for (let i = 0; i < GAMES; i++) {
    const homeIdx = i % teams.length
    const awayIdx = (i + 3) % teams.length
    if (homeIdx === awayIdx) continue

    const home = teams[homeIdx]!
    const away = teams[awayIdx]!
    const game: ScheduledGame = {
      id: `sanity-${level}-${i}`,
      week: (i % 18) + 1,
      homeId: home.id,
      awayId: away.id,
      played: false,
    }

    results.push(simulateGame(game, home, away, { rosterLevel: level, skipLogs: true }))
  }

  return avgRunsPerTeam(results)
}

const teams = loadLeague2026(0)

console.log('=== Simulation Sanity (Monte Carlo) ===\n')

const firstRpg = simulateBlock(teams, 'first')
const farmRpg = simulateBlock(teams, 'farm')

console.log(`1군 리그: ${firstRpg.toFixed(2)} R/G per team`)
console.log(`2군 리그: ${farmRpg.toFixed(2)} R/G per team`)

const sample = simulateGame(
  {
    id: 'park-check',
    week: 1,
    homeId: teams[0]!.id,
    awayId: teams[1]!.id,
    played: false,
  },
  teams[0]!,
  teams[1]!,
  { skipLogs: true },
)

const checks = [
  { label: '1군 R/G KBO (4.0~6.5)', ok: firstRpg >= 4.0 && firstRpg <= 6.5 },
  { label: '2군 R/G (3.5~7.0)', ok: farmRpg >= 3.5 && farmRpg <= 7.0 },
  {
    label: '2군 R/G ≈ 1군 (0.75~1.15×)',
    ok: farmRpg >= firstRpg * 0.75 && farmRpg <= firstRpg * 1.15,
  },
  { label: 'parkAbbr 기록', ok: sample.parkAbbr === teams[0]!.abbr },
  { label: 'parkStadium 기록', ok: sample.parkStadium === teams[0]!.stadium },
]

console.log('')
for (const c of checks) {
  console.log(`${c.ok ? '✓' : '✗'} ${c.label}`)
}

const hitterPark = PARKS_2026.find((p) => p.runFactor >= 1.04)!
const pitcherPark = PARKS_2026.find((p) => p.runFactor <= 0.96)!
console.log(
  `\n구장: ${hitterPark.stadium} run×${hitterPark.runFactor} · ${pitcherPark.stadium} run×${pitcherPark.runFactor}`,
)

process.exit(checks.every((c) => c.ok) ? 0 : 1)
