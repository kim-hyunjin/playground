import {
	createFileRoute,
	Outlet,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { Header } from "../components/Header";
import { lessons } from "../data/content";

export const Route = createFileRoute("/lessons")({
	component: LessonsLayout,
});

function LessonsLayout() {
	const navigate = useNavigate();
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
			<Header
				currentIndex={currentLessonIndex}
				totalCount={lessons.length}
				onNext={handleNext}
				onPrev={handlePrev}
				type="Lesson"
			/>
			<Outlet />
		</div>
	);
}
