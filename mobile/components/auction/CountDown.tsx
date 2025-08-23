import { useEffect, useState } from 'react';
import { Text } from 'react-native';

interface CountdownProps {
	endTime: string; // ISO string or date string
}

export default function CountDown({ endTime }: CountdownProps) {
	const [timeLeft, setTimeLeft] = useState<string>('');

	useEffect(() => {
		const target = new Date(endTime).getTime();

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const diff = target - now;

			if (diff <= 0) {
				clearInterval(interval);
				setTimeLeft('Auction ended');
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
			);
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
		}, 1000);

		return () => clearInterval(interval);
	}, [endTime]);

	return <Text className="font-bold text-white">{timeLeft}</Text>;
}
