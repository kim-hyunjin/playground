import type { Transport } from '@sveltejs/kit';
import { DateTime } from 'luxon';

// Lets luxon DateTimes returned from server `load` functions cross the server/client boundary
export const transport: Transport = {
	DateTime: {
		encode: (value) => value instanceof DateTime && value.toMillis(),
		decode: (millis) => DateTime.fromMillis(millis)
	}
};
