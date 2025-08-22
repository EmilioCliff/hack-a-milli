import { View } from 'react-native';
import { Card, CardContent } from '../ui/card';
import { s, vs } from 'react-native-size-matters';
import { Skeleton } from '../ui/skeleton';

export default function MerchSkeleton() {
	return (
		<View className="flex-row gap-2 mb-4">
			<Card style={{ height: vs(190), width: s(160) }}>
				<View
					style={{ height: vs(130), width: '100%' }}
					className="p-4"
				>
					<Skeleton className="bg-gray-300 mx-auto h-full w-full rounded-lg" />
				</View>
				<CardContent>
					<Skeleton className="bg-gray-300 h-6 w-full" />
					<Skeleton className="bg-gray-300 h-4 w-2/3 mt-4" />
				</CardContent>
			</Card>
			<Card style={{ height: vs(190), width: s(160) }}>
				<View
					style={{ height: vs(130), width: '100%' }}
					className="p-4"
				>
					<Skeleton className="bg-gray-300 mx-auto h-full w-full rounded-lg" />
				</View>
				<CardContent>
					<Skeleton className="bg-gray-300 h-6 w-full" />
					<Skeleton className="bg-gray-300 h-4 w-2/3 mt-4" />
				</CardContent>
			</Card>
		</View>
	);
}
