import { GLOBAL_UPDATED_DATE, GMT_PARALLAX } from '../constant';
import Native from '../native';

export function now() {
	const time = new Date(Date.now() + GMT_PARALLAX);
	return {
		time,
		year: `${time.getUTCFullYear()}`,
		month: `${time.getUTCMonth() + 1}`,
		date: `${time.getUTCDate()}`,
	};
}

export function isFirstWriteOfToday() {
	const lastWriteDate = Native.global(GLOBAL_UPDATED_DATE);
	return lastWriteDate !== now().date;
}
