import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Code2, PlayCircle } from "lucide-react";
import { JSXAnimation } from "../components/animations/JSXAnimation";
import { RenderCycleAnimation } from "../components/animations/RenderCycleAnimation";
import { StateFlowAnimation } from "../components/animations/StateFlowAnimation";
import { CodeView } from "../components/CodeView";
import { lessons } from "../data/content";

export const Route = createFileRoute("/lessons/$lessonId")({
	component: LessonComponent,
});

function LessonComponent() {
	const { lessonId } = Route.useParams();

	const currentLesson = lessons.find((l) => l.id === lessonId);

	if (!currentLesson) {
		return (
			<div className="flex-1 flex items-center justify-center text-gray-400">
				Lesson not found
			</div>
		);
	}

	const renderAnimation = () => {
		switch (currentLesson.animationType) {
			case "jsx-structure":
				return <JSXAnimation />;
			case "state-flow":
				return <StateFlowAnimation />;
			case "render-cycle":
				return <RenderCycleAnimation />;
			default:
				return null;
		}
	};

	return (
		<main className="flex-1 flex overflow-hidden p-6 gap-6">
			{/* Left Column: Tutorial Content */}
			<section className="flex-1 flex flex-col bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
				<div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2 bg-[#1c2128]">
					<BookOpen size={18} className="text-blue-400" />
					<h2 className="font-semibold">{currentLesson.title}</h2>
				</div>
				<div className="flex-1 overflow-auto p-8 prose prose-invert max-w-none">
					{currentLesson.content.split("\n").map((line, i) => {
						if (line.trim().startsWith("#")) {
							return (
								<h1 key={i} className="text-2xl font-bold mb-4">
									{line.replace("#", "").trim()}
								</h1>
							);
						}
						if (line.trim().startsWith("**")) {
							return (
								<p key={i} className="font-bold text-blue-300 mt-6">
									{line.replace(/\*\*/g, "").trim()}
								</p>
							);
						}
						return (
							<p key={i} className="text-gray-400 mb-2 leading-relaxed">
								{line.trim()}
							</p>
						);
					})}
				</div>
			</section>

			{/* Right Column: Code & Animation */}
			<div className="flex-1 flex flex-col gap-6">
				{/* Top Half: Code Preview */}
				<section className="flex-[1.2] flex flex-col min-h-0">
					<div className="mb-2 flex items-center gap-2 px-1">
						<Code2 size={16} className="text-green-400" />
						<span className="text-xs font-bold uppercase tracking-wider text-gray-500">
							Code
						</span>
					</div>
					<CodeView code={currentLesson.code} />
				</section>

				{/* Bottom Half: Animation Visualization */}
				<section className="flex-1 flex flex-col min-h-0">
					<div className="mb-2 flex items-center gap-2 px-1">
						<PlayCircle size={16} className="text-purple-400" />
						<span className="text-xs font-bold uppercase tracking-wider text-gray-500">
							Visualization
						</span>
					</div>
					{renderAnimation()}
				</section>
			</div>
		</main>
	);
}
