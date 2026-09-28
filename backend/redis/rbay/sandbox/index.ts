import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car1', {
		color: 'red',
		year: 1950,
		// engine: { cylinders: 8 }, // redis can't store nested objects
		owner: null || '', // redis can't store null or undefined
		service: undefined || ''
	});

	const car1 = await client.hGetAll('car1');
	console.log(car1);

	const car2 = await client.hGetAll('car2');
	console.log(car2); // it returns an empty object - {}
	if (Object.keys(car2).length === 0) {
		console.log('car2 is empty');
	}

	await client.hSet('car2', {
		color: 'blue',
		year: 2020
	});
	await client.hSet('car3', {
		color: 'yellow',
		year: 2020
	});

	// pipelining
	const results = await Promise.all([
		client.hGetAll('car1'),
		client.hGetAll('car2'),
		client.hGetAll('car3')
	]);
	console.log(results);
};
run();
