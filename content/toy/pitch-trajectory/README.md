# Pitch Trajectory

야구 구종별 대표 궤적을 **3D**(Three.js)로 시각화하는 교육용 데모입니다.

## 기능

- 8종 구종 (포심, 투심, 커터, 슬라이더, 커브, 체인지업, 스플릿터, 너클볼)
- **3D 궤적**: 투수·홈플레이트 표시, 공 비행 애니메이션, 카메라 프리셋(포수/투수/측면) + 자유 이동
- **1× = 실제 mph 기준 비행 시간** (95mph ≈ 0.40초, 릴리스→플레이트 55ft)
- 중력 포물선 + Statcast IVB/HB 기반 궤적 (우완 대표값)
- 재생 속도 0.25× ~ 2× (슬로모 / 배속)

## 실행

```bash
cd content/toy/pitch-trajectory
npm install
npm run dev
```

## 테스트

```bash
npm test
npm run build
```

## 스택

Vite · React 19 · TypeScript · Tailwind 4 · Three.js · React Three Fiber · Vitest
