import { motion } from "framer-motion";
import { ArrowRight, Database, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

const hooksData = [
	{ id: 1, name: "useState", state: "0", type: "state" },
	{ id: 2, name: "useEffect", state: "f()", type: "effect" },
	{ id: 3, name: "useState", state: '"hello"', type: "state" },
];

export const HooksAnimation = () => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const [phase, setPhase] = useState<"Mount" | "Update">("Mount");

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prev) => {
				const nextIdx = (prev + 1) % (hooksData.length + 1);
				if (nextIdx === 0 && prev !== -1) {
					setPhase((p) => (p === "Mount" ? "Update" : "Mount"));
				}
				return nextIdx;
			});
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col h-full p-6 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-2">
					<Database size={16} className="text-purple-400" />
					<h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
						Hook Linked List
					</h3>
				</div>
				<div className="flex items-center gap-3">
					<div
						className={`px-2 py-0.5 rounded text-[10px] font-bold ${phase === "Mount" ? "bg-green-900/40 text-green-400 border border-green-700/50" : "bg-blue-900/40 text-blue-400 border border-blue-700/50"}`}
					>
						{phase} Phase
					</div>
					<div className="text-[10px] text-gray-500 font-mono">
						{phase === "Mount"
							? "HooksDispatcherOnMount"
							: "HooksDispatcherOnUpdate"}
					</div>
				</div>
			</div>

			<div className="flex-1 flex flex-col items-center justify-center gap-8">
				<div className="flex items-center gap-4 relative">
					{hooksData.map((hook, index) => (
						<div key={hook.id} className="flex items-center gap-4">
							<motion.div
								animate={{
									scale: activeIndex === index ? 1.05 : 1,
									borderColor: activeIndex === index ? "#a855f7" : "#374151",
									backgroundColor:
										activeIndex === index ? "#1e1b4b" : "#111827",
								}}
								className="w-28 h-20 rounded-lg border-2 p-3 flex flex-col justify-between transition-colors relative"
							>
								{activeIndex === index && (
									<motion.div
										layoutId="pointer"
										className="absolute -top-8 left-1/2 -translate-x-1/2 text-purple-400 flex flex-col items-center"
									>
										<span className="text-[8px] font-bold uppercase mb-1">
											Current
										</span>
										<div className="w-1 h-4 bg-purple-400" />
									</motion.div>
								)}
								<div className="text-[10px] font-bold text-gray-400 uppercase">
									{hook.name}
								</div>
								<div className="text-xs font-mono text-purple-300 truncate">
									{hook.state}
								</div>
							</motion.div>
							{index < hooksData.length - 1 && (
								<LinkIcon size={16} className="text-gray-700" />
							)}
						</div>
					))}
					{activeIndex === hooksData.length && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
						>
							<div className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce">
								VALIDATED!
							</div>
							<div className="w-1 h-4 bg-green-600" />
						</motion.div>
					)}
					<div className="flex items-center gap-4">
						<LinkIcon size={16} className="text-gray-700" />
						<div className="text-[10px] font-mono text-gray-600">null</div>
					</div>
				</div>

				<div className="max-w-md bg-gray-950/50 border border-gray-800 p-4 rounded-lg">
					<div className="flex items-center gap-2 mb-2">
						<ArrowRight size={12} className="text-blue-400" />
						<span className="text-[10px] font-bold text-gray-400 uppercase">
							{activeIndex === hooksData.length
								? "Next Step: Commit Phase"
								: "Internal Mechanism"}
						</span>
					</div>
					<p className="text-[11px] text-gray-500 leading-relaxed">
						{activeIndex === hooksData.length
							? "모든 훅 호출이 끝나면 리액트는 훅의 개수가 이전과 동일한지 검증합니다. 이후 useEffect 등의 부수 효과들을 큐에 담아두고 Commit 단계에서 실행할 준비를 합니다."
							: "리액트는 훅을 호출 순서대로 연결 리스트(Linked List)로 저장합니다. 렌더링 시 포인터를 이동하며 각 훅의 상태를 찾아갑니다. 이것이 훅 규칙의 핵심 원리입니다."}
					</p>
				</div>
			</div>
		</div>
	);
};
