import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchItems } from '$services/queries/items';

export const GET: RequestHandler = async ({ url }) => {
	const term = url.searchParams.get('term');

	const items = ((await searchItems(term, 5)) || []).map((item) => {
		item.id = item.id.replace('items#', '');
		return item;
	});

	return json({ results: items });
};
