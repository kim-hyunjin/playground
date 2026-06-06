import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
	currentIndex: number;
	totalCount: number;
	onNext: () => void;
	onPrev: () => void;
	type: "Lesson" | "Challenge";
}

export function Header({
	currentIndex,
	totalCount,
	onNext,
	onPrev,
	type,
}: HeaderProps) {
	const location = useLocation();

	return (
		<header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#161b22] sticky top-0 z-50">
			<div className="flex items-center gap-8">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
						<span className="font-bold text-white text-xl">R</span>
					</div>
					<h1 className="font-bold text-lg tracking-tight hidden sm:block">
						React Guide
					</h1>
				</div>

				<nav className="flex items-center gap-1 bg-gray-900/50 p-1 rounded-lg">
					<Link
						to="/lessons"
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
							location.pathname.startsWith("/lessons")
								? "bg-gray-800 text-blue-400 shadow-sm"
								: "text-gray-400 hover:text-gray-200"
						}`}
					>
						Lessons
					</Link>
					<Link
						to="/challenges"
						className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
							location.pathname.startsWith("/challenges")
								? "bg-gray-800 text-blue-400 shadow-sm"
								: "text-gray-400 hover:text-gray-200"
						}`}
					>
						Challenges
					</Link>
				</nav>
			</div>

			{currentIndex !== -1 && (
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={onPrev}
						disabled={currentIndex === 0}
						className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-30 transition-colors"
						aria-label="Previous"
					>
						<ChevronLeft size={20} />
					</button>
					<span className="text-sm font-medium min-w-[100px] text-center">
						{type} {currentIndex + 1} of {totalCount}
					</span>
					<button
						type="button"
						onClick={onNext}
						disabled={currentIndex === totalCount - 1}
						className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-30 transition-colors"
						aria-label="Next"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			)}
		</header>
	);
}
