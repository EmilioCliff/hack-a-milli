import { Feather } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { View } from 'react-native';
import ExpandableHtml from '~/components/events/ExpandableHtml';
import AppSafeView from '~/components/shared/AppSafeView';
import EmptyState from '~/components/shared/EmptyState';
import KeNICSpinner from '~/components/shared/KeNICSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Card } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';
import { NAV_THEME } from '~/constants/colors';
import getEvent from '~/services/getEvent';

export default function EventPage() {
	const [value, setValue] = useState('overview');
	const { id } = useLocalSearchParams();

	const { data, isLoading, error } = useQuery({
		queryKey: ['event', { id }],
		queryFn: () => getEvent(Number(id)),
		staleTime: 2 * 10000 * 5,
	});

	if (isLoading || !data?.data)
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<KeNICSpinner />
			</View>
		);

	if (error)
		return (
			<EmptyState
				title=""
				subtitle=""
				icon={<Feather name="calendar" size={38} color="black" />}
			/>
		);
	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				className="flex-1 px-4"
			>
				<LinearGradient
					colors={[
						NAV_THEME.kenyaFlag.red.front,
						NAV_THEME.kenyaFlag.green.mid,
					]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					locations={[0, 1]}
					style={{ marginBottom: 14, marginTop: 14 }}
				>
					<Image
						style={{
							width: '100%',
							height: 300,
							resizeMode: 'cover',
						}}
						source={{ uri: data.data.cover_img }}
					/>
				</LinearGradient>
				<Text className="text-sm font-extrabold text-green-700">
					{data.data.topic.toUpperCase()}
				</Text>
				<Text className="text-4xl font-extrabold mb-4">
					{data.data.title}
				</Text>
				<Tabs
					value={value}
					onValueChange={setValue}
					className="w-full max-w-[400px] mx-auto gap-1.5"
				>
					<TabsList className="flex-row w-full">
						<TabsTrigger value="overview" className="flex-1">
							<Text>Overview</Text>
						</TabsTrigger>
						<TabsTrigger value="agenda" className="flex-1">
							<Text>Agenda</Text>
						</TabsTrigger>
						<TabsTrigger value="speakers" className="flex-1">
							<Text>Speakers</Text>
						</TabsTrigger>
						<TabsTrigger value="details" className="flex-1">
							<Text>Details</Text>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<Card className="p-4 mt-4">
							<Text className="text-2xl font-semibold mb-4">
								About This Event
							</Text>
							<View className="">
								<ExpandableHtml
									htmlContent={data.data.content}
								/>
							</View>
						</Card>
						<Card className="p-4 my-6">
							<Text className="text-2xl font-semibold mb-4">
								Topics
							</Text>
							<View className="flex-row gap-2 flex-wrap">
								{data.data.tags?.map((tag, index) => (
									<Badge variant={'secondary'} key={index}>
										<Text className="font-extrabold">
											{tag}
										</Text>
									</Badge>
								))}
							</View>
						</Card>
					</TabsContent>
					<TabsContent value="agenda">
						<Card className="p-4 my-4">
							<Text className="text-2xl font-semibold mb-4">
								Event Agenda
							</Text>
							<View className="gap-2">
								{data.data.agenda?.map((agenda, index) => (
									<View
										key={index}
										className="flex-row items-start p-4 bg-gray-50 rounded-lg"
									>
										<View className="bg-primary px-3 py-1 rounded-full mr-4 whitespace-nowrap">
											<Text className="text-white text-sm font-bold">
												{agenda.time}
											</Text>
										</View>
										<View className="flex-1">
											<Text className="font-bold text-gray-900 mb-1">
												{agenda.title}
											</Text>
											<Text className="text-sm text-gray-600">
												{agenda.speaker}
											</Text>
										</View>
									</View>
								))}
							</View>
						</Card>
					</TabsContent>
					<TabsContent value="speakers">
						{data.data.speakers?.map((speaker, index) => (
							<Card className="p-4 mt-4" key={index}>
								<View className="flex-row justify-start gap-2 mb-2">
									<Avatar alt="Publisher Avatar">
										<AvatarImage
											source={{ uri: speaker.avatar_url }}
										/>
										<AvatarFallback>
											<Text>
												{speaker.name
													.split(' ')
													.map((word) =>
														word.charAt(0),
													)
													.join('')
													.toUpperCase()}
											</Text>
										</AvatarFallback>
									</Avatar>
									<View className="flex-shrink">
										<Text className="text-lg font-semibold text-gray-900">
											{speaker.name}
										</Text>
										<Text className="text-primary font-medium">
											{speaker.title}
										</Text>
										<Text className="text-gray-600 mb-3">
											{speaker.organization}
										</Text>
										<Text className="text-gray-700 mb-4">
											{speaker.bio}
										</Text>
										<TouchableOpacity
											onPress={() =>
												Linking.openURL(
													speaker.linked_in_url,
												)
											}
										>
											<View className="flex-row gap-2 items-center">
												<Feather
													name="external-link"
													size={18}
													color="red"
												/>
												<Text className="text-primary">
													LinkedInn
												</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>
							</Card>
						))}
					</TabsContent>
					<TabsContent value="details">
						<Card className="p-4 mt-4">
							<Text className="text-2xl font-semibold mb-4">
								Event Details
							</Text>
							<View className="flex-row items-center gap-4 mb-6">
								<Feather name="map-pin" size={24} color="red" />
								<View>
									<Text className="text-lg font-bold">
										{data.data.venue?.type === 'virtual'
											? 'Virtual'
											: 'Physical'}{' '}
										Event
									</Text>
									{data.data.venue?.type === 'virtual' ? (
										<Text className="text-gray-500">
											Platform:{' '}
											{data.data.venue?.platform}
										</Text>
									) : (
										<Text className="text-gray-500">
											{data.data.venue?.address}
										</Text>
									)}
								</View>
							</View>
							{data.data.venue?.type === 'virtual' && (
								<View className="p-2 bg-gray-50">
									<Text className="text-gray-500">
										Meeting Details:{' '}
									</Text>
									<Text>
										ID: {data.data.venue?.meeting_id}
									</Text>
									<Text>
										Passcode: {data.data.venue?.passcode}
									</Text>
									<Text>
										Link:{' '}
										<Text className="text-primary font-bold">
											{data.data.venue?.event_link}
										</Text>
									</Text>
								</View>
							)}
						</Card>
						<Card className="p-4 my-4">
							<Text className="text-2xl font-semibold mb-4">
								Organizers
							</Text>
							<View className="gap-4">
								{data.data.organizers?.map(
									(organizer, index) => (
										<View
											key={index}
											className="flex-row gap-4"
										>
											<LinearGradient
												colors={[
													NAV_THEME.kenyaFlag.red
														.front,
													NAV_THEME.kenyaFlag.green
														.mid,
												]}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 1 }}
												style={{
													width: '30%',
													aspectRatio: 1,
													borderRadius: 8,
												}}
											>
												<Image
													style={{
														width: '100%',
														height: '100%',
														resizeMode: 'cover',
													}}
													source={{
														uri: organizer.logo_url,
													}}
												/>
											</LinearGradient>
											<View>
												<Text className="text-lg font-bold">
													{organizer.name}
												</Text>
												<Text className="text-gray-500 font-bold">
													{organizer.email}
												</Text>
												<TouchableOpacity
													onPress={() =>
														Linking.openURL(
															organizer.website,
														)
													}
												>
													<Text className="text-primary font-semibold mt-2">
														Visit Website
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									),
								)}
							</View>
						</Card>
						<Card className="p-4 mb-4">
							<Text className="text-2xl font-semibold mb-4">
								Partners
							</Text>
							<View className="gap-4">
								{data.data.partners?.map((partner, index) => (
									<View
										key={index}
										className="flex-row gap-4"
									>
										<LinearGradient
											colors={[
												NAV_THEME.kenyaFlag.red.front,
												NAV_THEME.kenyaFlag.green.mid,
											]}
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 1 }}
											style={{
												width: '30%',
												aspectRatio: 1,
												borderRadius: 8,
											}}
										>
											<Image
												style={{
													width: '100%',
													height: '100%',
													resizeMode: 'cover',
												}}
												source={{
													uri: partner.logo_url,
												}}
											/>
										</LinearGradient>
										<View>
											<Text className="text-lg font-bold">
												{partner.name}
											</Text>
											<Text className="text-gray-500 font-bold">
												{partner.email}
											</Text>
											<TouchableOpacity
												onPress={() =>
													Linking.openURL(
														partner.website,
													)
												}
											>
												<Text className="text-primary font-semibold mt-2">
													Visit Website
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								))}
							</View>
						</Card>
						<Card className="p-4 my-6">
							<Text className="text-2xl font-semibold mb-4">
								Additional Information
							</Text>
							<View className="flex-row gap-2 flex-wrap">
								<View className="flex-1">
									<Text className="text-gray-500">
										Attendees
									</Text>
									<Text className=" font-semibold">
										{data.data.registered_attendees} /{' '}
										{data.data.max_attendees}
									</Text>
								</View>
								<View className="flex-1">
									<Text className="text-gray-500">
										Status
									</Text>
									<Text
										className={`font-semibold ${data.data.status === 'upcoming' ? 'text-secondary' : 'text-primary'}`}
									>
										{data.data.status === 'upcoming'
											? 'Open'
											: 'Closed'}
									</Text>
								</View>
							</View>
							<View className="mt-2">
								<View>
									<Text className="text-gray-500">Price</Text>
									<Text className="text-secondary font-semibold">
										{data.data.price.toUpperCase()}
									</Text>
								</View>
							</View>
						</Card>
					</TabsContent>
				</Tabs>
			</ScrollView>
		</AppSafeView>
	);
}
