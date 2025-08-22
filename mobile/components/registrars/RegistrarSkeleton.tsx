import { View } from 'react-native';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function RegistrarSkeleton() {
	return (
		<Card className="mt-4">
			<Skeleton className="bg-gray-300 h-[150] w-full" />
			<View className="p-4">
				<View className="flex-row justify-between gap-8 items-center mb-2">
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
					<Skeleton className="bg-gray-300 h-4 w-[40] " />
				</View>
				<Skeleton className="bg-gray-300 h-4 w-[150] mt-6" />
				<View className="flex-row justify-between mt-4">
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
				</View>
				<View className="flex-row justify-between mt-4">
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
					<Skeleton className="bg-gray-300 h-4 w-[100] " />
				</View>
				<Skeleton className="bg-gray-300 h-[80] mt-6 w-full" />
			</View>
		</Card>
	);
}
