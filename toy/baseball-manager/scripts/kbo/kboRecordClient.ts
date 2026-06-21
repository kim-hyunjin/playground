import type { BatterSourceStats, PitcherSourceStats } from '../../src/data/types'
import { extractHidden, fetchKboPositionLabel, fetchText, HITTER_DETAIL, PITCHER_DETAIL, sleep } from './kboClient'
import { parseKboProfileHtml, type KboPlayerProfile } from './parseProfile'

export interface KboRecordHitter {
  playerId: string
  name: string
  kboTeam: string
  avg?: number
  pa?: number
  ab?: number
  hr?: number
  sb?: number
  obp?: number
  slg?: number
  bb?: number
  k?: number
}

export interface KboRecordPitcher {
  playerId: string
  name: string
  kboTeam: string
  era?: number
  games?: number
  wins?: number
  losses?: number
  saves?: number
  holds?: number
  ip?: number
  hits?: number
  hr?: number
  bb?: number
  k?: number
  er?: number
  whip?: number
  gs?: number
}

const HITTER_BASIC = 'https://www.koreabaseball.com/Record/Player/HitterBasic'
const PITCHER_BASIC = 'https://www.koreabaseball.com/Record/Player/PitcherBasic'

const PAGER_PREFIX = 'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ucPager$btnNo'

async function fetchAspxPage(baseUrl: string, pageNum: number): Promise<string> {
  const first = await fetchText(baseUrl)
  if (pageNum <= 1) return first

  const body = new URLSearchParams({
    __VIEWSTATE: extractHidden(first, '__VIEWSTATE'),
    __VIEWSTATEGENERATOR: extractHidden(first, '__VIEWSTATEGENERATOR'),
    __EVENTVALIDATION: extractHidden(first, '__EVENTVALIDATION'),
    __EVENTTARGET: `${PAGER_PREFIX}${pageNum}`,
    __EVENTARGUMENT: '',
  })

  return fetchText(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
}

function maxPagerPage(html: string): number {
  const nums = [...html.matchAll(/ucPager_btnNo(\d+)/g)].map((m) => Number(m[1]))
  return nums.length > 0 ? Math.max(...nums) : 1
}

async function fetchAllTablePages(
  baseUrl: string,
  parse: (html: string) => { playerId: string }[],
): Promise<{ playerId: string }[]> {
  const first = await fetchText(baseUrl)
  const pages = maxPagerPage(first)
  const byId = new Map<string, { playerId: string }>()

  for (let p = 1; p <= pages; p++) {
    const html = p === 1 ? first : await fetchAspxPage(baseUrl, p)
    for (const row of parse(html)) byId.set(row.playerId, row)
    if (p < pages) await sleep(200)
  }

  return [...byId.values()]
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, '').trim()
}

function num(raw: string): number | undefined {
  const v = raw.replace(/,/g, '').trim()
  if (!v || v === '-') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/** `87 1/3` → 87.333… */
export function parseKboInnings(raw: string): number | undefined {
  const t = raw.trim()
  if (!t || t === '-') return undefined
  const m = t.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (m) {
    return Number(m[1]) + Number(m[2]) / Number(m[3])
  }
  const n = Number(t)
  return Number.isFinite(n) ? n : undefined
}

function parseHitterTable(html: string): KboRecordHitter[] {
  const table = html.match(/class="tData01 tt"[\s\S]*?<\/table>/)
  if (!table) return []

  const rows = [...table[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
  const out: KboRecordHitter[] = []

  for (const row of rows.slice(1)) {
    const cells = [...row[1]!.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => stripTags(c[1]!))
    if (cells.length < 4) continue

    const link = row[1]!.match(/playerId=(\d+)/)
    if (!link) continue

    out.push({
      playerId: link[1]!,
      name: cells[1]!,
      kboTeam: cells[2]!,
      avg: num(cells[3]!),
      pa: num(cells[5]!),
      ab: num(cells[6]!),
      hr: num(cells[11]!),
    })
  }
  return out
}

function parseHitterAdvanced(html: string): Map<string, Partial<KboRecordHitter>> {
  const table = html.match(/class="tData01 tt"[\s\S]*?<\/table>/)
  const map = new Map<string, Partial<KboRecordHitter>>()
  if (!table) return map

  const rows = [...table[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
  for (const row of rows.slice(1)) {
    const link = row[1]!.match(/playerId=(\d+)/)
    if (!link) continue
    const cells = [...row[1]!.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => stripTags(c[1]!))
    if (cells.length < 8) continue
    map.set(link[1]!, {
      bb: num(cells[4]!),
      k: num(cells[7]!),
      slg: num(cells[9]!),
      obp: num(cells[10]!),
    })
  }
  return map
}

function parsePitcherTable(html: string): KboRecordPitcher[] {
  const table = html.match(/class="tData01 tt"[\s\S]*?<\/table>/)
  if (!table) return []

  const rows = [...table[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
  const out: KboRecordPitcher[] = []

  for (const row of rows.slice(1)) {
    const cells = [...row[1]!.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => stripTags(c[1]!))
    if (cells.length < 4) continue
    const link = row[1]!.match(/playerId=(\d+)/)
    if (!link) continue

    const ip = parseKboInnings(cells[10] ?? '')
    const games = num(cells[4]!)
    out.push({
      playerId: link[1]!,
      name: cells[1]!,
      kboTeam: cells[2]!,
      era: num(cells[3]!),
      games,
      wins: num(cells[5]!),
      losses: num(cells[6]!),
      saves: num(cells[7]!),
      holds: num(cells[8]!),
      ip,
      hits: num(cells[11]!),
      hr: num(cells[12]!),
      bb: num(cells[13]!),
      k: num(cells[15]!),
      er: num(cells[17]!),
      whip: num(cells[18]!),
    })
  }
  return out
}

export async function fetchKboRecordPool(season = 2026): Promise<{
  hitters: Map<string, KboRecordHitter>
  pitchers: Map<string, KboRecordPitcher>
}> {
  void season

  const hitters = new Map<string, KboRecordHitter>()
  const pitchers = new Map<string, KboRecordPitcher>()

  const hitterRows = await fetchAllTablePages(`${HITTER_BASIC}/Basic1.aspx`, parseHitterTable)
  for (const h of hitterRows as KboRecordHitter[]) hitters.set(h.playerId, h)

  try {
    const advPages = maxPagerPage(await fetchText(`${HITTER_BASIC}/Basic2.aspx`))
    for (let p = 1; p <= advPages; p++) {
      const html = await fetchAspxPage(`${HITTER_BASIC}/Basic2.aspx`, p)
      const adv = parseHitterAdvanced(html)
      for (const [id, extra] of adv) {
        const base = hitters.get(id)
        if (base) hitters.set(id, { ...base, ...extra })
      }
      if (p < advPages) await sleep(200)
    }
  } catch {
    /* Basic2 optional */
  }

  const pitcherRows = await fetchAllTablePages(`${PITCHER_BASIC}/Basic1.aspx`, parsePitcherTable)
  for (const p of pitcherRows as KboRecordPitcher[]) pitchers.set(p.playerId, p)

  return { hitters, pitchers }
}

export async function fetchKboPlayerProfile(playerId: string): Promise<KboPlayerProfile> {
  for (const base of [HITTER_DETAIL, PITCHER_DETAIL]) {
    const html = await fetchText(`${base}?playerId=${playerId}`)
    const profile = parseKboProfileHtml(html)
    if (profile.name) return profile
  }
  const label = await fetchKboPositionLabel(playerId)
  return { name: '', positionLabel: label }
}

function saneRate(value: number | undefined, fallback: number): number {
  if (value == null || !Number.isFinite(value)) return fallback
  if (value > 0 && value <= 1.5) return value
  return fallback
}

export function hitterToSourceStats(h: KboRecordHitter): BatterSourceStats {
  const pa = h.pa ?? 200
  const avgFallback = h.avg ?? 0.27
  const obp = saneRate(h.obp, avgFallback + 0.05)
  const slg = saneRate(h.slg, avgFallback + 0.08)
  const iso = Math.max(0.05, slg - (h.avg ?? 0.27))
  const bbPct = pa > 0 && h.bb != null ? h.bb / pa : 0.08
  const kPct = pa > 0 && h.k != null ? h.k / pa : 0.2
  const woba = obp * 0.85 + slg * 0.15

  return {
    pa,
    woba,
    iso,
    bbPct,
    kPct,
    sb: h.sb ?? 0,
  }
}

export function pitcherToSourceStats(p: KboRecordPitcher, role: 'SP' | 'RP'): PitcherSourceStats {
  const ip = p.ip ?? (role === 'SP' ? 80 : 45)
  const games = p.games ?? (role === 'SP' ? 25 : 40)
  const bb9 = ip > 0 && p.bb != null ? (p.bb * 9) / ip : 3.4
  const k9 = ip > 0 && p.k != null ? (p.k * 9) / ip : 7.5
  const era = p.era ?? 4.5
  const fip = ip > 0 && p.er != null && p.hr != null && p.bb != null && p.k != null
    ? ((13 * p.hr + 3 * p.bb - 2 * p.k) / ip) + 3.1
    : era

  return {
    ip,
    era,
    fip,
    k9,
    bb9,
    gs: role === 'SP' ? Math.round(games * 0.75) : 0,
    games,
  }
}
