import { useGame } from '../store/gameStore'
import { findPlayerInLeague } from '../engine/playerLookup'

interface PlayerNameButtonProps {
  playerId: string
  name?: string
  className?: string
}

export function PlayerNameButton({ playerId, name, className = '' }: PlayerNameButtonProps) {
  const { state, openPlayer } = useGame()
  if (!state) return <span className={className}>{name ?? '—'}</span>

  const resolved = name ?? findPlayerInLeague(state.teams, playerId)?.player.name ?? '—'

  return (
    <button
      type="button"
      className={`font-medium text-[var(--accent)] underline-offset-2 hover:underline ${className}`}
      onClick={(e) => {
        e.stopPropagation()
        openPlayer(playerId)
      }}
    >
      {resolved}
    </button>
  )
}
