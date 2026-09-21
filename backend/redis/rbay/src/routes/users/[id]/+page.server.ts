import type { PageServerLoad } from './$types';
import { getUserById } from '$services/queries/users';
import { commonLikedItems, likedItems } from '$services/queries/likes';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	const user = await getUserById(id);
	const sharedItems = await commonLikedItems(id, locals.session.userId);
	const liked = await likedItems(id);

	return {
		username: user.username,
		sharedItems: (sharedItems || []).map((item) => {
			return {
				...item,
				endingAt: item.endingAt.toMillis(),
				createdAt: item.createdAt.toMillis()
			};
		}),
		likedItems: (liked || []).map((item) => {
			return {
				...item,
				endingAt: item.endingAt.toMillis(),
				createdAt: item.createdAt.toMillis()
			};
		})
	};
};
