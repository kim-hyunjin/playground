/** Stable random player id — not tied to team (trades / FA safe). */
export function newPlayerId(): string {
  return crypto.randomUUID()
}
