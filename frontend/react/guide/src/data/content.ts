export type Lesson = {
	id: string;
	title: string;
	content: string;
	code: string;
	animationType:
		| "jsx-structure"
		| "state-flow"
		| "render-cycle"
		| "render-vs-commit"
		| "reconciliation"
		| "hooks";
};

export const lessons: Lesson[] = [
	{
		id: "virtual-dom",
		title: "가상 돔 (Virtual DOM)",
		content: `
      # 가상 돔 (Virtual DOM)
      리액트는 실제 DOM을 직접 조작하는 대신, 메모리에 가상의 DOM 트리를 유지합니다.

      **동작 원리:**
      1. 데이터가 변경되면 전체 UI를 가상 DOM에 리렌더링합니다.
      2. 이전 가상 DOM 스냅샷과 새로운 가상 DOM을 비교(Diffing)합니다.
      3. 변경된 부분만 실제 DOM에 반영(Patching)합니다.

      이 과정을 통해 브라우저의 비싼 연산인 DOM 조작을 최소화하여 성능을 최적화합니다.
    `,
		code: `// JSX는 React.createElement 호출로 변환되어 가상 DOM 객체를 생성합니다.
function Header() {
  return (
    <div className="header">
      <h1>Virtual DOM</h1>
      <p>가볍고 빠른 UI 업데이트</p>
    </div>
  );
}

/* 생성된 가상 DOM 객체 형태 (간략화)
{
  type: 'div',
  props: {
    className: 'header',
    children: [
      { type: 'h1', props: { children: 'Virtual DOM' } },
      { type: 'p', props: { children: '가볍고 빠른 UI 업데이트' } }
    ]
  }
}
*/`,
		animationType: "jsx-structure",
	},
	{
		id: "state-update-flow",
		title: "상태 업데이트 흐름",
		content: `
      # 상태 업데이트와 리렌더링
      리액트에서 상태(State)가 변경되면 컴포넌트는 업데이트 사이클을 시작합니다.

      **업데이트 단계:**
      1. **Trigger**: 상태 변경 함수(setState 등)가 호출됩니다.
      2. **Render**: 컴포넌트 함수를 다시 호출하여 새로운 가상 DOM을 생성합니다.
      3. **Commit**: 계산된 차이점을 실제 DOM에 적용하고 브라우저가 화면을 그립니다.

      리액트는 성능을 위해 여러 상태 업데이트를 한 번에 처리하는 'Batching'을 수행하기도 합니다.
    `,
		code: `function Counter() {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    // 1. Trigger: 업데이트 예약
    setCount(prev => prev + 1); 
  };

  // 2. Render: 상태가 바뀔 때마다 이 함수가 재실행됨
  console.log('Rendering with count:', count);

  return (
    <button onClick={handleClick}>
      Count is {count}
    </button>
  );
  // 3. Commit: 변경된 텍스트 노드만 DOM에 반영
}`,
		animationType: "state-flow",
	},
	{
		id: "fiber-architecture",
		title: "리액트 파이버 (Fiber)",
		content: `
      # 리액트 파이버 아키텍처
      Fiber는 리액트 16부터 도입된 새로운 재조정(Reconciliation) 엔진입니다.

      **주요 특징:**
      - **증분 렌더링**: 렌더링 작업을 작은 단위로 쪼개어 여러 프레임에 걸쳐 수행합니다.
      - **우선순위 관리**: 애니메이션이나 입력 같은 중요한 작업을 먼저 처리할 수 있습니다.
      - **중단 및 재개**: 렌더링 도중 더 중요한 작업이 오면 중단했다가 나중에 다시 시작할 수 있습니다.

      기존의 동기적인 렌더링 방식에서 벗어나 '동시성(Concurrency)'을 가능하게 하는 핵심 기술입니다.
    `,
		code: `// Fiber 노드는 작업의 단위이며 컴포넌트의 정보를 담고 있습니다.
/* Fiber 객체의 내부 구조 예시 (개념적)
{
  type: 'div',
  key: null,
  stateNode: HTMLDivElement, // 실제 DOM 연결

  child: FiberNode,  // 첫 번째 자식
  sibling: FiberNode, // 다음 형제
  return: FiberNode,  // 부모 (Return address)

  pendingProps: { ... },
  memoizedState: { ... }, // 훅의 상태 등 저장

  lanes: 0b0001, // 우선순위 비트마스크
  alternate: FiberNode // 현재 화면에 보이는 노드와 비교를 위한 쌍
}
*/`,
		animationType: "render-cycle",
	},
	{
		id: "render-vs-commit",
		title: "Render vs Commit",
		content: `
      # Render vs Commit
      리액트의 한 번의 업데이트는 크게 **Render 단계**와 **Commit 단계**로 나뉩니다.
      상태 업데이트 레슨에서 본 Trigger → Render → Commit 흐름을, 엔진 관점에서 더 쪼갠 것입니다.

      **Render 단계 (순수·중단 가능):**
      - 컴포넌트 함수를 다시 호출하고 JSX로부터 Fiber 트리(Work-in-Progress)를 만듭니다.
      - 이전 트리와 diff하여 “무엇을 바꿀지”만 계산합니다.
      - 이 단계에서는 **실제 DOM을 읽거나 쓰지 않습니다.** 그래서 같은 렌더 안에서 여러 번 시도·중단(Concurrent)이 가능합니다.

      **Commit 단계 (동기·DOM 접촉):**
      - 계산이 끝난 변경 사항을 **한 번에** 실제 DOM에 반영합니다.
      - 화면에 보이는 Fiber 트리(Current)와 WIP 트리를 교체합니다.
      - 그다음 **Layout Effects** → 브라우저 **Paint** → **Passive Effects** 순으로 이어집니다.

      **Effect 실행 시점:**
      - **useLayoutEffect**: DOM 반영 직후, **브라우저가 화면을 그리기 전**에 동기 실행됩니다. 레이아웃 측정·동기 DOM 조정에 씁니다.
      - **useEffect**: **페인트가 끝난 뒤** 비동기로 스케줄됩니다. fetch, 구독, 로깅 등 “화면에 보이는 변경과 덜 묶인” 작업에 적합합니다.

      Render에서 DOM을 건드리지 않는 이유가, Fiber가 Render를 쪼개고 우선순위를 바꿀 수 있는 근거이기도 합니다.
    `,
		code: `function MeasureBox() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  // Render: 컴포넌트 함수 실행, JSX 생성 (DOM 미접촉)
  // ↓ 아래 훅들은 Render 중 "등록"만 되고, 실행은 Commit 이후

  useLayoutEffect(() => {
    // Commit → Layout: DOM 반영 직후, Paint 전 (동기)
    // 레이아웃 읽기/쓰기 — 깜빡임 줄이기 좋음
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    // Commit → Passive: Paint 이후 (비동기)
    console.log('Paint done, height on screen:', height);
  }, [height]);

  return <div ref={ref}>Content</div>;
}

/*
  한 업데이트의 대략적 순서:

  [Render]  App() 실행 → Fiber/diff
  [Commit]  DOM mutation → tree swap
  [Layout]  useLayoutEffect 실행
  [Paint]   브라우저 그리기
  [Passive] useEffect 실행
*/`,
		animationType: "render-vs-commit",
	},
	{
		id: "hooks-internals",
		title: "훅의 작동 원리 (Hooks Internals)",
		content: `
      # 리액트 훅의 내부 구현과 동작 방식
      리액트 훅은 단순한 상태 저장소가 아니라, Fiber 아키텍처 위에서 정교하게 설계된 데이터 구조입니다.

      **1. Hook 객체의 상세 구조:**
      각 훅은 내부적으로 다음과 같은 필드를 가진 객체로 표현됩니다:
      - **memoizedState**: 훅의 현재 상태 값 (useState인 경우 실제 데이터, useEffect인 경우 이펙트 객체).
      - **baseState**: 업데이트가 겹칠 때 기준이 되는 상태.
      - **queue**: 상태 업데이트 요청(Update)들이 대기하는 큐.
      - **next**: 다음 훅 객체를 가리키는 포인터.

      **2. Dispatcher의 역할:**
      리액트는 현재 어떤 단계(Mount, Update)에 있느냐에 따라 다른 훅 함수를 할당합니다.
      - **HooksDispatcherOnMount**: 컴포넌트가 처음 렌더링될 때 사용되는 훅 세트.
      - **HooksDispatcherOnUpdate**: 상태 변경 등으로 인해 재렌더링될 때 사용되는 훅 세트.
      이 Dispatcher 덕분에 우리는 동일한 \`useState\`를 호출하지만, 내부적으로는 상황에 맞는 최적화된 로직이 실행됩니다.

      **4. 훅 호출이 끝난 후 (Finalization):**
      컴포넌트 함수가 모든 훅을 호출하고 종료되면 다음과 같은 후속 작업이 이루어집니다:
      1. **일관성 검사**: 리액트는 이번에 호출된 훅의 개수가 이전 렌더링 때와 일치하는지 확인합니다. 만약 포인터가 남거나 부족하다면 리액트는 "Rendered more/fewer hooks than during the previous render" 에러를 발생시킵니다.
      2. **이펙트 스케줄링**: \`useEffect\`나 \`useLayoutEffect\` 같은 훅들은 즉시 실행되지 않고, Fiber의 \`updateQueue\`에 저장되어 나중에 **Commit 단계**에서 한꺼번에 실행될 준비를 마칩니다.
      3. **다음 작업 이동**: 현재 컴포넌트의 Fiber 작업이 완료되면, 제어권은 자식이나 형제 Fiber로 넘어가거나 부모로 돌아가 전체 가상 DOM 트리를 완성합니다.

      결국 훅은 컴포넌트의 **'상태 기억 장치'** 역할을 하며, 호출이 끝난 후에는 그 결과를 바탕으로 실제 DOM에 반영할 차이점을 계산하게 됩니다.
    `,
		code: `// 훅 호출 완료 후의 내부 상태 예시
/*
FiberNode = {
  memoizedState: Hook1, // Linked List의 시작점
  updateQueue: {        // 실행 대기 중인 Effect 리스트
    lastEffect: {
      tag: 5, // useEffect
      create: () => { ... },
      destroy: () => { ... },
      next: ...
    }
  },
  flags: PassiveStatic | PerformedWork, // Commit 단계에서 할 일 표시
}
*/

function MyComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("Effect runs after commit!");
  }, [count]);

  return <div>{count}</div>;
  
  // 1. 모든 훅 호출 완료 (Linked List 순회 끝)
  // 2. 리액트는 'updateQueue'에 이펙트를 차곡차곡 쌓아둠
  // 3. 컴포넌트가 JSX를 리턴하면 Render 단계의 이 노드 작업은 종료
  // 4. 나중에 Commit 단계에서 updateQueue를 돌며 이펙트 실행
}
`,
		animationType: "hooks",
	},
	{
		id: "reconciliation-and-key",
		title: "Reconciliation & key",
		content: `
      # Reconciliation (재조정)과 key
      Virtual DOM 레슨에서 본 **Diffing**을 Fiber가 실제로 어떻게 적용하는지 정리합니다.
      Reconciliation은 이전 Fiber 트리와 새 트리를 비교해 **최소한의 DOM 변경**만 계산하는 과정입니다.

      **같은 타입 · 다른 props:**
      - element type(\`div\`, \`button\` 등)이 같으면 리액트는 DOM 노드를 **재사용**합니다.
      - 변경된 props(className, style, event handler 등)만 patch합니다.
      - 컴포넌트 type이 같으면 인스턴스를 유지하고 props만 넘깁니다.

      **타입이 다를 때:**
      - \`div\` → \`span\`, \`ComponentA\` → \`ComponentB\`처럼 type이 바뀌면
        기존 서브트리를 **언마운트**하고 새로 **마운트**합니다.
      - 내부 state·effect·ref가 초기화됩니다.

      **자식 리스트와 key:**
      - 형제 Fiber는 기본적으로 **배열 인덱스** 순으로 이전 트리와 짝을 맞춥니다.
      - key가 없으면 맨 앞 삽입·순서 변경 시 **같은 DOM 노드에 다른 데이터**가 덮어씌워질 수 있습니다.
      - \`key={item.id}\`처럼 **안정적인 identity**를 주면, 항목 이동·삽입 시에도 올바른 노드를 재사용하거나 이동합니다.
      - key가 바뀌면 리액트는 **다른 항목**으로 보고 언마운트/마운트합니다. index를 key로 쓰면 순서 변경 시 같은 문제가 납니다.

      key는 React DOM에만 전달되는 힌트이며, props에는 포함되지 않습니다.
    `,
		code: `const items = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
  { id: 'c', label: 'Cherry' },
];

// ❌ key 없음 — 앞에 삽입하면 인덱스 0·1·2가 새 데이터와 매칭
// DOM #1(Apple) 노드에 Cherry 텍스트가 patch될 수 있음
function ListNoKey({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li>{item.label}</li>
      ))}
    </ul>
  );
}

// ✅ key — id로 identity 유지, 노드 이동·재사용이 정확
function ListWithKey({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}

// 같은 type, props만 변경 → DOM 노드 reuse
function Button({ primary }) {
  return (
    <button className={primary ? 'btn-primary' : 'btn'}>
      Click
    </button>
  );
}

// type 변경 → unmount + mount
// <div>...</div>  →  <span>...</span>`,
		animationType: "reconciliation",
	},
];
