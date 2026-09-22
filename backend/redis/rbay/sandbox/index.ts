import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	await client.hSet('car', {
		color: 'red',
		year: 1950,
		// engine: { cylinders: 8 }, // redis can't store nested objects
		owner: null || '', // redis can't store null or undefined
		service: undefined || ''
	});

	const car = await client.hGetAll('car');
	console.log(car);

	const car2 = await client.hGetAll('car2');
	console.log(car2); // it returns an empty object - {}
	if (Object.keys(car2).length === 0) {
		console.log('car2 is empty');
	}
};
run();
