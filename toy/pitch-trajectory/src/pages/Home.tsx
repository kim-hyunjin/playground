import { lazy, Suspense, useMemo, useState } from 'react'
import { PITCHES } from '../data/pitches.ts'
import { usePitchAnimation } from '../hooks/usePitchAnimation.ts'
import Header from '../components/Header.tsx'
import PlaybackControls from '../components/PlaybackControls.tsx'
import PlaybackFab from '../components/PlaybackFab.tsx'
import PitchSelector from '../components/PitchSelector.tsx'
import PitchLegend from '../components/PitchLegend.tsx'

const PitchField3D = lazy(() => import('../components/PitchField3D.tsx'))

const DEFAULT_SELECTED = new Set(['four-seam', 'slider', 'curve'])

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(DEFAULT_SELECTED)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const selectedPitches = useMemo(
    () => PITCHES.filter((p) => selectedIds.has(p.id)),
    [selectedIds],
  )

  const animation = usePitchAnimation(selectedPitches)

  const togglePitch = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <PlaybackControls
              speedMultiplier={animation.speedMultiplier}
              selectedCount={selectedPitches.length}
              onReset={animation.reset}
              onSpeedChange={animation.setSpeedMultiplier}
            />
            <PitchSelector
              pitches={PITCHES}
              selectedIds={selectedIds}
              onToggle={togglePitch}
              onSelectAll={() => setSelectedIds(new Set(PITCHES.map((p) => p.id)))}
              onClearAll={() => setSelectedIds(new Set())}
            />
          </aside>

          <section className="space-y-4">
            <PitchLegend
              pitches={selectedPitches}
              progressByPitchId={animation.progressByPitchId}
              highlightedId={highlightedId}
              onHighlight={setHighlightedId}
            />
            <Suspense
              fallback={
                <div className="flex h-[520px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--panel)] text-sm text-[var(--text-muted)]">
                  3D 뷰 로딩 중…
                </div>
              }
            >
              <PitchField3D
                pitches={selectedPitches}
                progressByPitchId={animation.progressByPitchId}
                highlightedId={highlightedId}
                onHighlight={setHighlightedId}
              />
            </Suspense>
          </section>
        </div>

        {selectedPitches.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedPitches.map((pitch) => (
              <div
                key={pitch.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 text-sm"
              >
                <div className="mb-1 flex items-center gap-2 font-medium text-[var(--text-h)]">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: pitch.color }}
                  />
                  {pitch.name}
                  <span className="text-xs font-normal text-[var(--text-muted)]">
                    {pitch.nameEn}
                  </span>
                </div>
                <p className="text-[var(--text-muted)]">{pitch.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <PlaybackFab
        isPlaying={animation.isPlaying}
        disabled={selectedPitches.length === 0}
        onToggle={() =>
          animation.isPlaying ? animation.pause() : animation.play()
        }
      />
    </>
  )
}
