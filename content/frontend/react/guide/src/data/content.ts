export type Lesson = {
	id: string;
	title: string;
	content: string;
	code: string;
	animationType: "jsx-structure" | "state-flow" | "render-cycle";
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
];
