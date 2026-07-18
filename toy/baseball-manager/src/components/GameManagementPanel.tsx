import { useMemo, useState } from 'react'
import { overallRating } from '../engine/generator'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'

export function GameManagementPanel() {
  const {
    activeGameSession,
    userTeam,
    pauseActiveGame,
    substitutePitcher,
    substituteBatter,
    substituteRunner,
  } = useGame()
  const [message, setMessage] = useState('')
  const [targetOrder, setTargetOrder] = useState(0)
  const [open, setOpen] = useState(false)

  const roster = activeGameSession?.userRoster
  const pitchCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const log of activeGameSession?.resolvedResult.logs.slice(0, activeGameSession.cursor) ?? []) {
      if (log.pitcherId && log.eventType !== 'stolenBase') {
        counts.set(log.pitcherId, (counts.get(log.pitcherId) ?? 0) + (log.outcome === 'walk' ? 4 : 1))
      }
    }
    return counts
  }, [activeGameSession])

  if (!activeGameSession || !roster || !userTeam || activeGameSession.status === 'complete') return null
  const player = (id: string) => userTeam.players.find((item) => item.id === id)
  const selectedSlot = roster.lineup.find((slot) => slot.battingOrder === targetOrder)
  const situation = activeGameSession.resolvedResult.logs[Math.max(0, activeGameSession.cursor - 1)]?.situationAfter
  const runnerIds = [situation?.runners.firstId, situation?.runners.secondId, situation?.runners.thirdId].filter((id): id is string => Boolean(id && roster.lineup.some((slot) => slot.playerId === id)))

  const act = (action: () => string) => {
    pauseActiveGame()
    setMessage(action())
  }

  return (
    <>
      <button type="button" className="bm-card flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold text-[var(--text-h)]" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span>경기 운용 <small className="ml-2 font-normal text-[var(--text-muted)]">투수·대타·대주자 교체</small></span>
        <span className="text-xs text-[var(--text-muted)]">열기</span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={() => setOpen(false)}>
          <section className="bm-card flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="game-management-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 id="game-management-title" className="font-semibold text-[var(--text-h)]">경기 운용</h2>
              <button type="button" className="bm-btn bm-btn-ghost py-1 text-xs" onClick={() => setOpen(false)}>닫기</button>
            </div>
            <div className="space-y-5 overflow-y-auto p-5">
        <p className="text-xs text-[var(--text-muted)]">교체를 실행하면 경기가 일시정지됩니다.</p>
        {message ? <p className="rounded bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--accent)]">{message}</p> : null}

      <section>
        <h3 className="mb-2 text-sm font-semibold text-[var(--text-h)]">불펜</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {roster.bullpenIds.map((id) => {
            const pitcher = player(id)
            if (!pitcher) return null
            return (
              <button key={id} type="button" className="bm-btn bm-btn-ghost justify-between text-xs" onClick={() => act(() => substitutePitcher(id))}>
                <span>{pitcher.name} · OVR {overallRating(pitcher)}</span>
                <span>피로 {pitcher.fatigue} · {pitchCounts.get(id) ?? 0}구</span>
              </button>
            )
          })}
        </div>
      </section>

      {runnerIds.length > 0 ? <section>
        <h3 className="mb-2 text-sm font-semibold text-[var(--text-h)]">대주자</h3>
        {runnerIds.map((runnerId) => (
          <div key={runnerId} className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-sm">{player(runnerId)?.name} 대신</span>
            {roster.benchIds.map((id) => {
              const candidate = player(id)
              return candidate ? <button key={id} type="button" className="bm-btn bm-btn-ghost py-1 text-xs" onClick={() => act(() => substituteRunner(runnerId, id))}>{candidate.name} (주력 {candidate.speed})</button> : null
            })}
          </div>
        ))}
      </section> : null}

        <section>
          <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="mr-2 text-sm font-semibold text-[var(--text-h)]">대타·수비 교체</h3>
          <select className="bm-input w-auto py-1" value={targetOrder} onChange={(e) => setTargetOrder(Number(e.target.value))}>
            {roster.lineup.map((slot) => (
              <option key={slot.battingOrder} value={slot.battingOrder}>
                {slot.battingOrder + 1}번 {player(slot.playerId)?.name} ({POSITION_LABEL[slot.position]})
              </option>
            ))}
          </select>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {roster.benchIds.map((id) => {
            const batter = player(id)
            if (!batter) return null
            const eligible = batter.role === selectedSlot?.position || batter.role === 'DH'
            return (
              <button
                key={id}
                type="button"
                className="bm-btn bm-btn-ghost justify-between text-xs"
                disabled={!eligible}
                title={eligible ? undefined : '현재 수비 포지션을 맡을 수 없습니다.'}
                onClick={() => act(() => substituteBatter(targetOrder, id))}
              >
                <span>{batter.name} · {POSITION_LABEL[batter.role]}</span>
                <span>OVR {overallRating(batter)} · 피로 {batter.fatigue}</span>
              </button>
            )
          })}
          </div>
        </section>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
