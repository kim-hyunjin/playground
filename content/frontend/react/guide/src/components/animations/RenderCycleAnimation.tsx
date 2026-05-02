import { AnimatePresence, motion } from "framer-motion";
import { Activity, AlertCircle, RefreshCw, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const RenderCycleAnimation = () => {
	const [phase, setPhase] = useState<"render" | "commit">("render");
	const [activeNode, setActiveNode] = useState(0); // 0: Root, 1: Child, 2: Sibling, 3: Return to Root
	const [interrupted, setInterrupted] = useState(false);

	// Simulation loop
	useEffect(() => {
		const timer = setInterval(() => {
			if (phase === "render") {
				if (activeNode < 3) {
					setActiveNode((prev) => prev + 1);
				} else {
					setPhase("commit");
				}
			} else {
				// Commit is fast
				setTimeout(() => {
					setPhase("render");
					setActiveNode(0);
					setInterrupted(false);
				}, 1500);
			}
		}, 1200);

		return () => clearInterval(timer);
	}, [phase, activeNode]);

	// Interruption trigger
	const triggerInterruption = () => {
		if (phase === "render") {
			setInterrupted(true);
			setActiveNode(0); // Restart work
			setTimeout(() => setInterrupted(false), 1000);
		}
	};

	return (
		<div className="flex flex-col h-full p-4 bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
			{/* Top Header & Status */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Activity size={16} className="text-blue-400" />
					<h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
						Fiber Pipeline
					</h3>
				</div>
				<div
					className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${
						phase === "render"
							? "bg-blue-900/40 text-blue-400 border border-blue-700/50"
							: "bg-green-900/40 text-green-400 border border-green-700/50"
					}`}
				>
					{phase === "render" ? (
						<>
							<RefreshCw size={10} className="animate-spin" /> RENDER PHASE
							(ASYNC)
						</>
					) : (
						<>
							<Zap size={10} /> COMMIT PHASE (SYNC)
						</>
					)}
				</div>
			</div>

			<div className="flex-1 flex gap-4">
				{/* Left: Trees Visualization */}
				<div className="flex-1 flex flex-col gap-4">
					{/* Current Tree (Visible) */}
					<motion.div
						animate={{
							borderColor:
								phase === "commit" ? "#10b981" : "rgba(31, 41, 55, 0.5)",
							boxShadow:
								phase === "commit"
									? "0 0 15px rgba(16, 185, 129, 0.2)"
									: "none",
						}}
						className="flex-1 bg-gray-900/50 rounded-lg border p-3 relative"
					>
						<span className="absolute top-2 left-2 text-[8px] text-gray-600 font-bold uppercase">
							Current Tree (DOM)
						</span>
						<div className="flex flex-col items-center justify-center h-full gap-2">
							<motion.div
								animate={{
									backgroundColor: phase === "commit" ? "#10b981" : "#374151",
									scale: phase === "commit" ? [1, 1.1, 1] : 1,
									opacity: phase === "commit" ? 1 : 0.5,
								}}
								transition={{ duration: 0.5 }}
								className="w-10 h-10 rounded"
							/>
							<div className="flex gap-4">
								<motion.div
									animate={{
										backgroundColor: phase === "commit" ? "#10b981" : "#374151",
										scale: phase === "commit" ? [1, 1.1, 1] : 1,
										opacity: phase === "commit" ? 1 : 0.5,
									}}
									transition={{ duration: 0.5, delay: 0.1 }}
									className="w-8 h-8 rounded"
								/>
								<motion.div
									animate={{
										backgroundColor: phase === "commit" ? "#10b981" : "#374151",
										scale: phase === "commit" ? [1, 1.1, 1] : 1,
										opacity: phase === "commit" ? 1 : 0.5,
									}}
									transition={{ duration: 0.5, delay: 0.2 }}
									className="w-8 h-8 rounded"
								/>
							</div>
						</div>
					</motion.div>

					{/* Work-in-Progress Tree */}
					<div className="flex-1 bg-blue-900/10 rounded-lg border border-blue-800/20 p-3 relative overflow-hidden">
						<span className="absolute top-2 left-2 text-[8px] text-blue-400/60 font-bold uppercase">
							Work-in-Progress (Fiber)
						</span>

						<AnimatePresence>
							{interrupted && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="absolute inset-0 z-50 bg-red-950/40 backdrop-blur-[1px] flex items-center justify-center gap-2"
								>
									<AlertCircle
										size={14}
										className="text-red-400 animate-pulse"
									/>
									<span className="text-[10px] font-bold text-red-400 uppercase">
										Interrupted by High Priority
									</span>
								</motion.div>
							)}
						</AnimatePresence>

						<div className="flex flex-col items-center justify-center h-full gap-2 pt-4 relative">
							{/* Root */}
							<motion.div
								animate={{
									scale: activeNode === 0 || activeNode === 3 ? 1.1 : 1,
									borderColor:
										activeNode === 0 || activeNode === 3
											? "#3b82f6"
											: "#374151",
									backgroundColor:
										phase === "commit"
											? "#10b981"
											: activeNode === 0 || activeNode === 3
												? "#1e3a8a"
												: "#111827",
								}}
								className="w-12 h-12 rounded-lg border-2 flex items-center justify-center text-[8px] text-gray-300 font-bold transition-colors z-20"
							>
								Root
							</motion.div>

							<div className="flex gap-8 relative z-20">
								{/* Child */}
								<motion.div
									animate={{
										scale: activeNode === 1 ? 1.1 : 1,
										borderColor: activeNode === 1 ? "#3b82f6" : "#374151",
										backgroundColor:
											phase === "commit"
												? "#10b981"
												: activeNode === 1
													? "#1e3a8a"
													: "#111827",
									}}
									className="w-10 h-10 rounded-lg border-2 flex items-center justify-center text-[8px] text-gray-300 transition-colors"
								>
									Child
								</motion.div>

								{/* Sibling */}
								<motion.div
									animate={{
										scale: activeNode === 2 ? 1.1 : 1,
										borderColor: activeNode === 2 ? "#3b82f6" : "#374151",
										backgroundColor:
											phase === "commit"
												? "#10b981"
												: activeNode === 2
													? "#1e3a8a"
													: "#111827",
									}}
									className="w-10 h-10 rounded-lg border-2 flex items-center justify-center text-[8px] text-gray-300 transition-colors"
								>
									Sibling
								</motion.div>
							</div>
						</div>
					</div>
				</div>

				{/* Right: Technical Details & Interaction */}
				<div className="w-44 flex flex-col gap-3">
					<div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
						<div className="text-[10px] text-gray-500 font-bold uppercase mb-2">
							Priority Task
						</div>
						<button
							type="button"
							onClick={triggerInterruption}
							className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
						>
							<Zap size={10} /> User Input
						</button>
						<p className="text-[8px] text-gray-600 mt-2">
							클릭 시 현재 진행 중인 작업을 중단하고 고우선순위 작업을 먼저
							처리합니다.
						</p>
					</div>

					<div className="flex-1 p-3 bg-gray-900/30 rounded-lg border border-gray-800/50">
						<div className="text-[10px] text-gray-500 font-bold uppercase mb-2">
							Internal Logic
						</div>
						<ul className="space-y-2">
							<li className="flex items-center gap-2">
								<div
									className={`w-1 h-1 rounded-full ${activeNode === 1 ? "bg-blue-400" : "bg-gray-700"}`}
								/>
								<span
									className={`text-[9px] ${activeNode === 1 ? "text-blue-300" : "text-gray-500"}`}
								>
									Work on Child
								</span>
							</li>
							<li className="flex items-center gap-2">
								<div
									className={`w-1 h-1 rounded-full ${activeNode === 2 ? "bg-blue-400" : "bg-gray-700"}`}
								/>
								<span
									className={`text-[9px] ${activeNode === 2 ? "text-blue-300" : "text-gray-500"}`}
								>
									Work on Sibling
								</span>
							</li>
							<li className="flex items-center gap-2">
								<div
									className={`w-1 h-1 rounded-full ${activeNode === 3 ? "bg-blue-400" : "bg-gray-700"}`}
								/>
								<span
									className={`text-[9px] ${activeNode === 3 ? "text-blue-300" : "text-gray-500"}`}
								>
									Complete & Return
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mt-4 pt-3 border-t border-gray-800">
				<p className="text-[10px] text-gray-500 leading-relaxed">
					<strong>Double Buffering:</strong> 파이버는 현재 화면에 보이는{" "}
					<span className="text-gray-300">Current 트리</span>를 유지하면서,
					메모리 상에서 <span className="text-blue-400">WIP 트리</span>를 별도로
					구축합니다. 모든 작업이 끝나면 한 번에 교체(Commit)하여 끊김 없는 UI를
					제공합니다.
				</p>
			</div>
		</div>
	);
};
