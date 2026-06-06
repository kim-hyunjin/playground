export type Challenge = {
	id: string;
	title: string;
	description: string;
	initialCode: string;
};

export const challenges: Challenge[] = [
	{
		id: "state-mutation-bug",
		title: "상태 직접 수정 버그 수정하기",
		description: `
      ## 문제: 카운터가 동작하지 않아요!
      버튼을 클릭했을 때 숫자가 증가해야 하지만, 현재 코드는 상태를 직접 수정(mutation)하고 있어 리액트가 변경을 감지하지 못합니다.
      
      **할 일:**
      상태를 직접 수정하는 대신, \`setCount\`를 올바르게 사용하여 리액트가 리렌더링을 수행하도록 고쳐주세요.
    `,
		initialCode: `import React, { useState } from "react";

export default function Counter() {
  const [data, setData] = useState({ count: 0 });

  const handleClick = () => {
    // ❌ 버그: 상태를 직접 수정하고 있습니다.
    data.count = data.count + 1;
    setData(data);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Count: {data.count}</h1>
      <button 
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Increment
      </button>
    </div>
  );
}`,
	},
	{
		id: "memoization-optimization",
		title: "불필요한 리렌더링 최적화",
		description: `
      ## 문제: 리스트가 너무 자주 리렌더링됩니다!
      부모 컴포넌트의 카운트가 올라갈 때마다 \`ExpensiveList\` 컴포넌트도 함께 리렌더링되고 있습니다.
      하지만 리스트의 데이터는 변하지 않으므로, 최적화가 필요합니다.
      
      **할 일:**
      \`React.memo\`를 사용하여 \`ExpensiveList\`가 불필요하게 리렌더링되지 않도록 만들어보세요.
      콘솔에 'List rendered!'가 카운트 클릭 시 찍히지 않아야 성공입니다.
    `,
		initialCode: `import React, { useState } from "react";

// 이 컴포넌트를 최적화하세요.
function ExpensiveList({ items }) {
  console.log("List rendered!");
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [items] = useState(["Apple", "Banana", "Cherry"]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(c => c + 1)}>Increment Count</button>
      <hr />
      <ExpensiveList items={items} />
    </div>
  );
}`,
	},
];
