import { coachOverall, teamCoachPayroll } from '../engine/coachGenerator'
import { formatSalary } from '../engine/generator'
import { useGame } from '../store/gameStore'
import { COACH_ROLE_LABEL, COACH_ROLES, type Coach, type CoachRole } from '../types/game'
import { useMemo, useState } from 'react'

function CoachStatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-medium text-[var(--text-h)]">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[var(--accent)]"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  )
}

function CoachCard({
  coach,
  actions,
}: {
  coach: Coach
  actions?: React.ReactNode
}) {
  return (
    <div className="bm-card p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-[var(--text-h)]">{coach.name}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {COACH_ROLE_LABEL[coach.role]} · {coach.age}세 · OVR {coachOverall(coach)}
          </div>
        </div>
        {actions}
      </div>
      <div className="space-y-2">
        <CoachStatBar label="육성 (teaching)" value={coach.teaching} />
        <CoachStatBar label="동기부여 (motivation)" value={coach.motivation} />
        <CoachStatBar label="스카우팅 (scouting)" value={coach.scouting} />
      </div>
      <div className="mt-3 text-sm text-[var(--text-muted)]">
        연봉 {formatSalary(coach.salary)}
      </div>
    </div>
  )
}

export function CoachesPage() {
  const { state, userTeam, hireCoach, fireCoach } = useGame()
  const [roleFilter, setRoleFilter] = useState<CoachRole | 'all'>('all')
  const [message, setMessage] = useState('')

  const market = useMemo(() => {
    if (!state) return []
    return state.coachMarket
      .filter((c) => roleFilter === 'all' || c.role === roleFilter)
      .sort((a, b) => coachOverall(b) - coachOverall(a))
  }, [state, roleFilter])

  if (!state || !userTeam) return null

  const staffByRole = COACH_ROLES.map((role) => ({
    role,
    coach: userTeam.coaches.find((c) => c.role === role),
  }))

  const handleHire = (coachId: string) => {
    const ok = hireCoach(coachId)
    setMessage(ok ? '코치 영입 완료!' : '영입 실패 — 예산 부족 또는 동일 역할 슬롯 확인')
  }

  const handleFire = (coachId: string) => {
    const ok = fireCoach(coachId)
    setMessage(ok ? '코치와 계약을 해지했습니다. 이적시장에 등록되었습니다.' : '해고 실패')
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">코치진</h1>
        <p className="text-sm text-[var(--text-muted)]">
          코치 능력에 따라 선수 육성·사기·콜업 제안이 달라집니다 · 코치 연봉{' '}
          {formatSalary(teamCoachPayroll(userTeam))} · 예산 {formatSalary(userTeam.budget)}
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-[var(--accent-border)] bg-[var(--accent-dim)] px-4 py-2 text-sm text-[var(--accent)]">
          {message}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold text-[var(--text-h)]">현재 스태프</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {staffByRole.map(({ role, coach }) =>
            coach ? (
              <CoachCard
                key={role}
                coach={coach}
                actions={
                  <button
                    type="button"
                    className="bm-btn bm-btn-ghost text-xs"
                    onClick={() => handleFire(coach.id)}
                  >
                    해고
                  </button>
                }
              />
            ) : (
              <div key={role} className="bm-card flex flex-col justify-center p-4 text-center">
                <div className="text-sm font-medium text-[var(--text-h)]">{COACH_ROLE_LABEL[role]}</div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">공석 — 이적시장에서 영입하세요</p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-[var(--text-h)]">코치 이적시장</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`bm-btn text-xs ${roleFilter === 'all' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
              onClick={() => setRoleFilter('all')}
            >
              전체
            </button>
            {COACH_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                className={`bm-btn text-xs ${roleFilter === role ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
                onClick={() => setRoleFilter(role)}
              >
                {COACH_ROLE_LABEL[role]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {market.map((coach) => {
            const slotTaken = userTeam.coaches.some((c) => c.role === coach.role)
            return (
              <CoachCard
                key={coach.id}
                coach={coach}
                actions={
                  <button
                    type="button"
                    className="bm-btn bm-btn-primary text-xs"
                    disabled={slotTaken}
                    title={slotTaken ? '해당 역할 슬롯이 찼습니다. 기존 코치를 해고하세요.' : undefined}
                    onClick={() => handleHire(coach.id)}
                  >
                    영입
                  </button>
                }
              />
            )
          })}
        </div>
        {market.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">이적시장에 등록된 코치가 없습니다.</p>
        )}
      </section>
    </div>
  )
}
