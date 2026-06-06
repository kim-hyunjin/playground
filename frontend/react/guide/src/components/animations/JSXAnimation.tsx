import { motion } from "framer-motion";

export const JSXAnimation = () => {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900 rounded-lg border border-gray-800">
			<h3 className="text-gray-400 text-sm mb-8">Virtual DOM Structure</h3>
			<div className="relative flex flex-col items-center">
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="w-32 h-12 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold shadow-lg"
				>
					div
				</motion.div>

				<div className="w-px h-12 bg-gray-700 my-2" />

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="w-40 h-12 bg-green-600 rounded-md flex items-center justify-center text-white font-bold shadow-lg"
				>
					h1
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="mt-4 text-gray-300 italic"
				>
					"Hello React"
				</motion.div>
			</div>

			<div className="mt-12 text-center max-w-xs">
				<p className="text-xs text-gray-500">
					리액트는 위와 같은 트리 구조(Virtual DOM)를 먼저 만든 후, 실제
					브라우저의 DOM에 효율적으로 반영합니다.
				</p>
			</div>
		</div>
	);
};
