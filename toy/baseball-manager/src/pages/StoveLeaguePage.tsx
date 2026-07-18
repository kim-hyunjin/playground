import { useMemo, useState } from 'react'
import { countByLevel, FIRST_TEAM_MAX, FARM_TEAM_MAX } from '../engine/roster'
import { formatSalary, isPitcher, overallRating } from '../engine/generator'
import { isDraftComplete, draftProgressLabel } from '../engine/draft'
import { OFFSEASON_BUDGET_BONUS, STOVE_TOTAL_WEEKS } from '../engine/stoveLeague'
import { OvrBadge } from '../components/PlayerCard'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import { ContractNegotiationPanel } from '../components/ContractNegotiationPanel'

export function StoveLeaguePage() {
  const {
    state,
    userTeam,
    signFreeAgent,
    advanceStoveWeek,
    startNextSeason,
    setView,
  } = useGame()
  const [roleFilter, setRoleFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
  const [message, setMessage] = useState('')

  const listings = useMemo(() => {
    if (!state) return []
    return state.freeAgents
      .filter((l) =>
        roleFilter === 'all' ||
        (roleFilter === 'pitcher' ? isPitcher(l.player) : !isPitcher(l.player)),
      )
      .sort((a, b) => overallRating(b.player) - overallRating(a.player))
  }, [state, roleFilter])

  if (!state || !userTeam || state.phase !== 'stove') {
    return (
      <div className="bm-animate-in">
        <p className="text-[var(--text-muted)]">스토브리그 기간이 아닙니다.</p>
      </div>
    )
  }

  const stoveWeek = state.stoveWeek ?? 1
  const stoveTotal = state.stoveTotalWeeks ?? STOVE_TOTAL_WEEKS
  const stoveDone = stoveWeek >= stoveTotal
  const firstCount = countByLevel(userTeam, 'first')
  const farmCount = countByLevel(userTeam, 'farm')
  const rosterFull = firstCount >= FIRST_TEAM_MAX && farmCount >= FARM_TEAM_MAX
  const unresolvedContracts = (state.contractNegotiations ?? []).some((item) => item.status === 'pending' || item.status === 'countered')

  const handleSign = (playerId: string, askingSalary: number) => {
    if (userTeam.budget < askingSalary) {
      setMessage('예산이 부족합니다.')
      return
    }
    if (rosterFull) {
      setMessage('1군·2군 등록 정원이 모두 가득 찼습니다.')
      return
    }

    const ok = signFreeAgent(playerId)
    if (ok) {
      const listing = state.freeAgents.find((l) => l.player.id === playerId)
      setMessage(`${listing?.player.name ?? '선수'} FA 영입 완료!`)
    } else {
      setMessage('영입에 실패했습니다.')
    }
  }

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">
            {state.seasonYear} 스토브리그
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            FA 영입 · {stoveWeek}/{stoveTotal}주차 · 잔여 FA {listings.length}명
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            잔여 예산 {formatSalary(userTeam.budget)} · 1군 {firstCount}/{FIRST_TEAM_MAX} · 2군 {farmCount}/{FARM_TEAM_MAX}
            {' · '}시즌 종료 보너스 +{formatSalary(OFFSEASON_BUDGET_BONUS)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="bm-btn bm-btn-ghost text-xs"
            disabled={stoveDone}
            onClick={() => {
              advanceStoveWeek()
              setMessage('한 주가 지났습니다. 타 구단 FA 영입이 진행되었습니다.')
            }}
          >
            다음 주 (CPU 영입)
          </button>
          <button
            type="button"
            className="bm-btn bm-btn-primary text-xs"
            disabled={unresolvedContracts}
            title={unresolvedContracts ? '재계약 협상을 먼저 마무리하세요.' : undefined}
            onClick={() => {
              if (window.confirm(`${state.seasonYear + 1} 시즌을 시작할까요?`)) {
                startNextSeason()
              }
            }}
          >
            {state.seasonYear + 1} 시즌 시작
          </button>
        </div>
      </div>

      {message && (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-sm text-[var(--text-h)]">
          {message}
        </p>
      )}

      <ContractNegotiationPanel />

      <div className="bm-card p-4 text-sm text-[var(--text-muted)]">
        {!isDraftComplete(state.draft) && (
          <p className="mb-2 text-[var(--text-h)]">
            드래프트 진행 중: {draftProgressLabel(state.draft)} —{' '}
            <button type="button" className="text-[var(--accent)] underline" onClick={() => setView('draft')}>
              드래프트로 이동
            </button>
          </p>
        )}
        계약 만료·FA 자격 선수와 해외·独立 FA가 풀에 등록됩니다. 주차를 진행하면 AI 구단도 영입합니다.
        {stoveDone
          ? ' 스토브리그 기간이 끝났습니다. 새 시즌을 시작하세요.'
          : ' 준비가 끝나면 언제든 새 시즌을 시작할 수 있습니다.'}
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'batter', 'pitcher'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`bm-btn text-xs ${roleFilter === f ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setRoleFilter(f)}
          >
            {f === 'all' ? '전체' : f === 'batter' ? '타자' : '투수'}
          </button>
        ))}
      </div>

      <div className="bm-card overflow-x-auto">
        <table className="bm-table">
          <thead>
            <tr>
              <th>선수</th>
              <th>포지션</th>
              <th>나이</th>
              <th>OVR</th>
              <th>희망 연봉</th>
              <th>전 소속</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-[var(--text-muted)]">
                  FA 풀이 비었습니다.
                </td>
              </tr>
            ) : (
              listings.map((l) => {
                const p = l.player
                const affordable = userTeam.budget >= l.askingSalary
                return (
                  <tr key={p.id}>
                    <td>
                      <PlayerNameButton playerId={p.id} name={p.name} />
                    </td>
                    <td>{POSITION_LABEL[p.role]}</td>
                    <td>{p.age}</td>
                    <td>
                      <OvrBadge player={p} />
                    </td>
                    <td>{formatSalary(l.askingSalary)}</td>
                    <td className="text-xs text-[var(--text-muted)]">{l.formerTeamName ?? '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="bm-btn bm-btn-primary text-xs"
                        disabled={!affordable || rosterFull}
                        onClick={() => handleSign(p.id, l.askingSalary)}
                      >
                        영입
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
