const UA = 'Mozilla/5.0 (compatible; baseball-manager/1.0; +https://github.com)'
const SEARCH_URL = 'https://www.koreabaseball.com/Player/Search.aspx'
export const HITTER_DETAIL = 'https://www.koreabaseball.com/Record/Player/HitterDetail/Basic.aspx'
export const PITCHER_DETAIL = 'https://www.koreabaseball.com/Record/Player/PitcherDetail/Basic.aspx'

export interface KboSearchHit {
  playerId: string
  name: string
  team: string
  role: string
}

export function extractHidden(html: string, name: string): string {
  const escaped = name.replace(/\$/g, '\\$')
  const re = new RegExp(`name="${escaped}"[^>]*value="([^"]*)"`, 'i')
  return html.match(re)?.[1] ?? ''
}

function parseSearchResults(html: string): KboSearchHit[] {
  const re =
    /playerId=(\d+)'>([^<]+)<\/a><\/td>\s*<td>([^<]+)<\/td>\s*<td>([^<]+)<\/td>/g
  const hits: KboSearchHit[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    hits.push({
      playerId: m[1]!,
      name: m[2]!.trim(),
      team: m[3]!.trim(),
      role: m[4]!.trim(),
    })
  }
  return hits
}

function parsePositionLabel(html: string): string {
  const m = html.match(/playerProfile_lblPosition">([^<]*)</)
  return m?.[1]?.trim() ?? ''
}

let cookieJar = ''

function mergeCookies(res: Response) {
  const setCookies = typeof res.headers.getSetCookie === 'function'
    ? res.headers.getSetCookie()
    : []
  if (setCookies.length === 0) {
    const single = res.headers.get('set-cookie')
    if (single) setCookies.push(single)
  }
  const pairs = setCookies.map((c) => c.split(';')[0]).filter(Boolean)
  if (pairs.length > 0) cookieJar = pairs.join('; ')
}

export async function fetchText(url: string, init?: RequestInit): Promise<string> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'User-Agent': UA,
      ...(cookieJar ? { Cookie: cookieJar } : {}),
      ...(init?.headers ?? {}),
    },
  })
  mergeCookies(res)
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

export async function searchKboPlayer(name: string): Promise<KboSearchHit[]> {
  const first = await fetchText(SEARCH_URL)

  const body = new URLSearchParams({
    __VIEWSTATE: extractHidden(first, '__VIEWSTATE'),
    __VIEWSTATEGENERATOR: extractHidden(first, '__VIEWSTATEGENERATOR'),
    __EVENTVALIDATION: extractHidden(first, '__EVENTVALIDATION'),
    'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$txtSearchPlayerName': name,
    'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$btnSearch': '검색',
  })

  const html = await fetchText(SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  return parseSearchResults(html)
}

export async function fetchKboPositionLabel(playerId: string): Promise<string> {
  for (const base of [HITTER_DETAIL, PITCHER_DETAIL]) {
    const html = await fetchText(`${base}?playerId=${playerId}`)
    const label = parsePositionLabel(html)
    if (label && label !== '()') return label
  }
  return ''
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
