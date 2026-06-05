export default function Header() {
  return (
    <header className="border-b border-[var(--border)] px-4 py-5 md:px-8">
      <h1 className="text-2xl font-semibold text-[var(--text-h)]">구종별 궤적</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        우완 투수 기준 · 실제 mph 비행 시간 · 재생으로 구종별 브레이크 비교
      </p>
    </header>
  )
}
