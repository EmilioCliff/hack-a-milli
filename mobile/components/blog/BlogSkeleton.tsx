import { View, Text } from 'react-native';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const BlogSkeleton = () => {
	return (
		<Card className="mt-4">
			<Skeleton className="bg-gray-300 h-[120] w-full" />
			<CardContent>
				<View className="flex-row justify-between mt-4 mb-2">
					<Skeleton className="bg-gray-300 h-4 w-[40] " />
					<Skeleton className="bg-gray-300 h-4 w-[40] " />
				</View>
				<Skeleton className="bg-gray-300 h-4 w-[50%] mt-2" />
				<Skeleton className="bg-gray-300 h-4 w-[100%] mt-6" />
				<Skeleton className="bg-gray-300 h-4 w-[100%] mt-2" />
				<Skeleton className="bg-gray-300 h-4 w-[40%] mt-2" />
				<View className="flex-row justify-between mt-6 items-center">
					<View className="flex-row items-center gap-2">
						<Skeleton className="bg-gray-300 h-12 w-12 rounded-full" />
						<View className="gap-2">
							<Skeleton className="bg-gray-300 h-4 w-[80]" />
							<Skeleton className="bg-gray-300 h-4 w-[50]" />
						</View>
					</View>
					<Skeleton className="bg-gray-300 h-4 w-[50]" />
				</View>
			</CardContent>
		</Card>
	);
};

export default BlogSkeleton;
