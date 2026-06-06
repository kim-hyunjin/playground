import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft, GitCompare, Key, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

type Scenario = "props" | "no-key" | "with-key" | "type-change";

const SCENARIOS: {
	id: Scenario;
	label: string;
	desc: string;
}[] = [
	{
		id: "props",
		label: "같은 타입 · props 변경",
		desc: "DOM 노드를 재사용하고 props만 갱신",
	},
	{
		id: "no-key",
		label: "key 없음 · 순서 변경",
		desc: "인덱스 기준 매칭 → 내용만 덮어씀 (상태 꼬임)",
	},
	{
		id: "with-key",
		label: "key 있음 · 순서 변경",
		desc: "key로 동일 항목 식별 → 노드 이동·재사용",
	},
	{
		id: "type-change",
		label: "타입 변경",
		desc: "다른 element type → 언마운트 후 새로 마운트",
	},
];

const SCENARIO_MS = 4500;

type ListItem = { id: string; label: string; color: string };

const INITIAL_LIST: ListItem[] = [
	{ id: "a", label: "Apple", color: "bg-red-600" },
	{ id: "b", label: "Banana", color: "bg-yellow-500" },
	{ id: "c", label: "Cherry", color: "bg-rose-600" },
];

/** key 없을 때: 인덱스 0,1,2에 새 데이터가 순서대로 매칭됨 */
const REORDERED_LABELS_NO_KEY = ["Cherry", "Apple", "Banana"];

/** key 있을 때: id 순서만 바뀜 */
const REORDERED_LIST_WITH_KEY: ListItem[] = [
	INITIAL_LIST[2],
	INITIAL_LIST[0],
	INITIAL_LIST[1],
];

function DomNode({
	nodeId,
	label,
	color,
	highlight,
	warning,
	reused,
}: {
	nodeId: string;
	label: string;
	color: string;
	highlight?: "reuse" | "new" | "destroy";
	warning?: boolean;
	reused?: boolean;
}) {
	const border =
		highlight === "reuse"
			? "border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
			: highlight === "new"
				? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
				: highlight === "destroy"
					? "border-red-500/60 opacity-40 line-through"
					: warning
						? "border-amber-500/70"
						: "border-gray-700";

	return (
		<motion.div
			layout
			animate={{
				scale: highlight ? 1.04 : 1,
				opacity: highlight === "destroy" ? 0.35 : 1,
			}}
			className={`flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-2 min-w-[72px] ${border} bg-gray-900/80`}
		>
			<span className="text-[8px] font-mono text-gray-500">{nodeId}</span>
			<span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded ${color}`}>
				{label}
			</span>
			{reused && (
				<span className="text-[7px] text-emerald-400 font-bold uppercase">reuse</span>
			)}
			{warning && (
				<span className="text-[7px] text-amber-400 font-bold uppercase">mismatch</span>
			)}
			{highlight === "new" && (
				<span className="text-[7px] text-blue-400 font-bold uppercase">mount</span>
			)}
			{highlight === "destroy" && (
				<span className="text-[7px] text-red-400 font-bold uppercase">unmount</span>
			)}
		</motion.div>
	);
}

function PropsScenario() {
	return (
		<div className="flex-1 flex items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-2">
				<span className="text-[9px] text-gray-500 uppercase font-bold">이전</span>
				<DomNode
					nodeId="DOM #1"
					label="btn"
					color="bg-gray-600"
					reused
				/>
				<span className="text-[8px] text-gray-600">className=&quot;gray&quot;</span>
			</div>
			<ArrowRightLeft size={16} className="text-gray-600 shrink-0" />
			<div className="flex flex-col items-center gap-2">
				<span className="text-[9px] text-gray-500 uppercase font-bold">이후</span>
				<DomNode
					nodeId="DOM #1"
					label="btn"
					color="bg-blue-600"
					highlight="reuse"
					reused
				/>
				<span className="text-[8px] text-emerald-500">같은 노드 · props만 patch</span>
			</div>
		</div>
	);
}

function NoKeyScenario() {
	const domIds = ["DOM #1", "DOM #2", "DOM #3"];
	const colors = ["bg-red-600", "bg-yellow-500", "bg-rose-600"];

	return (
		<div className="flex-1 flex flex-col items-center justify-center gap-3">
			<p className="text-[9px] text-amber-400/90 text-center max-w-[280px]">
				맨 앞에 Cherry 삽입 → 인덱스 0·1·2에 순서대로 매칭. 노드는 재사용되지만
				<strong className="text-amber-300"> 내용·상태가 어긋날 수 있음</strong>
			</p>
			<div className="flex gap-2 flex-wrap justify-center">
				{domIds.map((nodeId, i) => (
					<DomNode
						key={nodeId}
						nodeId={nodeId}
						label={REORDERED_LABELS_NO_KEY[i]}
						color={colors[i]}
						warning
					/>
				))}
			</div>
		</div>
	);
}

function WithKeyScenario() {
	const domMap: Record<string, string> = { a: "DOM #1", b: "DOM #2", c: "DOM #3" };

	return (
		<div className="flex-1 flex flex-col items-center justify-center gap-3">
			<p className="text-[9px] text-emerald-400/90 text-center max-w-[280px]">
				key=&quot;a|b|c&quot; 로 항목 식별 → Cherry(DOM #3)가 맨 앞으로{" "}
				<strong className="text-emerald-300">이동</strong>, Apple·Banana 노드 유지
			</p>
			<div className="flex gap-2 flex-wrap justify-center">
				{REORDERED_LIST_WITH_KEY.map((item) => (
					<DomNode
						key={item.id}
						nodeId={domMap[item.id]}
						label={item.label}
						color={item.color}
						highlight="reuse"
						reused
					/>
				))}
			</div>
		</div>
	);
}

function TypeChangeScenario() {
	return (
		<div className="flex-1 flex items-center justify-center gap-6">
			<div className="flex flex-col items-center gap-2">
				<span className="text-[9px] text-gray-500 uppercase font-bold">이전</span>
				<DomNode
					nodeId="DOM #1"
					label="&lt;div&gt;"
					color="bg-gray-600"
					highlight="destroy"
				/>
			</div>
			<ArrowRightLeft size={16} className="text-gray-600 shrink-0" />
			<div className="flex flex-col items-center gap-2">
				<span className="text-[9px] text-gray-500 uppercase font-bold">이후</span>
				<DomNode
					nodeId="DOM #2"
					label="&lt;span&gt;"
					color="bg-purple-600"
					highlight="new"
				/>
				<span className="text-[8px] text-blue-400">타입 다름 → 새 노드 생성</span>
			</div>
		</div>
	);
}

export const ReconciliationAnimation = () => {
	const [scenario, setScenario] = useState<Scenario>("props");
	const [manual, setManual] = useState(false);

	useEffect(() => {
		if (manual) return;

		const timer = setTimeout(() => {
			setScenario((prev) => {
				const idx = SCENARIOS.findIndex((s) => s.id === prev);
				return SCENARIOS[(idx + 1) % SCENARIOS.length].id;
			});
		}, SCENARIO_MS);

		return () => clearTimeout(timer);
	}, [scenario, manual]);

	const current = SCENARIOS.find((s) => s.id === scenario)!;

	const renderScenario = () => {
		switch (scenario) {
			case "props":
				return <PropsScenario />;
			case "no-key":
				return <NoKeyScenario />;
			case "with-key":
				return <WithKeyScenario />;
			case "type-change":
				return <TypeChangeScenario />;
		}
	};

	return (
		<div className="flex flex-col h-full p-4 bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<GitCompare size={16} className="text-green-400" />
					<h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
						Reconciliation (Diffing)
					</h3>
				</div>
				<button
					type="button"
					onClick={() => setManual((m) => !m)}
					className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase ${
						manual
							? "border-blue-500/50 text-blue-400 bg-blue-900/20"
							: "border-gray-700 text-gray-500"
					}`}
				>
					{manual ? "수동" : "자동"}
				</button>
			</div>

			<div className="grid grid-cols-4 gap-1.5 mb-3">
				{SCENARIOS.map((s) => {
					const active = scenario === s.id;
					return (
						<button
							key={s.id}
							type="button"
							onClick={() => {
								setManual(true);
								setScenario(s.id);
							}}
							className={`rounded-lg border p-1.5 text-left transition-colors ${
								active
									? "border-green-500/50 bg-green-900/20"
									: "border-gray-800 bg-gray-900/40 hover:border-gray-700"
							}`}
						>
							<span
								className={`text-[8px] font-bold block leading-tight ${
									active ? "text-green-400" : "text-gray-500"
								}`}
							>
								{s.label}
							</span>
						</button>
					);
				})}
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={scenario}
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -6 }}
					transition={{ duration: 0.25 }}
					className="flex-1 flex flex-col min-h-0 rounded-lg border border-gray-800/80 bg-gray-900/30 p-3"
				>
					<div className="flex items-center gap-2 mb-2">
						{scenario === "with-key" ? (
							<Key size={12} className="text-emerald-400" />
						) : (
							<RefreshCw size={12} className="text-gray-500" />
						)}
						<p className="text-[10px] text-gray-400">{current.desc}</p>
					</div>
					{renderScenario()}
				</motion.div>
			</AnimatePresence>

			<div className="mt-3 pt-3 border-t border-gray-800">
				<p className="text-[10px] text-gray-500 leading-relaxed">
					<strong>Diffing 규칙:</strong> 같은 depth·같은 type이면 노드를 유지하고
					props만 비교합니다. 자식 리스트는 기본적으로 <strong>인덱스</strong>로
					맞추므로, <span className="text-emerald-400">key</span>로 안정적인
					identity를 주는 것이 중요합니다.
				</p>
			</div>
		</div>
	);
};
