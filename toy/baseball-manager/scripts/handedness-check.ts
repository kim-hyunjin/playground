/**
 * Platoon / handedness unit checks
 */
import { ensureHandedness, inferBats, inferThrows, platoonMultiplier } from '../src/engine/sim/handedness'
import type { Player } from '../src/types/game'

function stub(id: string, role: Player['role']): Player {
  return ensureHandedness({
    id,
    name: 'Test',
    age: 25,
    role,
    rosterLevel: 'first',
    contact: 50,
    power: 50,
    eye: 50,
    speed: 50,
    fielding: 50,
    velocity: 50,
    control: 50,
    movement: 50,
    stamina: 50,
    salary: 100_000,
    morale: 80,
    fatigue: 0,
    potential: 70,
    developmentXp: 0,
    seasonStats: { type: 'batter', games: 0, pa: 0, ab: 0, hits: 0, singles: 0, doubles: 0, triples: 0, hr: 0, bb: 0, hbp: 0, k: 0, rbi: 0, runs: 0, sb: 0 },
    farmSeasonStats: { type: 'batter', games: 0, pa: 0, ab: 0, hits: 0, singles: 0, doubles: 0, triples: 0, hr: 0, bb: 0, hbp: 0, k: 0, rbi: 0, runs: 0, sb: 0 },
  })
}

let passed = 0
let failed = 0

function assert(cond: boolean, label: string) {
  if (!cond) {
    failed++
    console.error(`  ✗ ${label}`)
    throw new Error(label)
  }
  passed++
  console.log(`  ✓ ${label}`)
}

console.log('=== Handedness / Platoon ===\n')

const batter = stub('KIA-test-batter', 'SS')
assert(inferBats(batter) === inferBats(batter), 'inferBats deterministic')
assert(['L', 'R', 'S'].includes(inferBats(batter)), 'inferBats valid hand')

const rhp = stub('KIA-test-sp', 'SP')
assert(inferThrows(rhp) === 'R' || inferThrows(rhp) === 'L', 'inferThrows R or L')

const same = platoonMultiplier('R', 'R')
const opp = platoonMultiplier('L', 'R')
assert(same.contact < opp.contact, 'same-hand contact penalty vs opposite')
assert(same.power < opp.power, 'same-hand power penalty vs opposite')

console.log(`\n=== ${passed} passed, ${failed} failed ===`)
process.exit(failed > 0 ? 1 : 0)
