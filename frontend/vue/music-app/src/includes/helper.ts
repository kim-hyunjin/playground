export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60) || 0
  const reserveSeconds = Math.round(seconds - minutes * 60) || 0

  return `${minutes}:${reserveSeconds < 10 ? '0' : ''}${reserveSeconds}`
}
