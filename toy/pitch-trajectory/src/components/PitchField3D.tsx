import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { PitchDefinition } from '../data/pitches.ts'
import { RELEASE_DISTANCE_FT } from '../data/pitches.ts'
import { buildTrajectory, interpolatePoint3D } from '../lib/trajectory.ts'

const ZONE_WIDTH_FT = 17 / 12
const ZONE_BOTTOM_FT = 1.5
const ZONE_TOP_FT = 3.5
const MOUND_RADIUS_FT = 9
const MOUND_HEIGHT_FT = 0.85
/** Distance from plate to release point (ft). */
const RELEASE_Z_FT = RELEASE_DISTANCE_FT
/** Mound sits behind the rubber, toward center field. */
const MOUND_Z_FT = RELEASE_DISTANCE_FT + 2

type CameraPresetId = 'catcher' | 'pitcher' | 'side'

const CAMERA_PRESETS: Record<
  CameraPresetId,
  { label: string; position: [number, number, number]; target: [number, number, number] }
> = {
  catcher: {
    label: '포수',
    position: [0, 2.4, -7],
    target: [0, 2.4, 24],
  },
  pitcher: {
    label: '투수',
    position: [0, 5.5, RELEASE_Z_FT - 1],
    target: [0, 2.2, 16],
  },
  side: {
    label: '측면',
    position: [24, 5.5, RELEASE_DISTANCE_FT / 2],
    target: [0, 3.2, RELEASE_DISTANCE_FT / 2],
  },
}

interface TrajectoryItem {
  pitch: PitchDefinition
  path3D: ReturnType<typeof buildTrajectory>['path3D']
  reference3D: ReturnType<typeof buildTrajectory>['reference3D']
}

interface SceneProps {
  trajectories: TrajectoryItem[]
  progressByPitchId: Record<string, number>
  highlightedId: string | null
  onHighlight: (id: string | null) => void
  cameraPreset: CameraPresetId
}

function toVectors(points: { x: number; y: number; z: number }[]) {
  return points.map((p) => [p.x, p.y, p.z] as [number, number, number])
}

function HomePlate() {
  const w = ZONE_WIDTH_FT
  const d = 8.5 / 12
  const y = 0.04
  const outline: [number, number, number][] = [
    [0, y, d],
    [w / 2, y, d * 0.35],
    [w / 2, y, -d * 0.65],
    [-w / 2, y, -d * 0.65],
    [-w / 2, y, d * 0.35],
    [0, y, d],
  ]

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[w + 0.6, d * 2 + 0.4]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <Line points={outline} color="#f8fafc" lineWidth={2.5} />
    </group>
  )
}

function PitcherMound({ hideBody }: { hideBody?: boolean }) {
  const releaseLocalZ = RELEASE_Z_FT - MOUND_Z_FT

  return (
    <group position={[0, 0, MOUND_Z_FT]}>
      {!hideBody ? (
        <>
          <mesh position={[0, MOUND_HEIGHT_FT / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[MOUND_RADIUS_FT, MOUND_RADIUS_FT + 1.2, MOUND_HEIGHT_FT, 32]} />
            <meshStandardMaterial color="#8b7355" />
          </mesh>
          <mesh position={[0, MOUND_HEIGHT_FT + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[MOUND_RADIUS_FT, 32]} />
            <meshStandardMaterial color="#6b5344" />
          </mesh>
          <Line
            points={[
              [-MOUND_RADIUS_FT, MOUND_HEIGHT_FT + 0.05, 0],
              [MOUND_RADIUS_FT, MOUND_HEIGHT_FT + 0.05, 0],
            ]}
            color="#d4a574"
            lineWidth={1}
          />
        </>
      ) : null}
      <mesh position={[0, MOUND_HEIGHT_FT + 0.15, releaseLocalZ]}>
        <boxGeometry args={[1, 0.06, 0.5]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      <mesh position={[0, 6, releaseLocalZ]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.35} />
      </mesh>
    </group>
  )
}

function StrikeZone() {
  const w = ZONE_WIDTH_FT
  const h = ZONE_TOP_FT - ZONE_BOTTOM_FT
  const midY = (ZONE_TOP_FT + ZONE_BOTTOM_FT) / 2
  const hw = w / 2
  const hh = h / 2

  const corners: [number, number, number][] = [
    [-hw, midY - hh, 0.06],
    [hw, midY - hh, 0.06],
    [hw, midY + hh, 0.06],
    [-hw, midY + hh, 0.06],
    [-hw, midY - hh, 0.06],
  ]

  return (
    <group>
      <Line points={corners} color="#22c55e" lineWidth={2} />
      <mesh position={[0, midY, 0.05]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

function Field() {
  const midZ = RELEASE_DISTANCE_FT / 2
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, midZ]} receiveShadow>
        <planeGeometry args={[42, RELEASE_DISTANCE_FT + 16]} />
        <meshStandardMaterial color="#1a472a" />
      </mesh>
      <Line
        points={[
          [0, 0.03, 0],
          [0, 0.03, RELEASE_Z_FT],
        ]}
        color="#4ade80"
        lineWidth={1.5}
        transparent
        opacity={0.45}
      />
      <Line
        points={[
          [-3, 0.03, 0],
          [-3, 0.03, RELEASE_Z_FT],
        ]}
        color="#166534"
        lineWidth={1}
        transparent
        opacity={0.25}
      />
      <Line
        points={[
          [3, 0.03, 0],
          [3, 0.03, RELEASE_Z_FT],
        ]}
        color="#166534"
        lineWidth={1}
        transparent
        opacity={0.25}
      />
    </>
  )
}

function PitchPaths({
  trajectories,
  progressByPitchId,
  highlightedId,
  onHighlight,
}: Omit<SceneProps, 'cameraPreset'>) {
  return (
    <>
      {trajectories.map(({ pitch, path3D, reference3D }) => {
        const progress = progressByPitchId[pitch.id] ?? 0
        const dimmed = highlightedId !== null && highlightedId !== pitch.id
        const emphasized = highlightedId === pitch.id
        const ball = interpolatePoint3D(path3D, progress)
        const isIdle = progress <= 0.001
        const isFlying = progress > 0.001 && progress < 0.999

        const baseOpacity = dimmed ? 0.08 : emphasized ? 0.38 : 0.22
        const lineWidth = emphasized ? 1.8 : 1.2

        const splitIndex = isFlying
          ? Math.min(
              path3D.length - 1,
              Math.ceil(progress * (path3D.length - 1)),
            )
          : path3D.length - 1

        const linePoints = isFlying
          ? [...path3D.slice(0, splitIndex + 1), ball]
          : path3D

        return (
          <group
            key={pitch.id}
            onPointerOver={(e) => {
              e.stopPropagation()
              onHighlight(pitch.id)
            }}
            onPointerOut={() => onHighlight(null)}
          >
            {isIdle ? (
              <Line
                points={toVectors(reference3D)}
                color={pitch.color}
                lineWidth={1}
                dashed
                dashSize={0.8}
                gapSize={0.5}
                transparent
                opacity={baseOpacity * 0.45}
              />
            ) : null}
            {linePoints.length > 1 ? (
              <Line
                points={toVectors(linePoints)}
                color={pitch.color}
                lineWidth={lineWidth}
                transparent
                opacity={baseOpacity}
              />
            ) : null}
            {!isIdle ? (
              <group position={[ball.x, ball.y, ball.z]}>
                <mesh>
                  <sphereGeometry args={[0.22, 16, 16]} />
                  <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
                </mesh>
                <mesh castShadow>
                  <sphereGeometry args={[0.17, 24, 24]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive={pitch.color}
                    emissiveIntensity={dimmed ? 0.15 : 0.55}
                    roughness={0.25}
                    metalness={0.05}
                  />
                </mesh>
              </group>
            ) : null}
          </group>
        )
      })}
    </>
  )
}

function CameraController({ preset }: { preset: CameraPresetId }) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useEffect(() => {
    const { position, target } = CAMERA_PRESETS[preset]
    camera.position.set(...position)
    if (controlsRef.current) {
      controlsRef.current.target.set(...target)
      controlsRef.current.update()
    }
  }, [preset, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableDamping
      dampingFactor={0.08}
      minDistance={3}
      maxDistance={55}
      maxPolarAngle={Math.PI * 0.49}
    />
  )
}

function Scene(props: SceneProps) {
  return (
    <>
      <color attach="background" args={['#0a1210']} />
      <fog attach="fog" args={['#0a1210', 55, 110]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 18, 8]} intensity={1.15} castShadow />
      <directionalLight position={[-8, 10, -4]} intensity={0.3} />

      <Field />
      <HomePlate />
      <PitcherMound hideBody={props.cameraPreset === 'pitcher'} />
      <StrikeZone />
      <PitchPaths {...props} />
      <CameraController preset={props.cameraPreset} />
    </>
  )
}

export interface PitchField3DProps {
  pitches: PitchDefinition[]
  progressByPitchId: Record<string, number>
  highlightedId: string | null
  onHighlight: (id: string | null) => void
}

export default function PitchField3D({
  pitches,
  progressByPitchId,
  highlightedId,
  onHighlight,
}: PitchField3DProps) {
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('catcher')

  const trajectories = useMemo(
    () =>
      pitches.map((pitch) => {
        const { path3D, reference3D } = buildTrajectory(pitch)
        return { pitch, path3D, reference3D }
      }),
    [pitches],
  )

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-medium text-[var(--text-h)]">3D 궤적</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            투수 → 홈플레이트 · 드래그/휠로 카메라 이동 · 프리셋으로 시점 전환
          </p>
        </div>
        <div className="flex gap-1.5">
          {(Object.entries(CAMERA_PRESETS) as [CameraPresetId, (typeof CAMERA_PRESETS)[CameraPresetId]][]).map(
            ([id, { label }]) => (
              <button
                key={id}
                type="button"
                onClick={() => setCameraPreset(id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  cameraPreset === id
                    ? 'bg-[var(--accent)] text-white'
                    : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-h)]'
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="h-[520px] w-full overflow-hidden rounded-lg bg-[#0a1210]">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
              3D 로딩 중…
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: CAMERA_PRESETS.catcher.position, fov: 50, near: 0.1, far: 140 }}
          >
            <Scene
              trajectories={trajectories}
              progressByPitchId={progressByPitchId}
              highlightedId={highlightedId}
              onHighlight={onHighlight}
              cameraPreset={cameraPreset}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  )
}
