/** KBO 상세 페이지 HTML에서 프로필 필드 추출 */
export interface KboPlayerProfile {
  name: string
  backNo?: string
  birthday?: string
  positionLabel: string
  salaryKrw?: number
  paymentKrw?: number
}

function field(html: string, idSuffix: string): string {
  const re = new RegExp(`id="[^"]*${idSuffix}"[^>]*>([^<]*)<`, 'i')
  return html.match(re)?.[1]?.trim() ?? ''
}

function parseKrwWon(raw: string): number | undefined {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return undefined
  const man = Number(digits)
  if (!Number.isFinite(man)) return undefined
  return man * 10_000
}

/** `2003년 10월 02일` → 만 나이 (기준 연도) */
export function ageFromKboBirthday(birthday: string, seasonYear: number): number {
  const m = birthday.match(/(\d{4})\s*년/)
  if (!m) return 27
  const birthYear = Number(m[1])
  return Math.max(18, seasonYear - birthYear)
}

export function parseKboProfileHtml(html: string): KboPlayerProfile {
  return {
    name: field(html, 'playerProfile_lblName'),
    backNo: field(html, 'playerProfile_lblBackNo') || undefined,
    birthday: field(html, 'playerProfile_lblBirthday') || undefined,
    positionLabel: field(html, 'playerProfile_lblPosition'),
    salaryKrw: parseKrwWon(field(html, 'playerProfile_lblSalary')),
    paymentKrw: parseKrwWon(field(html, 'playerProfile_lblPayment')),
  }
}
