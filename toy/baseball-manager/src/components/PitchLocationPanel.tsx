import { PITCH_CALL_LABEL, type LivePitch } from '../engine/livePitch'

interface Props {
  pitch?: LivePitch
}

export function PitchLocationPanel({ pitch }: Props) {
  return (
    <section className="bm-card p-3">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-semibold text-[var(--text-h)]">투구 위치</h2>
          <p className="text-xs text-[var(--text-muted)]">투수 시점 · 최신 투구</p>
        </div>
        {pitch ? (
          <div className="text-right tabular-nums">
            <b className="text-[var(--text-h)]">{pitch.type} · {pitch.speedKmh} km/h</b>
            <div className={`text-xs font-semibold ${pitch.call === 'ball' ? 'text-[var(--success)]' : pitch.call === 'strike' ? 'text-[var(--warning)]' : 'text-[var(--accent)]'}`}>
              {PITCH_CALL_LABEL[pitch.call]}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mx-auto aspect-square w-full max-w-52 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-3">
        <div className="relative h-full w-full" role="img" aria-label={pitch ? `${pitch.type} ${pitch.speedKmh}킬로미터, ${PITCH_CALL_LABEL[pitch.call]}` : '아직 투구되지 않음'}>
          <div className="absolute inset-x-[25%] bottom-[20%] top-[20%] grid grid-cols-3 grid-rows-3 border-2 border-[var(--text-muted)] opacity-70">
            {Array.from({ length: 9 }).map((_, index) => <span key={index} className="border border-[var(--border)]" />)}
          </div>
          {pitch ? (
            <span
              className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg ${pitch.call === 'ball' ? 'bg-[var(--success)]' : pitch.call === 'strike' ? 'bg-[var(--warning)]' : 'bg-[var(--accent)]'}`}
              style={{ left: `${pitch.x}%`, top: `${pitch.y}%` }}
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-sm text-[var(--text-muted)]">경기 진행을 시작하세요</span>
          )}
        </div>
      </div>
    </section>
  )
}
