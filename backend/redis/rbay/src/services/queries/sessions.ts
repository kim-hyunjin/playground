import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';
import type { Session } from '$services/types';

export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionsKey(id));
	if (Object.keys(session).length === 0) return null;
	return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
	await client.hSet(sessionsKey(session.id), serialize(session));
	return session.id;
};

const deserialize = (id: string, session: Record<string, string>) => {
	return {
		id,
		userId: session.userId,
		username: session.username
	} as Session;
};

const serialize = (session: Session) => {
	return {
		userId: session.userId,
		username: session.username
	};
};
