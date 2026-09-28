export const pageCacheKey = (route: string) => `pagecache#${route}`;
export const usersKey = (userId: string) => `users#${userId}`;
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const usernamesUniqueKey = () => `usernames:unique`;
export const userLikesKey = (userId: string) => `userlikes#${userId}`;
