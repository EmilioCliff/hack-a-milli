import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function timeSince(date: Date | string | number) {
	const inputDate = new Date(date);
	if (isNaN(inputDate.getTime())) return 'invalid date';

	const seconds = Math.floor((Date.now() - inputDate.getTime()) / 1000);

	if (seconds < 0) return 'in the future';

	const intervals = [
		{ label: 'year', seconds: 31536000 },
		{ label: 'month', seconds: 2592000 },
		{ label: 'day', seconds: 86400 },
		{ label: 'hour', seconds: 3600 },
		{ label: 'minute', seconds: 60 },
		{ label: 'second', seconds: 1 },
	];

	const interval = intervals.find((i) => seconds >= i.seconds);
	if (!interval) return 'just now';

	const count = Math.floor(seconds / interval.seconds);
	return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}
