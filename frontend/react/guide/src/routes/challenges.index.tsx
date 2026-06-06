import { createFileRoute, redirect } from "@tanstack/react-router";
import { challenges } from "../data/challenges";

export const Route = createFileRoute("/challenges/")({
	beforeLoad: () => {
		throw redirect({
			to: "/challenges/$challengeId",
			params: { challengeId: challenges[0].id },
		});
	},
});
