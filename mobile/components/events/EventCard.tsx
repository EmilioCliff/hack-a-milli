import { View } from 'react-native';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

export interface eventCardProps {
	id: number;
	coverImg: string;
	title: string;
	time: {
		startDate: string;
		startTime: string;
		endDate: string;
		endTime: string;
	};
	category: string;
	// status: 'upcoming' | 'completed';
	status: string;
	website: string;
	registrationDeadline: string;
	maxAttendees: number;
	currentAttendees: number;
	price: string;
	location: {
		// type: 'virtual' | 'physical';
		type: string;
		platform?: string;
		meetingId?: string;
		passcode?: string;
		eventLink?: string;
		address?: string;
	};
	organizer: {
		name: string;
		logo: string;
		website: string;
		contact: string;
	};
	partners: {
		name: string;
		logo: string;
		website: string;
		contact: string;
	}[];
	speakers: {
		name: string;
		title: string;
		organization: string;
		bio: string;
		image: string;
		linkedin: string;
	}[];
	description: string;
	agenda: {
		time: string;
		title: string;
		speaker: string;
	}[];
	tags: string[];
}

export default function EventCard(props: eventCardProps) {
	return (
		<Card className="p-4 mt-4">
			<View className="flex-row justify-between items-center mb-2">
				<Badge variant={'outline'}>
					<Text>{props.category}</Text>
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
						{props.time.startDate} at {props.time.startTime} -{' '}
						{props.time.startDate === props.time.endDate
							? ''
							: props.time.endDate + ' at '}
						{props.time.endTime}
					</Text>
				</View>
				<View className="flex-row gap-2 items-center">
					<Feather name="map-pin" size={18} color="#6b7280" />
					<Text className="text-gray-500">
						{props.location.type === 'virtual'
							? 'Virtual Event'
							: props.location.address}
					</Text>
				</View>
				<View className="flex-row gap-2 items-center">
					<Feather name="user" size={18} color="#6b7280" />
					<Text className="text-gray-500">
						{props.maxAttendees} attendees expected
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
