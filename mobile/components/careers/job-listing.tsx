import { View, Text } from 'react-native';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Feather, Ionicons } from '@expo/vector-icons';
import { JobPosting } from '~/lib/types';
import { timeSince } from '~/lib/utils';
import { Link } from 'expo-router';

export default function JobListing(props: JobPosting) {
	return (
		<Card className="mt-6">
			<CardContent className="p-6">
				<View className="flex-row flex-wrap gap-1 items-start justify-between mb-4">
					<View className="flex-shrink flex-1">
						<Text className="font-bold text-xl text-gray-900">
							{props.title}
						</Text>
						<Text className="text-gray-600">
							{props.department_name}
						</Text>
					</View>
					<Badge className="bg-green-100 text-green-800">
						<Text>{props.employment_type}</Text>
					</Badge>
				</View>

				<View className="gap-2 text-sm mb-4">
					<View className="flex-row items-center gap-2">
						<Feather name="map-pin" size={16} color="#4b5563" />
						<Text className="text-gray-600">{props.location}</Text>
					</View>
					{props.salary_range && (
						<View className="flex-row items-center gap-2">
							<Ionicons
								name="star-outline"
								size={16}
								color="#4b5563"
							/>
							<Text className="text-gray-600">
								{props.salary_range}
							</Text>
						</View>
					)}
					<View className="flex-row items-center gap-2">
						<Feather name="calendar" size={16} color="#4b5563" />
						<Text className="text-gray-600">
							Posted {timeSince(props.start_date)}
						</Text>
					</View>
				</View>

				<Link
					asChild
					href={{
						pathname: '/(drawer)/careers/[id]',
						params: { id: props.id },
					}}
				>
					{/* <Text className="text-lg font-bold">{props.title}</Text> */}
					<Button className="bg-primary">
						<Text className="text-white font-bold text-lg">
							Apply Now
						</Text>
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}
