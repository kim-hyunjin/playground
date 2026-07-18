import { useEffect, useState } from 'react'
import { formatSalary, isPitcher } from '../engine/generator'
import { rosterLevelOf } from '../engine/roster'
import { evaluateCallUpCandidate } from '../engine/callUpEvaluation'
import { findPlayerInLeague } from '../engine/playerLookup'
import { PlayerCard, StatBar } from './PlayerCard'
import { SabermetricsPanel } from './SabermetricsPanel'
import { CallUpBadge, InjuryBadge } from './RosterBadges'
import { DevelopmentPanel } from './DevelopmentPanel'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import { formatHandedness } from '../engine/sim/handedness'

export function PlayerDetailModal() {
  const { state, userTeam, focusedPlayerId, closePlayer, releasePlayer, promotePlayer, demotePlayer, sendToRehab } = useGame()
  const [tab, setTab] = useState<'stats' | 'attrs' | 'dev'>('stats')

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
  const callUpEval =
    isOwnPlayer && level === 'farm' && userTeam
      ? evaluateCallUpCandidate(userTeam, player)
      : null
  const isSuggested =
    callUpEval?.eligible &&
    state.callUpSuggestions.some((s) => s.playerId === player.id)

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
            <div className="text-xs text-[var(--text-muted)]">
              {team.name}
            </div>
            <h2 id="player-detail-title" className="text-xl font-bold text-[var(--text-h)]">
              {player.name}
            </h2>
            <div className="text-sm text-[var(--text-muted)]">
              {level === 'farm' ? '2군' : '1군'} · {POSITION_LABEL[player.role]} · {formatHandedness(player)} · {player.age}세 · {formatSalary(player.salary)}
              {(player.contractYears ?? 1) > 0 ? (
                <span className="ml-2 text-xs">· 잔여 계약 {player.contractYears}년</span>
              ) : (
                <span className="ml-2 text-xs text-orange-300">· FA 임박</span>
              )}
              <InjuryBadge player={player} />
              {player.dataSeason ? (
                <span className="ml-2 rounded bg-[var(--accent-dim)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                  {player.dataSeason} 실명
                </span>
              ) : null}
              {player.isGenerated ? (
                <span className="ml-1 rounded bg-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)]">
                  생성
                </span>
              ) : null}
            </div>
            {callUpEval?.eligible && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <CallUpBadge />
                {isSuggested && (
                  <span className="text-xs text-[var(--warning)]">2군 감독 제안 중</span>
                )}
                {callUpEval.reason && (
                  <span className="text-xs text-[var(--text-muted)]">{callUpEval.reason}</span>
                )}
              </div>
            )}
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
              className={`bm-btn flex-1 text-xs ${tab === 'dev' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
              onClick={() => setTab('dev')}
            >
              육성
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
          ) : tab === 'dev' ? (
            <DevelopmentPanel player={player} />
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
              {isOwnPlayer && level === 'first' && (player.injuryDays ?? 0) > 0 && (
                <button
                  type="button"
                  className="bm-btn bm-btn-primary w-full text-xs"
                  onClick={() => { sendToRehab(player.id); closePlayer() }}
                >
                  2군 재활 배치 (회복 가속)
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
