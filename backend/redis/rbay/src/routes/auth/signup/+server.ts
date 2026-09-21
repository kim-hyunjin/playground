import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { signup } from '$services/auth/auth';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { username, password } = await request.json();

	const userId = await signup(username, password);

	locals.session.userId = userId;
	locals.session.username = username;

	return json({});
};
