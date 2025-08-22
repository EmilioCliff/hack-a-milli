import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';

export default function NewsUpdateSkeleton() {
	return (
		<Card className="flex-row gap-4 p-4 mt-4">
			<View>
				<Skeleton className="bg-gray-300 h-[100] w-[100] " />
			</View>
			<View className="flex-grow">
				<View className="flex-row justify-between gap-8 items-center mb-2">
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
					<Skeleton className="bg-gray-300 h-4 w-[40] " />
				</View>
				<Skeleton className="bg-gray-300 h-8 w-full mt-2" />
				<View className="flex-row justify-between mt-4 gap-8 items-center mb-2">
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
					<Skeleton className="bg-gray-300 h-4 w-[40] " />
				</View>
			</View>
		</Card>
	);
}
