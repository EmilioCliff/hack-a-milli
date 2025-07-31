import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface newsLetterCardProps {
	title: string;
	description: string;
	date: string;
}

export default function NewsLetterCard(props: newsLetterCardProps) {
	return (
		<View className="border border-border border-l-primary border-l-2 p-4 rounded-lg mt-6">
			<View className="flex-row justify-between items-center mb-4">
				<Badge className="bg-red-200">
					<Text className="text-red-700">
						{/* {format(props.date, 'dd MMM yyyy')} */}
						{props.date}
					</Text>
				</Badge>
				<Text className="text-gray-500">
					{new Date(props.date).getFullYear().toString()}
				</Text>
			</View>
			<Text className="text-xl font-bold">{props.title}</Text>
			<Text className="text-gray-600 my-2">{props.description}</Text>
			<View className="flex-row gap-2">
				<Button className="flex-1">
					<Text className="text-white font-bold">Download</Text>
				</Button>
				<Button className="bg-secondary flex-1">
					<Text className="text-white font-bold">View</Text>
				</Button>
			</View>
		</View>
	);
}
