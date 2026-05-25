import { AnimatePresence, motion } from "framer-motion";
import {
	Eye,
	GitCommit,
	Layers,
	Monitor,
	Paintbrush,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

type Phase = "render" | "commit" | "layout" | "passive";

const PHASES: {
	id: Phase;
	label: string;
	sub: string;
	color: string;
	border: string;
	bg: string;
	icon: typeof Layers;
}[] = [
	{
		id: "render",
		label: "Render",
		sub: "순수 계산 · DOM 미접촉",
		color: "text-blue-400",
		border: "border-blue-500/50",
		bg: "bg-blue-900/30",
		icon: Layers,
	},
	{
		id: "commit",
		label: "Commit",
		sub: "DOM Mutation · 트리 스왑",
		color: "text-emerald-400",
		border: "border-emerald-500/50",
		bg: "bg-emerald-900/30",
		icon: GitCommit,
	},
	{
		id: "layout",
		label: "Layout Effects",
		sub: "useLayoutEffect (동기)",
		color: "text-amber-400",
		border: "border-amber-500/50",
		bg: "bg-amber-900/30",
		icon: Monitor,
	},
	{
		id: "passive",
		label: "Passive Effects",
		sub: "useEffect (페인트 이후)",
		color: "text-purple-400",
		border: "border-purple-500/50",
		bg: "bg-purple-900/30",
		icon: Sparkles,
	},
];

const PHASE_MS: Record<Phase, number> = {
	render: 2200,
	commit: 1800,
	layout: 1600,
	passive: 2000,
};

export const RenderVsCommitAnimation = () => {
	const [phase, setPhase] = useState<Phase>("render");
	const [tick, setTick] = useState(0);

	useEffect(() => {
		const order: Phase[] = ["render", "commit", "layout", "passive"];
		const idx = order.indexOf(phase);
		const timer = setTimeout(() => {
			const next = order[(idx + 1) % order.length];
			setPhase(next);
			if (next === "render") setTick((t) => t + 1);
		}, PHASE_MS[phase]);

		return () => clearTimeout(timer);
	}, [phase]);

	const isRender = phase === "render";
	const isCommit = phase === "commit";
	const isLayout = phase === "layout";
	const isPassive = phase === "passive";

	return (
		<div className="flex flex-col h-full p-4 bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<Paintbrush size={16} className="text-blue-400" />
					<h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
						Render → Commit Pipeline
					</h3>
				</div>
				<span className="text-[10px] text-gray-600 font-mono">
					cycle #{tick + 1}
				</span>
			</div>

			{/* Phase stepper */}
			<div className="grid grid-cols-4 gap-2 mb-4">
				{PHASES.map((p) => {
					const active = phase === p.id;
					const Icon = p.icon;
					return (
						<motion.div
							key={p.id}
							animate={{
								scale: active ? 1.02 : 1,
								opacity: active ? 1 : 0.45,
							}}
							className={`rounded-lg border p-2 ${active ? p.border : "border-gray-800"} ${active ? p.bg : "bg-gray-900/40"}`}
						>
							<div className="flex items-center gap-1 mb-1">
								<Icon size={10} className={active ? p.color : "text-gray-600"} />
								<span
									className={`text-[9px] font-bold uppercase ${active ? p.color : "text-gray-500"}`}
								>
									{p.label}
								</span>
							</div>
							<p className="text-[8px] text-gray-500 leading-tight">{p.sub}</p>
						</motion.div>
					);
				})}
			</div>

			<div className="flex-1 flex gap-3 min-h-0">
				{/* Render: pure computation */}
				<motion.div
					animate={{
						borderColor: isRender ? "rgb(59, 130, 246)" : "rgba(55, 65, 81, 0.8)",
						boxShadow: isRender
							? "0 0 20px rgba(59, 130, 246, 0.15)"
							: "none",
					}}
					className="flex-1 rounded-lg border bg-gray-900/50 p-3 flex flex-col"
				>
					<span className="text-[8px] text-gray-600 font-bold uppercase mb-2">
						메모리 (JS / Fiber)
					</span>
					<div className="flex-1 flex flex-col items-center justify-center gap-2">
						<motion.div
							animate={{
								opacity: isRender ? 1 : 0.35,
								scale: isRender ? [1, 1.03, 1] : 1,
							}}
							transition={{ duration: 0.6, repeat: isRender ? Infinity : 0 }}
							className="w-full max-w-[140px] rounded border border-blue-700/40 bg-blue-950/40 p-2 font-mono text-[9px] text-blue-200/80"
						>
							<div className="text-blue-400/60 mb-1">// Render phase</div>
							<div>function App() {"{"}</div>
							<div className="pl-2 text-emerald-300/70">
								return &lt;div&gt;...
							</div>
							<div>{"}"}</div>
						</motion.div>
						<AnimatePresence>
							{isRender && (
								<motion.span
									initial={{ opacity: 0, y: 4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="text-[9px] text-blue-400"
								>
									JSX → Fiber 트리 · diff 계산
								</motion.span>
							)}
						</AnimatePresence>
					</div>
				</motion.div>

				{/* Arrow */}
				<div className="flex items-center text-gray-700 text-lg">→</div>

				{/* DOM + effects */}
				<motion.div
					animate={{
						borderColor: isCommit || isLayout || isPassive
							? "rgb(16, 185, 129)"
							: "rgba(55, 65, 81, 0.8)",
						boxShadow:
							isCommit || isLayout
								? "0 0 20px rgba(16, 185, 129, 0.12)"
								: isPassive
									? "0 0 20px rgba(168, 85, 247, 0.12)"
									: "none",
					}}
					className="flex-1 rounded-lg border bg-gray-900/50 p-3 flex flex-col relative"
				>
					<span className="text-[8px] text-gray-600 font-bold uppercase mb-2 flex items-center gap-1">
						<Eye size={8} /> 브라우저 (DOM · Paint)
					</span>
					<div className="flex-1 flex flex-col items-center justify-center gap-3">
						<motion.div
							animate={{
								backgroundColor: isCommit
									? "#10b981"
									: isLayout || isPassive
										? "#065f46"
										: "#374151",
								scale: isCommit ? [1, 1.08, 1] : 1,
							}}
							transition={{ duration: 0.4 }}
							className="w-20 h-14 rounded-lg flex items-center justify-center text-[10px] font-bold text-white/90"
						>
							DOM
						</motion.div>

						<AnimatePresence mode="wait">
							{isLayout && (
								<motion.div
									key="layout"
									initial={{ opacity: 0, x: -8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0 }}
									className="flex items-center gap-1 px-2 py-1 rounded bg-amber-900/50 border border-amber-600/40 text-[9px] text-amber-300 font-bold"
								>
									<Monitor size={10} />
									useLayoutEffect
								</motion.div>
							)}
							{isPassive && (
								<motion.div
									key="passive"
									initial={{ opacity: 0, x: -8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0 }}
									className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900/50 border border-purple-600/40 text-[9px] text-purple-300 font-bold"
								>
									<Sparkles size={10} />
									useEffect
								</motion.div>
							)}
							{isCommit && (
								<motion.div
									key="commit"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-[9px] text-emerald-400 font-medium"
								>
									변경분만 DOM에 패치
								</motion.div>
							)}
							{isRender && (
								<motion.p
									key="waiting"
									initial={{ opacity: 0 }}
									animate={{ opacity: 0.5 }}
									exit={{ opacity: 0 }}
									className="text-[9px] text-gray-600"
								>
									아직 DOM 미반영
								</motion.p>
							)}
						</AnimatePresence>
					</div>

					{isPassive && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="absolute bottom-2 right-2 flex items-center gap-1 text-[8px] text-purple-400/80"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
							페인트 완료 후 스케줄
						</motion.div>
					)}
				</motion.div>
			</div>

			<div className="mt-4 pt-3 border-t border-gray-800">
				<p className="text-[10px] text-gray-500 leading-relaxed">
					<strong>핵심:</strong>{" "}
					<span className="text-blue-400">Render</span>는 브라우저를 건드리지
					않습니다.{" "}
					<span className="text-emerald-400">Commit</span>에서만 DOM이 바뀌고,{" "}
					<span className="text-amber-400">useLayoutEffect</span>는 페인트 전,{" "}
					<span className="text-purple-400">useEffect</span>는 페인트 후에
					실행됩니다.
				</p>
			</div>
		</div>
	);
};
