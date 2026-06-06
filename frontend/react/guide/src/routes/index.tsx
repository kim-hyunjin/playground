import { createFileRoute, redirect } from "@tanstack/react-router";
import { lessons } from "../data/content";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({
			to: "/lessons/$lessonId",
			params: { lessonId: lessons[0].id },
		});
	},
});
