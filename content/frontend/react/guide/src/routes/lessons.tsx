import {
	createFileRoute,
	Outlet,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessons } from "../data/content";

export const Route = createFileRoute("/lessons")({
	component: LessonsLayout,
});

function LessonsLayout() {
	const navigate = useNavigate();
	// We try to get lessonId from the params if we are in a child route
	const { lessonId } = useParams({ strict: false });

	const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);

	const handleNext = () => {
		if (currentLessonIndex < lessons.length - 1) {
			const nextLesson = lessons[currentLessonIndex + 1];
			navigate({
				to: "/lessons/$lessonId",
				params: { lessonId: nextLesson.id },
			});
		}
	};

	const handlePrev = () => {
		if (currentLessonIndex > 0) {
			const prevLesson = lessons[currentLessonIndex - 1];
			navigate({
				to: "/lessons/$lessonId",
				params: { lessonId: prevLesson.id },
			});
		}
	};

	return (
		<div className="min-h-screen bg-[#0f1115] text-gray-200 flex flex-col">
			{/* Header */}
			<header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#161b22]">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
						<span className="font-bold text-white text-xl">R</span>
					</div>
					<h1 className="font-bold text-lg tracking-tight">
						React Interactive Guide
					</h1>
				</div>

				{currentLessonIndex !== -1 && (
					<div className="flex items-center gap-4">
						<button
							onClick={handlePrev}
							disabled={currentLessonIndex === 0}
							className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-30"
						>
							<ChevronLeft size={20} />
						</button>
						<span className="text-sm font-medium">
							Lesson {currentLessonIndex + 1} of {lessons.length}
						</span>
						<button
							onClick={handleNext}
							disabled={currentLessonIndex === lessons.length - 1}
							className="p-2 hover:bg-gray-800 rounded-full disabled:opacity-30"
						>
							<ChevronRight size={20} />
						</button>
					</div>
				)}
			</header>

			<Outlet />
		</div>
	);
}
