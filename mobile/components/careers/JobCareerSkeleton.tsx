import { View } from 'react-native';
import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';

export default function JobPostingSkeleton() {
	return (
		<Card className="p-4 mt-4">
			<View className="flex-row justify-between mt-4 mb-2">
				<View className="flex-grow w-[100]">
					<Skeleton className="bg-gray-300 h-4 w-2/3 " />
					<Skeleton className="bg-gray-300 h-4 w-1/3 mt-2" />
				</View>
				<Skeleton className="bg-gray-300 h-4 w-[40] " />
			</View>
			<Skeleton className="bg-gray-300 h-4 w-[100] mt-2" />
			<Skeleton className="bg-gray-300 h-4 w-[100] mt-2" />
			<Skeleton className="bg-gray-300 h-8 w-full mt-4" />
		</Card>
	);
}
