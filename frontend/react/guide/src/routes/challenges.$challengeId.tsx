import {
	SandpackCodeEditor,
	SandpackLayout,
	SandpackPreview,
	SandpackProvider,
} from "@codesandbox/sandpack-react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { challenges } from "../data/challenges";

export const Route = createFileRoute("/challenges/$challengeId")({
	component: ChallengeComponent,
});

function ChallengeComponent() {
	const { challengeId } = Route.useParams();
	const challenge = challenges.find((c) => c.id === challengeId);
	const [key, setKey] = useState(0); // For resetting the challenge

	if (!challenge) {
		return (
			<div className="flex-1 flex items-center justify-center text-gray-400">
				Challenge not found
			</div>
		);
	}

	const handleReset = () => {
		setKey((prev) => prev + 1);
	};

	return (
		<main className="flex-1 flex overflow-hidden p-6 gap-6">
			{/* Left Column: Challenge Description */}
			<section className="w-1/3 flex flex-col bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
				<div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#1c2128]">
					<div className="flex items-center gap-2">
						<BookOpen size={18} className="text-blue-400" />
						<h2 className="font-semibold">{challenge.title}</h2>
					</div>
					<button
						type="button"
						onClick={handleReset}
						className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
						title="Reset Challenge"
					>
						<RefreshCcw size={16} />
					</button>
				</div>
				<div className="flex-1 overflow-auto p-8 prose prose-invert max-w-none">
					{challenge.description.split("\n").map((line, i) => {
						const key = `${line.substring(0, 10)}-${i}`;
						if (line.trim().startsWith("##")) {
							return (
								<h2 key={key} className="text-xl font-bold mb-4 text-white">
									{line.replace("##", "").trim()}
								</h2>
							);
						}
						if (line.trim().startsWith("**")) {
							return (
								<p key={key} className="font-bold text-blue-300 mt-6 mb-2">
									{line.replace(/\*\*/g, "").trim()}
								</p>
							);
						}
						return (
							<p key={key} className="text-gray-400 mb-2 leading-relaxed">
								{line.trim()}
							</p>
						);
					})}
				</div>
			</section>

			{/* Right Column: Sandpack Editor & Preview */}
			<section className="flex-1 flex flex-col overflow-hidden">

				<SandpackProvider
					key={`${challenge.id}-${key}`}
					template="react"
					theme="dark"
					files={{
						"/App.js": challenge.initialCode,
					}}
					options={{
						activeFile: "/App.js",
						visibleFiles: ["/App.js"],
						recompileMode: "immediate",
						recompileDelay: 300,
					}}
					style={{ height: '100%' }}
				>
					<SandpackLayout
						className="border border-gray-800 rounded-xl overflow-hidden shadow-2xl h-full"
					>

						<SandpackCodeEditor
							showLineNumbers
							showInlineErrors
							closableTabs={false}
							style={{ height: "100%" }}
						/>
						<SandpackPreview
							showNavigator={false}
							showOpenInCodeSandbox={false}
							style={{ height: "100%", backgroundColor: "white" }}
						/>
					</SandpackLayout>
				</SandpackProvider>
			</section>
		</main>
	);
}
