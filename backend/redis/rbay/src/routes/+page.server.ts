import type { PageServerLoad } from './$types';
import { itemsByPrice, itemsByViews, itemsByEndingTime } from '$services/queries/items';

export const load: PageServerLoad = async () => {
	const [endingSoonest, mostViews, highestPrice] = await Promise.all([
		itemsByEndingTime('ASC', 0, 10),
		itemsByViews('DESC', 0, 10),
		itemsByPrice('DESC', 0, 10)
	]);

	return { endingSoonest, mostViews, highestPrice };
};
