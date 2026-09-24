import type { Item } from '$services/types';
import { DateTime } from 'luxon';

export const deserialize = (id: string, item: { [key: string]: string }): Item => {
	return {
		id,
		name: item.name,
		ownerId: item.ownerId,
		imageUrl: item.imageUrl,
		description: item.description,
		createdAt: DateTime.fromMillis(parseInt(item.createdAt)),
		endingAt: DateTime.fromMillis(parseInt(item.endingAt)),
		views: Number(item.views),
		likes: Number(item.likes),
		price: Number(item.price),
		bids: Number(item.bids),
		highestBidUserId: item.highestBidUserId
	};
};
