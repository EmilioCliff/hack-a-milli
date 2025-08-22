import { View } from 'react-native';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { EventItem } from '~/lib/types';
import { format, isSameDay, parseISO } from 'date-fns';

export default function EventCard(props: EventItem) {
	return (
		<Card className="p-4 mt-4">
			<View className="flex-row justify-between items-center mb-2">
				<Badge variant={'outline'}>
					<Text>{props.topic}</Text>
				</Badge>
				<Text className="text-secondary text-sm font-bold">
					{props.status.toUpperCase()}
				</Text>
			</View>
			<Text className="text-xl font-bold mb-4">{props.title}</Text>
			<View className="gap-1 mb-4">
				<View className="flex-row gap-2 items-center">
					<Feather name="calendar" size={18} color="#6b7280" />
					<Text className="text-gray-500 flex-shrink">
						{format(
							parseISO(props.start_time),
							"MMM d, yyyy 'at' h:mm a",
						)}{' '}
						–{' '}
						{isSameDay(
							parseISO(props.start_time),
							parseISO(props.end_time),
						)
							? format(parseISO(props.end_time), 'h:mm a')
							: format(
									parseISO(props.end_time),
									"MMM d, yyyy 'at' h:mm a",
								)}
					</Text>
				</View>
				<View className="flex-row gap-2 items-center">
					<Feather name="map-pin" size={18} color="#6b7280" />
					<Text className="text-gray-500 flex-shrink">
						{props.venue?.type === 'virtual'
							? 'Virtual Event'
							: props.venue?.address}
					</Text>
				</View>
				<View className="flex-row gap-2 items-center">
					<Feather name="user" size={18} color="#6b7280" />
					<Text className="text-gray-500">
						{props.max_attendees} attendees expected
					</Text>
				</View>
			</View>
			<Link
				asChild
				href={{
					pathname: '/(drawer)/(tabs)/events/[id]',
					params: { id: props.id },
				}}
			>
				<Button>
					<Text className="text-lg font-bold">
						{props.status === 'upcoming'
							? 'Register Now'
							: 'View Event'}
					</Text>
				</Button>
			</Link>
		</Card>
	);
}
