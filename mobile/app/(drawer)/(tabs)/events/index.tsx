import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { FlatList, View } from 'react-native';
import EventCard from '~/components/events/EventCard';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Text } from '~/components/ui/text';

const data = [
	{
		id: 1,
		title: 'Kenya Webinar: Domain Landscape 2023',
		time: {
			startDate: 'October 3, 2023',
			startTime: '10:00 AM',
			endDate: 'October 3, 2023',
			endTime: '11:30 AM',
		},
		category: 'Webinar',
		status: 'upcoming',
		website: 'https://bit.ly/KeWebinarDomainLandscape',
		registrationDeadline: 'October 2, 2023',
		maxAttendees: 500,
		currentAttendees: 342,
		price: 'Free',
		location: {
			type: 'virtual',
			platform: 'Zoom',
			meetingId: '123 456 7890',
			passcode: 'Domain2023',
		},
		organizer: {
			name: 'Kenya ICT Board',
			logo: 'https://via.placeholder.com/60x60',
			website: 'https://ictboard.go.ke',
			contact: 'events@ictboard.go.ke',
		},
		partners: [
			{
				name: 'Kenya ICT Board',
				logo: 'https://picsum.photos/200/120',
				website: 'https://ictboard.go.ke',
				contact: 'events@ictboard.go.ke',
			},
			{
				name: 'Kenya ICT Board',
				logo: 'https://picsum.photos/200/120',
				website: 'https://ictboard.go.ke',
				contact: 'events@ictboard.go.ke',
			},
		],
		speakers: [
			{
				name: 'Dr. Sarah Kimani',
				title: 'Director of Digital Infrastructure',
				organization: 'Kenya ICT Board',
				bio: 'Expert in domain management and digital policy in Africa.',
				image: 'https://via.placeholder.com/100x100',
				linkedin: 'https://linkedin.com/in/sarahkimani',
			},
		],
		description:
			"Join us for an in-depth exploration of Kenya's domain ecosystem...",
		agenda: [
			{
				time: '10:00 - 10:10',
				title: 'Welcome & Intro',
				speaker: 'Host',
			},
			{
				time: '10:10 - 10:30',
				title: 'Trends',
				speaker: 'Dr. Sarah Kimani',
			},
		],
		tags: ['Digital', 'Domain', 'Kenya'],
		coverImg: 'https://via.placeholder.com/800x400',
	},
	{
		id: 2,
		title: 'Africa Tech Innovation Summit',
		time: {
			startDate: 'November 12, 2023',
			startTime: '2:00 PM ',
			endDate: 'November 16, 2023',
			endTime: '5:00 PM',
		},
		category: 'Conference',
		status: 'live',
		website: 'https://africatechsummit.org',
		registrationDeadline: 'November 10, 2023',
		maxAttendees: 1000,
		currentAttendees: 970,
		price: '$25',
		location: {
			type: 'physical',
			address: 'KICC, Nairobi, Kenya',
		},
		organizer: {
			name: 'TechGrowth Africa',
			logo: 'https://via.placeholder.com/60x60',
			website: 'https://techgrowth.africa',
			contact: 'info@techgrowth.africa',
		},
		partners: [
			{
				name: 'Kenya ICT Board',
				logo: 'https://picsum.photos/200/120',
				website: 'https://ictboard.go.ke',
				contact: 'events@ictboard.go.ke',
			},
			{
				name: 'Kenya ICT Board',
				logo: 'https://picsum.photos/200/120',
				website: 'https://ictboard.go.ke',
				contact: 'events@ictboard.go.ke',
			},
		],
		speakers: [],
		description: 'This summit brings together innovators and investors...',
		agenda: [
			{
				time: '2:00 - 2:30',
				title: 'Opening Keynote',
				speaker: 'CEO, TechGrowth',
			},
		],
		tags: ['Technology', 'Startups', 'Innovation'],
		coverImg: 'https://via.placeholder.com/800x400',
	},
	{
		id: 3,
		title: 'Digital Policy Forum',
		time: {
			startDate: 'September 5, 2023',
			startTime: '9:00 AM',
			endDate: 'September 5, 2023',
			endTime: '12:00 PM',
		},
		category: 'Forum',
		status: 'completed',
		website: 'https://digitalpolicyforum.africa',
		registrationDeadline: 'September 4, 2023',
		maxAttendees: 300,
		currentAttendees: 289,
		price: 'Free',
		location: {
			type: 'virtual',
			platform: 'Google Meet',
			meetingId: 'meet123',
			passcode: 'DPF2023',
		},
		organizer: {
			name: 'Africa LegalTech',
			logo: 'https://via.placeholder.com/60x60',
			website: 'https://africalegaltech.org',
			contact: 'support@africalegaltech.org',
		},
		partners: [],
		speakers: [],
		description: 'Explore the impact of regional digital policy reforms...',
		agenda: [],
		tags: ['Cybersecurity', 'Law', 'Africa'],
		coverImg: 'https://via.placeholder.com/800x400',
	},
	{
		id: 4,
		title: 'Nairobi DevFest 2023',
		time: {
			startDate: 'December 1, 2023',
			startTime: '8:00 AM',
			endDate: 'January 1, 2024',
			endTime: '6:00 PM',
		},
		category: 'Hackathon',
		status: 'upcoming',
		website: 'https://devfest.gdg.com',
		registrationDeadline: 'November 25, 2023',
		maxAttendees: 800,
		currentAttendees: 450,
		price: '$10',
		language: 'English',
		location: {
			type: 'physical',
			address: 'Strathmore University, Nairobi',
		},
		organizer: {
			name: 'Google Developer Group Nairobi',
			logo: 'https://via.placeholder.com/60x60',
			website: 'https://gdg.community.dev',
			contact: 'nairobi@gdg.dev',
		},
		partners: [],
		speakers: [],
		description: 'An immersive coding experience and networking for devs.',
		agenda: [],
		tags: ['Coding', 'Google', 'DevFest'],
		coverImg: 'https://via.placeholder.com/800x400',
	},
	{
		id: 5,
		title: 'Startup Pitch Day',
		time: {
			startDate: 'August 20, 2023',
			startTime: '11:00 AM',
			endDate: 'August 20, 2023',
			endTime: '2:00 PM',
		},
		category: 'Pitch',
		status: 'upcoming',
		website: 'https://startupkenya.com/pitchday',
		registrationDeadline: 'August 18, 2023',
		maxAttendees: 150,
		currentAttendees: 125,
		price: 'Invite Only',
		language: 'English',
		location: {
			type: 'physical',
			address: 'iHub Nairobi, Kenya',
		},
		organizer: {
			name: 'Startup Kenya',
			logo: 'https://via.placeholder.com/60x60',
			website: 'https://startupkenya.com',
			contact: 'hello@startupkenya.com',
		},
		partners: [],
		speakers: [],
		description: 'A chance for emerging startups to pitch to investors...',
		agenda: [],
		tags: ['Startups', 'Pitch', 'Funding'],
		coverImg: 'https://via.placeholder.com/800x400',
	},
];

export default function index() {
	return (
		<View className="flex-1 px-4">
			<FlatList
				data={data}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={() => (
					<>
						<Text className="mt-6 font-extrabold text-2xl">
							View Our Events
						</Text>
						<Card className="p-4 mt-6">
							<View className="flex-row gap-2 items-center mb-4">
								<AntDesign
									name="filter"
									size={18}
									color="black"
								/>
								<Text className="font-bold">Filter by:</Text>
							</View>
							<View className="flex-row gap-2 mb-2">
								<TextInput
									placeholder="Search Event"
									value=""
									className="border flex-1 border-gray-300 rounded-md h-full px-4 py-2 mb-3"
								/>
								<Button variant={'default'}>
									<Text>Search</Text>
								</Button>
							</View>
							<View className="flex-row items-center gap-2">
								<Select
									defaultValue={{
										value: 'All Events',
										label: 'All Events',
									}}
									className="flex-1"
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select year"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											label="All Events"
											value="All Events"
										>
											All Events
										</SelectItem>
										<SelectItem
											label="Upcoming"
											value="Upcoming"
										>
											Upcoming
										</SelectItem>
										<SelectItem
											label="Completed"
											value="Completed"
										>
											Completed
										</SelectItem>
									</SelectContent>
								</Select>
								<Select
									defaultValue={{
										value: 'All Events',
										label: 'All Events',
									}}
									className="flex-1"
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select year"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											label="All Events"
											value="All Events"
										>
											All Events
										</SelectItem>
										<SelectItem
											label="Virtual Event"
											value="Virtual Event"
										>
											Virtual Event
										</SelectItem>
										<SelectItem
											label="Physical Event"
											value="Physical Event"
										>
											Physical Event
										</SelectItem>
									</SelectContent>
								</Select>
							</View>
						</Card>
					</>
				)}
				renderItem={({ item, index }) => <EventCard {...item} />}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
