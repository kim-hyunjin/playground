export interface PlaybackFabProps {
  isPlaying: boolean
  disabled: boolean
  onToggle: () => void
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.14v13.72L19 12 8 5.14z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  )
}

export default function PlaybackFab({ isPlaying, disabled, onToggle }: PlaybackFabProps) {
  return (
    <button
      type="button"
      className="pt-fab"
      disabled={disabled}
      onClick={onToggle}
      aria-label={isPlaying ? '일시정지' : '재생'}
      title={isPlaying ? '일시정지' : '재생'}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  )
}
