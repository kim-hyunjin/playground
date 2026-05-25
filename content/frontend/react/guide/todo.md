# React Guide — Lesson Roadmap

추가 레슨을 하나씩 구현할 때 이 목록을 순서대로 진행하면 됩니다.  
각 항목은 `src/data/content.ts`에 레슨 추가 + (필요 시) 애니메이션 컴포넌트 + `animationType` 연결을 포함합니다.

**현재 레슨 (5):** Virtual DOM → 상태 업데이트 흐름 → Fiber → **Render vs Commit** → 훅 내부

---

## 구현 공통 체크리스트 (레슨마다)

- [ ] `src/data/content.ts` — `lessons` 배열에 `id`, `title`, `content`, `code`, `animationType` 추가
- [ ] `src/routes/lessons.$lessonId.tsx` — `animationType` switch 분기 (새 타입인 경우)
- [ ] `src/components/animations/` — 신규 또는 기존 애니메이션 확장
- [ ] 로컬에서 `/lessons/<id>` 열어 본문·코드·애니메이션 확인
- [ ] 이전/다음 레슨 네비게이션 순서가 의도한 커리큘럼 순서와 일치하는지 확인

---

## 1. Render vs Commit

**목표:** Fiber 다음 단계로, Render(가상 DOM 계산) → Commit(DOM 반영 + layout effect) → Passive(effect) 흐름을 분리해 설명.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `render-vs-commit` |
| 애니메이션 | `render-cycle` (기존 확장) |
| 선행 레슨 | `fiber-architecture` |
| 구현 메모 | Commit 단계에서 `useLayoutEffect` / `useEffect` 실행 시점을 단계 라벨로 표시 |

- [x] 레슨 본문·코드 예제 작성
- [x] `RenderVsCommitAnimation` 신규 (`render-vs-commit` 타입)
- [x] `content.ts` 등록 및 라우트 동작 확인

---

## 2. Reconciliation & key

**목표:** Virtual DOM의 “비교”를 구체화 — 같은 타입·다른 props, key 변경, 자식 순서 변경.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `reconciliation-and-key` |
| 애니메이션 | `jsx-structure` (확장) 또는 신규 `reconciliation` |
| 선행 레슨 | `virtual-dom` |
| 구현 메모 | 리스트에 key 없을 때 / 있을 때 DOM 재사용 차이를 시각화 |

- [ ] (선택) `Lesson.animationType`에 `"reconciliation"` 추가
- [ ] `ReconciliationAnimation.tsx` 신규 또는 `JSXAnimation` 확장
- [ ] 레슨 본문·코드 예제 작성
- [ ] `content.ts` 등록 및 라우트 동작 확인

---

## 3. Batching (React 18+)

**목표:** 이벤트 핸들러 / `setTimeout` / `fetch` 등에서 배칭 차이, `flushSync`로 배칭 끊기.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `batching` |
| 애니메이션 | `state-flow` (기존 확장) |
| 선행 레슨 | `state-update-flow` |
| 구현 메모 | 여러 `setState`가 한 번의 render로 묶이는 프레임 표시 |

- [ ] 레슨 본문·코드 예제 작성
- [ ] `StateFlowAnimation`에 “배칭됨 / flushSync로 분리” 모드 추가
- [ ] `content.ts` 등록 및 라우트 동작 확인

---

## 4. Effect 생명주기 (useEffect / useLayoutEffect)

**목표:** mount → update(destroy → create) → unmount, effect 큐와 deps의 역할.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `effect-lifecycle` |
| 애니메이션 | `hooks` (확장) 또는 신규 `effect-lifecycle` |
| 선행 레슨 | `hooks-internals`, `render-vs-commit` |
| 구현 메모 | Fiber `updateQueue`의 effect 리스트 순회를 단계별로 표시 |

- [ ] (선택) `animationType`에 `"effect-lifecycle"` 추가
- [ ] `EffectLifecycleAnimation.tsx` 신규 또는 `HooksAnimation` 확장
- [ ] 레슨 본문·코드 예제 작성
- [ ] `content.ts` 등록 및 라우트 동작 확인

---

## 5. Lane & 우선순위 (Fiber 심화)

**목표:** 긴급 업데이트 vs 지연 업데이트, 렌더 중단·재개와 `lanes` 개념 연결.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `lanes-and-priority` |
| 애니메이션 | `render-cycle` (기존 “중단” UI와 연동) |
| 선행 레슨 | `fiber-architecture` |
| 구현 메모 | `RenderCycleAnimation`의 interruption을 “높은 우선순위 작업” 시나리오로 라벨링 |

- [ ] 레슨 본문·코드 예제 작성
- [ ] `RenderCycleAnimation` 우선순위/중단 시나리오 정리
- [ ] `content.ts` 등록 및 라우트 동작 확인

---

## 6. useTransition & useDeferredValue

**목표:** 동시성 API — 긴급 UI는 즉시, 무거운 렌더는 지연.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `concurrency-apis` |
| 애니메이션 | `state-flow` (확장) 또는 신규 `concurrency` |
| 선행 레슨 | `lanes-and-priority`, `batching` |
| 구현 메모 | urgent / transition 업데이트 두 갈래로 state-flow 표현 |

- [ ] (선택) `animationType`에 `"concurrency"` 추가
- [ ] 애니메이션 컴포넌트 구현
- [ ] 레슨 본문·코드 예제 작성
- [ ] `content.ts` 등록 및 라우트 동작 확인

---

## 7. Context 내부

**목표:** Provider value가 Fiber에 어떻게 붙고, 구독 컴포넌트만 리렌더되는 이유.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `context-internals` |
| 애니메이션 | 신규 `context-tree` 권장 |
| 선행 레슨 | `hooks-internals`, `state-update-flow` |
| 구현 메모 | 트리에서 Provider / Consumer(또는 `use`) 범위 하이라이트 |

- [ ] `animationType`에 `"context-tree"` 추가
- [ ] `ContextTreeAnimation.tsx` 신규
- [ ] 레슨 본문·코드 예제 작성
- [ ] `content.ts` 등록 및 라우트 동작 확인

---

## 8. (선택) 에러 바운더리

**목표:** 하위 트리 실패 시 commit 단계에서 fallback UI로 전환.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `error-boundaries` |
| 애니메이션 | `render-cycle` 또는 신규 |
| 선행 레슨 | `render-vs-commit` |
| 구현 메모 | 정상 트리 → throw → boundary fallback 3단계 |

- [ ] 레슨 본문·코드 예제 작성
- [ ] 애니메이션 (간단한 트리 상태 전환)
- [ ] `content.ts` 등록 및 라우트 동기 확인

---

## 8-alt. (선택) Strict Mode 이중 렌더

**목표:** 개발 모드에서 mount가 두 번 도는 이유, effect 클린업 검증.

| 항목 | 내용 |
|------|------|
| 제안 `id` | `strict-mode-double-mount` |
| 애니메이션 | `effect-lifecycle` 또는 `hooks` |
| 선행 레슨 | `effect-lifecycle` |
| 구현 메모 | dev-only double invoke를 effect 큐와 함께 표시 |

- [ ] 레슨 본문·코드 예제 작성
- [ ] 애니메이션 연동
- [ ] `content.ts` 등록

> **8 vs 8-alt:** 둘 중 하나만 먼저 해도 됨. 로드맵 핵심 8개를 채운 뒤 추가.

---

## 권장 `lessons` 배열 순서 (완료 후)

1. `virtual-dom` *(기존)*
2. `state-update-flow` *(기존)*
3. `fiber-architecture` *(기존)*
4. `render-vs-commit` *(완료)*
5. `hooks-internals` *(기존)*
6. `reconciliation-and-key`
7. `batching`
8. `effect-lifecycle`
9. `lanes-and-priority`
10. `concurrency-apis`
11. `context-internals`
12. `error-boundaries` 또는 `strict-mode-double-mount` *(선택)*

---

## `animationType` 확장 백로그

`src/data/content.ts`의 `Lesson` 타입에 아래를 필요 시 추가:

| 타입 | 용도 | 관련 레슨 |
|------|------|-----------|
| `reconciliation` | diff / key | #2 |
| `effect-lifecycle` | effect 큐 | #4, 8-alt |
| `concurrency` | transition / defer | #6 |
| `context-tree` | context 구독 범위 | #7 |

기존 타입 재사용만으로 가능한 레슨: #1, #3, #5 (`render-cycle` / `state-flow` / `hooks` 확장).

---

## 추후 트랙 (내부 가이드 톤 유지 + 실무 보조)

내부 동작 커리큘럼 완료 후 별도 섹션 또는 태그로 추가 검토:

- [ ] **useRef vs useState** — 리렌더 없는 저장, DOM `stateNode` 연결
- [ ] **useMemo / useCallback** — 의존성·메모 위치 (React Compiler 한 줄 언급)
- [ ] **Suspense & fallback** — 부분 suspend (RSC 없이 클라이언트 관점)
- [ ] **컴포지션 패턴** — boolean prop 지양, compound components
- [ ] **폼·제어 컴포넌트** — controlled / uncontrolled
- [ ] **TanStack Router·Query** — 렌더 트리 + 캐시 (이 프로젝트 스택 연계)

---

## 메타 / UX (레슨 콘텐츠와 별도)

- [ ] 레슨 목록 페이지 (`/lessons`) — 사이드바 또는 인덱스에서 전체 커리큘럼 한눈에 보기
- [ ] 레슨 그룹 라벨 (예: 기초 / Fiber·동시성 / 훅·Effect / 선택)
- [ ] `README.md`에 로드맵 링크 (`todo.md` 참고)

---

*마지막 업데이트: 로드맵 초안 (레슨 5~12 + 선택 과제)*
