import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getItem } from '$services/queries/items/items';
import { likeItem, unlikeItem } from '$services/queries/likes';

const serializeItem = async (id: string) => {
	const item = await getItem(id);

	return {
		item: {
			...item,
			endingAt: item.endingAt.toMillis(),
			createdAt: item.createdAt.toMillis()
		}
	};
};

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.session.userId) {
		error(401, 'You must login to do that');
	}

	await likeItem(params.id, locals.session.userId);

	return json(await serializeItem(params.id), { status: 201 });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.session.userId) {
		error(401, 'You must login to do that');
	}

	await unlikeItem(params.id, locals.session.userId);

	return json(await serializeItem(params.id), { status: 201 });
};
