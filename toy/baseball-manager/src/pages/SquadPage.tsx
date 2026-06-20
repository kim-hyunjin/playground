import { useState } from 'react'
import { formatSalary, isBatter, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge, PlayerCard, StatBar } from '../components/PlayerCard'
import { useGame } from '../store/gameStore'
import type { Player } from '../types/game'
import { POSITION_LABEL } from '../types/game'

export function SquadPage() {
  const { userTeam, releasePlayer } = useGame()
  const [selected, setSelected] = useState<Player | null>(null)
  const [filter, setFilter] = useState<'all' | 'batter' | 'pitcher'>('all')

  if (!userTeam) return null

  const players = userTeam.players
    .filter((p) => filter === 'all' || (filter === 'batter' ? isBatter(p) : isPitcher(p)))
    .sort((a, b) => overallRating(b) - overallRating(a))

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">스쿼드</h1>
          <p className="text-sm text-[var(--text-muted)]">{userTeam.players.length}명 · 선수 클릭으로 상세 보기</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'batter', 'pitcher'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`bm-btn text-xs ${filter === f ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '전체' : f === 'batter' ? '타자' : '투수'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="bm-card overflow-hidden">
          <table className="bm-table">
            <thead>
              <tr>
                <th>선수</th>
                <th>포지션</th>
                <th>OVR</th>
                <th>연봉</th>
                <th>피로</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr
                  key={p.id}
                  className={`cursor-pointer ${selected?.id === p.id ? 'bg-[var(--accent-dim)]' : ''}`}
                  onClick={() => setSelected(p)}
                >
                  <td className="font-medium">{p.name}</td>
                  <td>{POSITION_LABEL[p.role]}</td>
                  <td><OvrBadge player={p} /></td>
                  <td className="text-[var(--text-muted)]">{formatSalary(p.salary)}</td>
                  <td>
                    <span className={p.fatigue > 60 ? 'text-[var(--danger)]' : ''}>{p.fatigue}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          {selected ? (
            <div className="space-y-4">
              <PlayerCard player={selected} />
              <div className="bm-card p-4 space-y-3">
                <h3 className="font-semibold text-[var(--text-h)]">상세 정보</h3>
                <StatBar label="사기" value={selected.morale} />
                <StatBar label="피로" value={selected.fatigue} />
                {!isPitcher(selected) && <StatBar label="수비" value={selected.fielding} />}
                <button
                  type="button"
                  className="bm-btn bm-btn-ghost w-full text-[var(--danger)]"
                  onClick={() => { releasePlayer(selected.id); setSelected(null) }}
                >
                  방출 (+30% 연봉 환급)
                </button>
              </div>
            </div>
          ) : (
            <div className="bm-card flex h-64 items-center justify-center text-[var(--text-muted)]">
              선수를 선택하세요
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
