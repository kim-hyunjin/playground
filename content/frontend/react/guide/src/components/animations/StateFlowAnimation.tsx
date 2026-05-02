import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export const StateFlowAnimation = () => {
	const [count, setCount] = React.useState(0);

	return (
		<div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900 rounded-lg border border-gray-800">
			<h3 className="text-gray-400 text-sm mb-8">State Update Flow</h3>

			<div className="flex items-center gap-12">
				{/* Component State */}
				<div className="flex flex-col items-center">
					<div className="text-xs text-gray-500 mb-2">State Memory</div>
					<div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center relative">
						<AnimatePresence mode="wait">
							<motion.span
								key={count}
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 1.5, opacity: 0 }}
								className="text-3xl font-bold text-white"
							>
								{count}
							</motion.span>
						</AnimatePresence>
					</div>
				</div>

				{/* Trigger */}
				<div className="flex flex-col items-center">
					<motion.button
						whileTap={{ scale: 0.95 }}
						onClick={() => setCount((c) => c + 1)}
						className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium shadow-lg transition-colors"
					>
						Click Me!
					</motion.button>
					<div className="text-[10px] text-gray-600 mt-2">Event Handler</div>
				</div>
			</div>

			<div className="mt-12 text-center max-w-xs">
				<p className="text-xs text-gray-500">
					이벤트가 발생하면 <code className="text-blue-400">setCount</code>가
					호출되고, 리액트는 상태가 변경되었음을 감지하여 컴포넌트를 다시
					렌더링합니다.
				</p>
			</div>
		</div>
	);
};
