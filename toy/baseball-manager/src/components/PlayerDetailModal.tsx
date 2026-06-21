import { useEffect, useState } from 'react'
import { formatSalary, isPitcher } from '../engine/generator'
import { rosterLevelOf } from '../engine/roster'
import { findPlayerInLeague } from '../engine/playerLookup'
import { PlayerCard, StatBar } from './PlayerCard'
import { SabermetricsPanel } from './SabermetricsPanel'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'

export function PlayerDetailModal() {
  const { state, userTeam, focusedPlayerId, closePlayer, releasePlayer, promotePlayer, demotePlayer } = useGame()
  const [tab, setTab] = useState<'stats' | 'attrs'>('stats')

  useEffect(() => {
    if (!focusedPlayerId) return
    setTab('stats')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePlayer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusedPlayerId, closePlayer])

  if (!state || !focusedPlayerId) return null

  const found = findPlayerInLeague(state.teams, focusedPlayerId)
  if (!found) return null

  const { player, team } = found
  const isOwnPlayer = userTeam?.id === team.id
  const level = rosterLevelOf(player)
  const statsSource = level === 'farm' ? 'farm' : 'season'

  const handleRelease = () => {
    if (!isOwnPlayer) return
    releasePlayer(player.id)
    closePlayer()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={closePlayer}
      role="presentation"
    >
      <div
        className="bm-animate-in max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-detail-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--panel)] px-5 py-4">
          <div>
            <div className="text-xs text-[var(--text-muted)]" style={{ color: team.color }}>
              {team.city} {team.name}
            </div>
            <h2 id="player-detail-title" className="text-xl font-bold text-[var(--text-h)]">
              {player.name}
            </h2>
            <div className="text-sm text-[var(--text-muted)]">
              {level === 'farm' ? '2군' : '1군'} · {POSITION_LABEL[player.role]} · {player.age}세 · {formatSalary(player.salary)}
            </div>
          </div>
          <button type="button" className="bm-btn bm-btn-ghost px-3 py-2" onClick={closePlayer} aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5">
          <PlayerCard player={player} interactive={false} />

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
              속성
            </button>
          </div>

          {tab === 'stats' ? (
            <SabermetricsPanel player={player} statsSource={statsSource} />
          ) : (
            <div className="bm-card space-y-3 p-4">
              <StatBar label="사기" value={player.morale} />
              <StatBar label="피로" value={player.fatigue} />
              {!isPitcher(player) && <StatBar label="수비" value={player.fielding} />}
              {isOwnPlayer && level === 'farm' && (
                <button
                  type="button"
                  className="bm-btn bm-btn-primary w-full text-xs"
                  onClick={() => { promotePlayer(player.id); closePlayer() }}
                >
                  1군 승격
                </button>
              )}
              {isOwnPlayer && level === 'first' && (
                <button
                  type="button"
                  className="bm-btn bm-btn-ghost w-full text-xs"
                  onClick={() => { demotePlayer(player.id); closePlayer() }}
                >
                  2군으로 보내기
                </button>
              )}
              {isOwnPlayer && (
                <button
                  type="button"
                  className="bm-btn bm-btn-ghost w-full text-[var(--danger)]"
                  onClick={handleRelease}
                >
                  방출 (+30% 연봉 환급)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
