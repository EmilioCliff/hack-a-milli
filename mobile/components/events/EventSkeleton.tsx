import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';

export default function EventSkeleton() {
	return (
		<Card className="p-4 mt-4">
			<View className="flex-row justify-between gap-8 items-center mb-2">
				<Skeleton className="bg-gray-300 h-4 w-[100] " />
				<Skeleton className="bg-gray-300 h-4 w-[40] " />
			</View>
			<Skeleton className="bg-gray-300 h-6 w-full" />
			<Skeleton className="bg-gray-300 h-4 w-2/3 mt-4" />
			<Skeleton className="bg-gray-300 h-4 w-2/3 mt-2" />
			<Skeleton className="bg-gray-300 h-4 w-2/3 mt-2" />
			<Skeleton className="bg-gray-300 h-12 w-full mt-4" />
		</Card>
	);
}
