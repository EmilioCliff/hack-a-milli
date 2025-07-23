import { View, Text } from 'react-native';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Feather, Ionicons } from '@expo/vector-icons';

interface jobListingProps {
	id: number;
	title: string;
	type: string;
	department: string;
	location: string;
	salary: string;
	posted: string;
}

export default function JobListing({
	id,
	title,
	type,
	department,
	location,
	salary,
	posted,
}: jobListingProps) {
	return (
		<Card className="mt-6">
			<CardContent className="p-6">
				<View className="flex-row flex-wrap gap-1 items-start justify-between mb-4">
					<View className="flex-shrink flex-1">
						<Text className="font-bold text-xl text-gray-900">
							{title}
						</Text>
						<Text className="text-gray-600">{department}</Text>
					</View>
					<Badge className="bg-green-100 text-green-800">
						<Text>{type}</Text>
					</Badge>
				</View>

				<View className="gap-2 text-sm mb-4">
					<View className="flex-row items-center gap-2">
						<Feather name="map-pin" size={16} color="#4b5563" />
						<Text className="text-gray-600">{location}</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<Ionicons
							name="star-outline"
							size={16}
							color="#4b5563"
						/>
						<Text className="text-gray-600">{salary}</Text>
					</View>
					<View className="flex-row items-center gap-2">
						<Feather name="calendar" size={16} color="#4b5563" />
						<Text className="text-gray-600">Posted {posted}</Text>
					</View>
				</View>

				<Button className="bg-primary">
					<Text className="text-white font-bold text-lg">
						Apply Now
					</Text>
				</Button>
			</CardContent>
		</Card>
	);
}
