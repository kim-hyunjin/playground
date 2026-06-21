/**
 * Monte Carlo outcome distribution for at-bat tuning.
 * Run: npx tsx scripts/sim-outcomes.ts
 */
import { loadLeague2026 } from '../src/data/rosterLoader'
import { resolveAtBat } from '../src/engine/sim/atBat'
import { createSimContext } from '../src/engine/sim/context'
import { ensureHandedness } from '../src/engine/sim/handedness'
import type { AtBatOutcome } from '../src/types/game'

const N = 50_000
const team = loadLeague2026(0)[0]!
const batters = team.players.filter((p) => p.role !== 'SP' && p.role !== 'RP').slice(0, 9)
const pitchers = team.players.filter((p) => p.role === 'SP' || p.role === 'RP')
const ctx = createSimContext('first')

const counts: Record<AtBatOutcome, number> = {
  strikeout: 0,
  walk: 0,
  single: 0,
  double: 0,
  triple: 0,
  homerun: 0,
  out: 0,
  sacrifice: 0,
  error: 0,
}

for (let i = 0; i < N; i++) {
  const b = ensureHandedness(batters[i % batters.length]!)
  const p = ensureHandedness(pitchers[i % pitchers.length]!)
  counts[resolveAtBat(b, p, ctx)]++
}

console.log(`=== ${N} PA sample (KIA stars vs staff) ===\n`)
for (const [k, v] of Object.entries(counts)) {
  console.log(`${k.padEnd(12)} ${(100 * v / N).toFixed(1)}%`)
}
