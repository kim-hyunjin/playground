import { useState } from 'react'
import { calcOps, calcWoba, calcFip, calcWhip } from '../engine/sabermetrics'
import { formatSalary, isBatter, isPitcher, overallRating } from '../engine/generator'
import { OvrBadge, PlayerCard, StatBar } from '../components/PlayerCard'
import { SabermetricsBadge, SabermetricsPanel } from '../components/SabermetricsPanel'
import { useGame } from '../store/gameStore'
import type { Player } from '../types/game'
import { POSITION_LABEL } from '../types/game'

export function SquadPage() {
  const { userTeam, state, releasePlayer } = useGame()
  const [selected, setSelected] = useState<Player | null>(null)
  const [filter, setFilter] = useState<'all' | 'batter' | 'pitcher'>('all')
  const [tab, setTab] = useState<'attrs' | 'stats'>('stats')

  if (!userTeam || !state) return null

  const players = userTeam.players
    .filter((p) => filter === 'all' || (filter === 'batter' ? isBatter(p) : isPitcher(p)))
    .sort((a, b) => overallRating(b) - overallRating(a))

  function keyStat(p: Player): string {
    if (isPitcher(p) && p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0) {
      return calcFip(p.seasonStats).toFixed(2)
    }
    if (!isPitcher(p) && p.seasonStats.type === 'batter' && p.seasonStats.pa > 0) {
      return calcWoba(p.seasonStats).toFixed(3)
    }
    return '-'
  }

  function keyStat2(p: Player): string {
    if (isPitcher(p) && p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0) {
      return calcWhip(p.seasonStats).toFixed(2)
    }
    if (!isPitcher(p) && p.seasonStats.type === 'batter' && p.seasonStats.pa > 0) {
      return calcOps(p.seasonStats).toFixed(3)
    }
    return '-'
  }

  const statCol1 = filter === 'pitcher' ? 'FIP' : filter === 'batter' ? 'wOBA' : 'wOBA/FIP'
  const statCol2 = filter === 'pitcher' ? 'WHIP' : filter === 'batter' ? 'OPS' : 'OPS/WHIP'

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">스쿼드</h1>
          <p className="text-sm text-[var(--text-muted)]">{userTeam.players.length}명 · 세이버매트릭스 스탯 포함</p>
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
                <th>Pos</th>
                <th>OVR</th>
                <th>{statCol1}</th>
                <th>{statCol2}</th>
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
                  <td className="font-mono text-[var(--accent)]">{keyStat(p)}</td>
                  <td className="font-mono text-[var(--text-muted)]">{keyStat2(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          {selected ? (
            <div className="space-y-4">
              <PlayerCard player={selected} />
              <SabermetricsBadge player={selected} />

              <div className="flex gap-2">
                <button
                  type="button"
                  className={`bm-btn flex-1 text-xs ${tab === 'stats' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
                  onClick={() => setTab('stats')}
                >
                  세이버매트릭스
                </button>
                <button
                  type="button"
                  className={`bm-btn flex-1 text-xs ${tab === 'attrs' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
                  onClick={() => setTab('attrs')}
                >
                  속성 / 관리
                </button>
              </div>

              {tab === 'stats' ? (
                <SabermetricsPanel player={selected} />
              ) : (
                <div className="bm-card space-y-3 p-4">
                  <h3 className="font-semibold text-[var(--text-h)]">속성 · {formatSalary(selected.salary)}</h3>
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
              )}
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
