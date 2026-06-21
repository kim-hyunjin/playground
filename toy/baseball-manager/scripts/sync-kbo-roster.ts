/**
 * KBO 공식 사이트에서 1군 로스터를 갱신해 JSON 캐시로 덮어씁니다.
 *
 * 파이프라인:
 *   1. 기존 JSON 로스터(시드) 1군 명단
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
 *   npm run kbo:sync-roster -- --rebuild-first  # 기록실 팀별 상위 26명으로 1군 재구성
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { overallRating } from '../src/engine/generator'
import { FIRST_TEAM_MAX } from '../src/engine/roster'
import { batterRatingsFromStats } from '../src/data/ratings/batterFromStats'
import { pitcherRatingsFromStats } from '../src/data/ratings/pitcherFromStats'
import type { PlayerRecord, TeamAbbr, TeamRosterFile } from '../src/data/types'
import type { Player, PlayerRole } from '../src/types/game'
import { searchKboPlayer, sleep, type KboSearchHit } from './kbo/kboClient'
import {
  KBO_PLAYER_OVERRIDES,
  KBO_SEARCH_ALIASES,
  isActiveKboTeam,
} from './kbo/kboPlayerOverrides'
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

const ALL_TEAM_ABBRS: TeamAbbr[] = ['KIA', 'NC', 'SSG', 'WO', 'KT', 'DS', 'LG', 'LT', 'HH', 'SS']

function parseArgs() {
  const args = process.argv.slice(2)
  const set = new Set(args)
  return {
    dryRun: set.has('--dry-run'),
    discover: set.has('--discover'),
    rebuildFirst: set.has('--rebuild-first'),
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

function searchNames(name: string): string[] {
  const names = [name, ...(KBO_SEARCH_ALIASES[name] ?? [])]
  return [...new Set(names)]
}

async function searchAllNames(name: string): Promise<KboSearchHit[]> {
  const byId = new Map<string, KboSearchHit>()
  for (const q of searchNames(name)) {
    for (const hit of await searchKboPlayer(q)) {
      if (isActiveKboTeam(hit.team)) byId.set(hit.playerId, hit)
    }
    await sleep(DELAY_MS)
  }
  return [...byId.values()]
}

function pickSearchHit(record: PlayerRecord, hits: KboSearchHit[]): KboSearchHit | undefined {
  const teamHits = hits.filter((h) => teamLabelMatches(record.teamAbbr, h.team))
  if (teamHits.length === 1) return teamHits[0]

  if (teamHits.length > 1) {
    const wantPitcher = record.role === 'SP' || record.role === 'RP'
    const roleHits = teamHits.filter((h) => wantPitcher === h.role.includes('투수'))
    return roleHits[0] ?? teamHits[0]
  }

  if (hits.length === 1) return hits[0]
  return undefined
}

async function buildRecordFromHit(
  seed: PlayerRecord,
  match: KboSearchHit,
  pool: {
    hitters: Map<string, KboRecordHitter>
    pitchers: Map<string, KboRecordPitcher>
  },
  season: number,
): Promise<PlayerRecord> {
  const profile = await fetchKboPlayerProfile(match.playerId)
  await sleep(DELAY_MS)

  const positionLabel = profile.positionLabel || match.role
  const hand = parseKboPositionLabel(positionLabel)
  const hitterRow = pool.hitters.get(match.playerId)
  const pitcherRow = pool.pitchers.get(match.playerId)

  let role: PlayerRole = seed.role
  let sourceStats = seed.sourceStats

  if (
    match.role.includes('투수') ||
    positionLabel.includes('투수') ||
    seed.role === 'SP' ||
    seed.role === 'RP'
  ) {
    const pStats = pitcherRow
      ? pitcherToSourceStats(pitcherRow, seed.role === 'SP' ? 'SP' : 'RP')
      : undefined
    role = mapKboRole(match.role, positionLabel, pStats, seed.role)
    sourceStats = pStats ?? (seed.role === 'SP' || seed.role === 'RP' ? seed.sourceStats : undefined)
  } else if (hitterRow) {
    role = mapKboRole(match.role, positionLabel, undefined, seed.role)
    sourceStats = hitterToSourceStats(hitterRow)
  } else {
    role = mapKboRole(match.role, positionLabel, undefined, seed.role)
  }

  const updated: PlayerRecord = {
    ...seed,
    id: pid(seed.teamAbbr, profile.name || seed.name),
    name: profile.name || seed.name,
    role,
    age: profile.birthday ? ageFromKboBirthday(profile.birthday, season) : seed.age,
    sourceStats,
    salaryKrw: profile.salaryKrw ?? seed.salaryKrw,
    potential: seed.potential,
    bats: hand.bats ?? seed.bats,
    throws: hand.throws ?? seed.throws,
    targetOvr: undefined,
  }

  updated.targetOvr = ovrFromRecord(updated)
  if (!Number.isFinite(updated.targetOvr)) {
    updated.targetOvr = seed.targetOvr ?? 55
  }

  return updated
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

  const overrideId = KBO_PLAYER_OVERRIDES[record.id]
  if (overrideId) {
    const hit: KboSearchHit = {
      playerId: overrideId,
      name: record.name,
      team: record.teamAbbr,
      role: record.role === 'SP' || record.role === 'RP' ? '투수' : '내야수',
    }
    const built = await buildRecordFromHit(record, hit, pool, season)
    return { record: built, kboPlayerId: overrideId, warnings }
  }

  const hits = await searchAllNames(record.name)

  if (hits.length === 0) {
    warnings.push(`검색 결과 없음: ${record.name}`)
    return null
  }

  const match = pickSearchHit(record, hits)

  if (!match) {
    warnings.push(
      `팀 불일치: ${record.name} — ${hits.map((h) => `${h.team}:${h.playerId}`).join(', ')}`,
    )
    return null
  }

  const built = await buildRecordFromHit(record, match, pool, season)
  return { record: built, kboPlayerId: match.playerId, warnings }
}

function selectFirstTeam26(candidates: PlayerRecord[]): PlayerRecord[] {
  const byOvr = (a: PlayerRecord, b: PlayerRecord) => (b.targetOvr ?? 0) - (a.targetOvr ?? 0)
  const sp = candidates.filter((c) => c.role === 'SP').toSorted(byOvr)
  const rp = candidates.filter((c) => c.role === 'RP').toSorted(byOvr)
  const catchers = candidates.filter((c) => c.role === 'C').toSorted(byOvr)
  const batters = candidates
    .filter((c) => c.role !== 'SP' && c.role !== 'RP' && c.role !== 'C')
    .toSorted(byOvr)

  const picked: PlayerRecord[] = []
  const used = new Set<string>()
  const take = (list: PlayerRecord[], n: number) => {
    for (const p of list) {
      if (picked.length >= FIRST_TEAM_MAX || n <= 0) break
      if (used.has(p.id)) continue
      picked.push(p)
      used.add(p.id)
      n--
    }
  }

  take(sp, 5)
  take(rp, 8)
  take(catchers, 1)
  take(batters, FIRST_TEAM_MAX - picked.length)

  if (picked.length < FIRST_TEAM_MAX) {
    take(candidates.toSorted(byOvr), FIRST_TEAM_MAX - picked.length)
  }

  return picked.slice(0, FIRST_TEAM_MAX)
}

async function rebuildFirstForTeam(
  teamAbbr: TeamAbbr,
  pool: {
    hitters: Map<string, KboRecordHitter>
    pitchers: Map<string, KboRecordPitcher>
  },
  season: number,
  farm: PlayerRecord[],
): Promise<PlayerRecord[]> {
  const candidates: PlayerRecord[] = []

  for (const h of pool.hitters.values()) {
    if (abbrFromKboTeam(h.kboTeam) !== teamAbbr) continue
    const sourceStats = hitterToSourceStats(h)
    const role = mapKboRole('외야수', '', undefined)
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
    const role =
      p.games && p.games > 0 && (p.wins ?? 0) + (p.saves ?? 0) > 0 && (p.ip ?? 0) >= 40
        ? 'SP'
        : 'RP'
    const pStats = pitcherToSourceStats(p, role)
    const rec: PlayerRecord = {
      id: pid(teamAbbr, p.name),
      name: p.name,
      teamAbbr,
      role: mapKboRole('투수', '', pStats),
      rosterLevel: 'first',
      age: 28,
      sourceStats: pStats,
    }
    rec.targetOvr = ovrFromRecord(rec)
    candidates.push(rec)
  }

  const selected = selectFirstTeam26(candidates)
  const enriched: PlayerRecord[] = []

  for (const rec of selected) {
    const hit =
      [...pool.hitters.values()].find(
        (h) => h.name === rec.name && abbrFromKboTeam(h.kboTeam) === teamAbbr,
      ) ??
      [...pool.pitchers.values()].find(
        (p) => p.name === rec.name && abbrFromKboTeam(p.kboTeam) === teamAbbr,
      )

    if (!hit) {
      enriched.push(rec)
      continue
    }

    const match: KboSearchHit = {
      playerId: hit.playerId,
      name: hit.name,
      team: hit.kboTeam,
      role: 'era' in hit ? '투수' : '외야수',
    }

    try {
      enriched.push(await buildRecordFromHit(rec, match, pool, season))
    } catch {
      enriched.push(rec)
    }
  }

  void farm
  return enriched
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

function loadSeedFiles(
  existingKbo: Map<TeamAbbr, TeamRosterFile>,
  team?: TeamAbbr,
): TeamRosterFile[] {
  const abbrs = team ? [team] : ALL_TEAM_ABBRS
  return abbrs.map((abbr) => {
    const file = existingKbo.get(abbr)
    if (!file) {
      throw new Error(
        `${abbr} 로스터 JSON이 없습니다. 먼저 전체 sync를 실행하거나 --discover 로 보충하세요.`,
      )
    }
    return file
  })
}

function mergeAllSources(
  updated: TeamRosterFile[],
  existingKbo: Map<TeamAbbr, TeamRosterFile>,
): TeamRosterFile[] {
  const map = new Map<TeamAbbr, TeamRosterFile>(existingKbo)
  for (const file of updated) map.set(file.teamAbbr, file)
  return ALL_TEAM_ABBRS.map((abbr) => map.get(abbr)!)
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
  const { dryRun, discover, rebuildFirst, season, team, limit } = parseArgs()

  console.log(`=== KBO 로스터 동기화 (season=${season}) ===`)
  if (rebuildFirst) console.log('모드: --rebuild-first (기록실 풀 → 1군 26명 재구성)')
  console.log()

  const pool = await fetchKboRecordPool(season)
  console.log(
    `기록실 풀: 타자 ${pool.hitters.size}명, 투수 ${pool.pitchers.size}명\n`,
  )

  const outData = path.join(ROOT, 'data/rosters', String(season))
  const outSrc = path.join(ROOT, 'src/data/rosters', String(season), 'kbo')
  const manifestPath = path.join(outData, 'manifest.json')
  const existingKbo = readExistingKboFiles(outSrc)
  const seedFiles = loadSeedFiles(existingKbo, team)

  if (seedFiles.length === 0) {
    console.error(`팀을 찾을 수 없음: ${team}`)
    process.exit(1)
  }

  const updatedPartial: TeamRosterFile[] = []
  let processed = 0
  let ok = 0
  let failed = 0

  for (const seed of seedFiles) {
    console.log(`▶ ${seed.teamAbbr}`)

    if (rebuildFirst) {
      try {
        const finalFirst = await rebuildFirstForTeam(
          seed.teamAbbr,
          pool,
          season,
          seed.farm,
        )
        processed += finalFirst.length
        ok += finalFirst.length
        console.log(`  rebuild → ${finalFirst.length}명`)
        if (finalFirst.length !== FIRST_TEAM_MAX) {
          console.warn(`  ⚠ 1군 ${finalFirst.length}명 (목표 ${FIRST_TEAM_MAX})`)
        }
        updatedPartial.push({
          teamAbbr: seed.teamAbbr,
          season,
          first: finalFirst,
          farm: seed.farm,
        })
      } catch (err) {
        console.error(`  rebuild error: ${err instanceof Error ? err.message : err}`)
        failed += seed.first.length
        updatedPartial.push(seed)
      }
      continue
    }

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
  console.log(`\n게임에서 사용: npm run dev`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
