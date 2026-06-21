/**
 * KBO 공식 사이트에서 1군 로스터를 갱신해 JSON 캐시로 덮어씁니다.
 *
 * 파이프라인:
 *   1. 기존 TS 로스터(시드) 1군 명단
 *   2. KBO 검색 → playerId·현재 팀 확인
 *   3. 기록실 시즌 스탯 + 상세 프로필 → PlayerRecord
 *   4. data/rosters/{season}/ + src/data/rosters/{season}/kbo/*.json 저장
 *
 * 사용:
 *   npm run kbo:sync-roster
 *   npm run kbo:sync-roster -- --team=KIA
 *   npm run kbo:sync-roster -- --dry-run
 *   npm run kbo:sync-roster -- --limit=3
 *   npm run kbo:sync-roster -- --discover   # 기록실 풀에서 부족분 보충
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { overallRating } from '../src/engine/generator'
import { FIRST_TEAM_MAX } from '../src/engine/roster'
import { batterRatingsFromStats } from '../src/data/ratings/batterFromStats'
import { pitcherRatingsFromStats } from '../src/data/ratings/pitcherFromStats'
import { ROSTERS_2026 } from '../src/data/rosters/2026/teams'
import type { PlayerRecord, TeamAbbr, TeamRosterFile } from '../src/data/types'
import type { Player, PlayerRole } from '../src/types/game'
import { searchKboPlayer, sleep } from './kbo/kboClient'
import { abbrFromKboTeam } from './kbo/kboTeamAbbr'
import {
  fetchKboPlayerProfile,
  fetchKboRecordPool,
  hitterToSourceStats,
  pitcherToSourceStats,
  type KboRecordHitter,
  type KboRecordPitcher,
} from './kbo/kboRecordClient'
import { mapKboRole } from './kbo/mapKboRole'
import { ageFromKboBirthday } from './kbo/parseProfile'
import { parseKboPositionLabel } from './kbo/parseHandedness'
import { teamLabelMatches } from './kbo/teamLabels'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DELAY_MS = 350

function slug(name: string): string {
  return name.replace(/\s+/g, '')
}

function pid(team: TeamAbbr, name: string): string {
  return `${team}-${slug(name)}`
}

function parseArgs() {
  const args = process.argv.slice(2)
  const set = new Set(args)
  return {
    dryRun: set.has('--dry-run'),
    discover: set.has('--discover'),
    season: Number(args.find((a) => a.startsWith('--season='))?.split('=')[1] ?? 2026),
    team: args.find((a) => a.startsWith('--team='))?.split('=')[1] as TeamAbbr | undefined,
    limit: args.find((a) => a.startsWith('--limit='))
      ? Number(args.find((a) => a.startsWith('--limit='))!.split('=')[1])
      : undefined,
  }
}

function ovrFromRecord(record: PlayerRecord): number {
  const ratings =
    record.role === 'SP' || record.role === 'RP'
      ? pitcherRatingsFromStats(record.sourceStats as never, record.role)
      : batterRatingsFromStats(record.sourceStats as never)
  const probe = { ...ratings, role: record.role, rosterLevel: record.rosterLevel } as Player
  return overallRating(probe)
}

async function resolveKboPlayer(
  record: PlayerRecord,
  pool: {
    hitters: Map<string, KboRecordHitter>
    pitchers: Map<string, KboRecordPitcher>
  },
  season: number,
): Promise<{ record: PlayerRecord; kboPlayerId: string; warnings: string[] } | null> {
  const warnings: string[] = []

  const hits = await searchKboPlayer(record.name)
  await sleep(DELAY_MS)

  if (hits.length === 0) {
    warnings.push(`검색 결과 없음: ${record.name}`)
    return null
  }

  const match =
    hits.find((h) => teamLabelMatches(record.teamAbbr, h.team)) ??
    (hits.length === 1 ? hits[0] : undefined)

  if (!match) {
    warnings.push(
      `팀 불일치: ${record.name} — ${hits.map((h) => `${h.team}:${h.playerId}`).join(', ')}`,
    )
    return null
  }

  const kboAbbr = abbrFromKboTeam(match.team)
  if (kboAbbr && kboAbbr !== record.teamAbbr) {
    warnings.push(`이적 감지: ${record.name} ${record.teamAbbr} → ${kboAbbr}`)
    return null
  }

  const profile = await fetchKboPlayerProfile(match.playerId)
  await sleep(DELAY_MS)

  const positionLabel = profile.positionLabel || match.role
  const hand = parseKboPositionLabel(positionLabel)

  const hitterRow = pool.hitters.get(match.playerId)
  const pitcherRow = pool.pitchers.get(match.playerId)

  let role: PlayerRole = record.role
  let sourceStats = record.sourceStats

  if (match.role.includes('투수') || positionLabel.includes('투수') || record.role === 'SP' || record.role === 'RP') {
    const pStats = pitcherRow
      ? pitcherToSourceStats(pitcherRow, record.role === 'SP' ? 'SP' : 'RP')
      : undefined
    role = mapKboRole(match.role, positionLabel, pStats, record.role)
    sourceStats = pStats ?? (record.role === 'SP' || record.role === 'RP' ? record.sourceStats : undefined)
  } else if (hitterRow) {
    role = mapKboRole(match.role, positionLabel, undefined, record.role)
    sourceStats = hitterToSourceStats(hitterRow)
  } else {
    role = mapKboRole(match.role, positionLabel, undefined, record.role)
  }

  const age = profile.birthday
    ? ageFromKboBirthday(profile.birthday, season)
    : record.age

  const updated: PlayerRecord = {
    ...record,
    id: pid(record.teamAbbr, record.name),
    name: profile.name || record.name,
    role,
    age,
    sourceStats,
    salaryKrw: profile.salaryKrw ?? record.salaryKrw,
    potential: record.potential,
    bats: hand.bats ?? record.bats,
    throws: hand.throws ?? record.throws,
    targetOvr: undefined,
  }

  updated.targetOvr = ovrFromRecord(updated)
  if (!Number.isFinite(updated.targetOvr)) {
    updated.targetOvr = record.targetOvr ?? 55
  }

  return { record: updated, kboPlayerId: match.playerId, warnings }
}

function discoverForTeam(
  teamAbbr: TeamAbbr,
  existing: PlayerRecord[],
  pool: {
    hitters: Map<string, KboRecordHitter>
    pitchers: Map<string, KboRecordPitcher>
  },
  season: number,
): PlayerRecord[] {
  const names = new Set(existing.map((p) => p.name))
  const candidates: PlayerRecord[] = []

  for (const h of pool.hitters.values()) {
    if (abbrFromKboTeam(h.kboTeam) !== teamAbbr) continue
    if (names.has(h.name)) continue
    const role = mapKboRole('외야수', '', undefined)
    const sourceStats = hitterToSourceStats(h)
    const rec: PlayerRecord = {
      id: pid(teamAbbr, h.name),
      name: h.name,
      teamAbbr,
      role,
      rosterLevel: 'first',
      age: 27,
      sourceStats,
    }
    rec.targetOvr = ovrFromRecord(rec)
    candidates.push(rec)
  }

  for (const p of pool.pitchers.values()) {
    if (abbrFromKboTeam(p.kboTeam) !== teamAbbr) continue
    if (names.has(p.name)) continue
    const pStats = pitcherToSourceStats(p, 'RP')
    const role = mapKboRole('투수', '', pStats)
    const rec: PlayerRecord = {
      id: pid(teamAbbr, p.name),
      name: p.name,
      teamAbbr,
      role,
      rosterLevel: 'first',
      age: 28,
      sourceStats: pStats,
    }
    rec.targetOvr = ovrFromRecord(rec)
    candidates.push(rec)
  }

  candidates.sort((a, b) => (b.targetOvr ?? 0) - (a.targetOvr ?? 0))

  const need = FIRST_TEAM_MAX - existing.length
  if (need <= 0) return existing

  return [...existing, ...candidates.slice(0, need)]
}

function readExistingKboFiles(outSrc: string): Map<TeamAbbr, TeamRosterFile> {
  const map = new Map<TeamAbbr, TeamRosterFile>()
  if (!fs.existsSync(outSrc)) return map

  for (const f of fs.readdirSync(outSrc)) {
    if (!f.endsWith('.json')) continue
    const raw = JSON.parse(fs.readFileSync(path.join(outSrc, f), 'utf-8')) as TeamRosterFile
    map.set(raw.teamAbbr, raw)
  }
  return map
}

function mergeAllSources(
  updated: TeamRosterFile[],
  existingKbo: Map<TeamAbbr, TeamRosterFile>,
): TeamRosterFile[] {
  const map = new Map<TeamAbbr, TeamRosterFile>(
    ROSTERS_2026.map((f) => [f.teamAbbr, f]),
  )
  for (const [abbr, file] of existingKbo) map.set(abbr, file)
  for (const file of updated) map.set(file.teamAbbr, file)
  return ROSTERS_2026.map((f) => map.get(f.teamAbbr)!)
}

function writeTeamJson(dir: string, file: TeamRosterFile) {
  const lower = file.teamAbbr.toLowerCase()
  fs.writeFileSync(
    path.join(dir, `${lower}.json`),
    JSON.stringify(file, null, 2) + '\n',
    'utf-8',
  )
}

function writeKboIndex(outDir: string, files: TeamRosterFile[]) {
  const imports = files
    .map(
      (f) =>
        `import ${f.teamAbbr.toLowerCase()} from './${f.teamAbbr.toLowerCase()}.json' with { type: 'json' }`,
    )
    .join('\n')
  const casts = files.map((f) => `${f.teamAbbr.toLowerCase()} as TeamRosterFile`).join(',\n  ')
  const content = `${imports}
import type { TeamRosterFile } from '../../../types'

/** KBO sync 자동 생성 — npm run kbo:sync-roster */
export const ROSTERS_KBO: TeamRosterFile[] = [
  ${casts},
]
`
  fs.writeFileSync(path.join(outDir, 'index.ts'), content, 'utf-8')
}

async function main() {
  const { dryRun, discover, season, team, limit } = parseArgs()

  console.log(`=== KBO 로스터 동기화 (season=${season}) ===\n`)

  const pool = await fetchKboRecordPool(season)
  console.log(
    `기록실 풀: 타자 ${pool.hitters.size}명, 투수 ${pool.pitchers.size}명\n`,
  )

  const seedFiles = team
    ? ROSTERS_2026.filter((f) => f.teamAbbr === team)
    : ROSTERS_2026

  if (seedFiles.length === 0) {
    console.error(`팀을 찾을 수 없음: ${team}`)
    process.exit(1)
  }

  const outData = path.join(ROOT, 'data/rosters', String(season))
  const outSrc = path.join(ROOT, 'src/data/rosters', String(season), 'kbo')
  const manifestPath = path.join(outData, 'manifest.json')
  const existingKbo = readExistingKboFiles(outSrc)

  const updatedPartial: TeamRosterFile[] = []
  let processed = 0
  let ok = 0
  let failed = 0

  for (const seed of seedFiles) {
    console.log(`▶ ${seed.teamAbbr}`)
    const first: PlayerRecord[] = []

    for (const player of seed.first) {
      if (limit !== undefined && processed >= limit) break

      processed++
      process.stdout.write(`  ${player.name} ... `)

      try {
        const result = await resolveKboPlayer(player, pool, season)
        if (result) {
          first.push(result.record)
          console.log(`OVR ${result.record.targetOvr} (${result.kboPlayerId})`)
          for (const w of result.warnings) console.log(`    ⚠ ${w}`)
          ok++
        } else {
          console.log('FAIL (시드 유지)')
          first.push(player)
          failed++
        }
      } catch (err) {
        console.log(`error: ${err instanceof Error ? err.message : err}`)
        first.push(player)
        failed++
      }
    }

    let finalFirst = first
    if (discover && finalFirst.length < FIRST_TEAM_MAX) {
      finalFirst = discoverForTeam(seed.teamAbbr, finalFirst, pool, season)
      console.log(`  discover 보충 → ${finalFirst.length}명`)
    }

    if (finalFirst.length !== FIRST_TEAM_MAX) {
      console.warn(`  ⚠ 1군 ${finalFirst.length}명 (목표 ${FIRST_TEAM_MAX})`)
    }

    updatedPartial.push({
      teamAbbr: seed.teamAbbr,
      season,
      first: finalFirst,
      farm: seed.farm,
    })
  }

  const updatedFiles = team
    ? mergeAllSources(updatedPartial, existingKbo)
    : updatedPartial

  const manifest = {
    season,
    source: 'kbo-official',
    fetchedAt: new Date().toISOString(),
    teams: updatedFiles.length,
    stats: { ok, failed, processed },
  }

  console.log(`\n완료: 성공 ${ok}, 실패 ${failed}, 처리 ${processed}명`)

  if (dryRun) {
    console.log('(dry-run — 파일 미저장)')
    return
  }

  fs.mkdirSync(outData, { recursive: true })
  fs.mkdirSync(outSrc, { recursive: true })

  for (const file of updatedFiles) {
    writeTeamJson(outData, file)
    writeTeamJson(outSrc, file)
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8')
  writeKboIndex(outSrc, updatedFiles)

  console.log(`\n저장: ${outData}/`)
  console.log(`번들: ${outSrc}/`)
  console.log(`\n게임에서 사용: VITE_ROSTER_SOURCE=kbo npm run dev`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
