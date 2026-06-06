import {
	createFileRoute,
	Outlet,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { Header } from "../components/Header";
import { challenges } from "../data/challenges";

export const Route = createFileRoute("/challenges")({
	component: ChallengesLayout,
});

function ChallengesLayout() {
	const navigate = useNavigate();
	const { challengeId } = useParams({ strict: false });

	const currentChallengeIndex = challenges.findIndex(
		(c) => c.id === challengeId,
	);

	const handleNext = () => {
		if (currentChallengeIndex < challenges.length - 1) {
			const nextChallenge = challenges[currentChallengeIndex + 1];
			navigate({
				to: "/challenges/$challengeId",
				params: { challengeId: nextChallenge.id },
			});
		}
	};

	const handlePrev = () => {
		if (currentChallengeIndex > 0) {
			const prevChallenge = challenges[currentChallengeIndex - 1];
			navigate({
				to: "/challenges/$challengeId",
				params: { challengeId: prevChallenge.id },
			});
		}
	};

	return (
		<div className="min-h-screen bg-[#0f1115] text-gray-200 flex flex-col">
			<Header
				currentIndex={currentChallengeIndex}
				totalCount={challenges.length}
				onNext={handleNext}
				onPrev={handlePrev}
				type="Challenge"
			/>
			<Outlet />
		</div>
	);
}
