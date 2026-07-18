import { useState } from 'react'
import { formatSalary } from '../engine/generator'
import { useGame } from '../store/gameStore'

export function ContractNegotiationPanel() {
  const { state, userTeam, negotiateContract } = useGame()
  const [offers, setOffers] = useState<Record<string, { salary: number; years: number }>>({})
  const [message, setMessage] = useState('')
  if (!state || !userTeam) return null
  const negotiations = state.contractNegotiations ?? []
  if (negotiations.length === 0) return null

  const subjectName = (type: 'player' | 'coach', id: string) => type === 'player'
    ? userTeam.players.find((p) => p.id === id)?.name
    : userTeam.coaches.find((c) => c.id === id)?.name

  return (
    <section className="bm-card space-y-3 p-4">
      <div>
        <h2 className="font-semibold text-[var(--text-h)]">재계약 협상</h2>
        <p className="text-xs text-[var(--text-muted)]">최대 3회 제안할 수 있으며 낮은 제안이 반복되면 협상이 결렬됩니다.</p>
      </div>
      {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}
      <div className="space-y-2">
        {negotiations.map((item) => {
          const offer = offers[item.id] ?? { salary: item.askingSalary, years: item.askingYears }
          const done = item.status === 'accepted' || item.status === 'rejected'
          return (
            <div key={item.id} className="grid items-center gap-2 rounded border border-[var(--border)] p-3 md:grid-cols-[1fr_150px_100px_auto]">
              <div className="text-sm">
                <b className="text-[var(--text-h)]">{subjectName(item.subjectType, item.subjectId) ?? item.subjectId}</b>
                <span className="ml-2 text-xs text-[var(--text-muted)]">{item.subjectType === 'player' ? '선수' : '코치'} · 요구 {formatSalary(item.askingSalary)} / {item.askingYears}년 · {item.attempts}/3회</span>
              </div>
              <input className="bm-input py-1" type="number" min="100000" step="10000" disabled={done} value={offer.salary} onChange={(e) => setOffers({ ...offers, [item.id]: { ...offer, salary: Number(e.target.value) } })} />
              <select className="bm-input py-1" disabled={done} value={offer.years} onChange={(e) => setOffers({ ...offers, [item.id]: { ...offer, years: Number(e.target.value) } })}>
                {[1, 2, 3, 4, 5].map((year) => <option key={year} value={year}>{year}년</option>)}
              </select>
              <button type="button" className="bm-btn bm-btn-primary text-xs" disabled={done} onClick={() => setMessage(negotiateContract(item.id, offer.salary, offer.years))}>
                {item.status === 'accepted' ? '합의' : item.status === 'rejected' ? '결렬' : item.status === 'countered' ? '재제안' : '제안'}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
