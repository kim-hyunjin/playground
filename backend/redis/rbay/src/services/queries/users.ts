import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
	const decimalId = await client.zScore(usernamesKey(), username);
	if (!decimalId) {
		throw new Error('Username not found');
	}
	const id = decimalId.toString(16);
	return getUserById(id);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));
	return deserialize(id, user);
};

// TODO: 동시성 문제 있음 - 추후에 해결예정
export const createUser = async (attrs: CreateUserAttrs) => {
	const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);
	if (exists) throw new Error('Username already exists');

	const id = genId();

	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});
	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: Record<string, string>) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
