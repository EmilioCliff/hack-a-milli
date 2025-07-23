import { FlatList, View } from 'react-native';
import AppSafeView from '~/components/shared/AppSafeView';
import ModalToLogo from '~/components/modal/ModalToLogo';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import JobListing from '~/components/careers/job-listing';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

const data = [
	{
		id: 1,
		title: 'Senior Software Engineer',
		department: 'Engineering',
		location: 'Nairobi, Kenya',
		type: 'Full-time',
		salary: 'KES 800K - 1.2M',
		posted: '2 days ago',
	},
	{
		id: 2,
		title: 'Domain Registry Specialist',
		department: 'Operations',
		location: 'Nairobi, Kenya',
		type: 'Full-time',
		salary: 'KES 600K - 900K',
		posted: '1 week ago',
	},
	{
		id: 3,
		title: 'Cybersecurity Analyst',
		department: 'Security',
		location: 'Remote',
		type: 'Full-time',
		salary: 'KES 700K - 1M',
		posted: '3 days ago',
	},
];

export default function CareersPage() {
	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={data}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<ModalToLogo
							title="Join Our Team"
							subtitle="Build the future of Kenya's digital infrastructure"
							icon={
								<Ionicons
									name="people-outline"
									size={32}
									color="white"
								/>
							}
						/>
					)}
					ListFooterComponent={() => (
						<Card className="my-6">
							<CardHeader>
								<CardTitle>Why Work at KENIC?</CardTitle>
							</CardHeader>
							<CardContent className="gap-4">
								<View className="gap-4">
									<View className="flex-row justify-between items-center gap-4">
										<View className="flex-1 p-4 bg-red-50 rounded-lg">
											<Feather
												name="heart"
												size={32}
												color="red"
												style={{
													marginHorizontal: 'auto',
												}}
											/>
											<Text className="text-center text-sm font-semibold mt-2">
												Health Insurance
											</Text>
										</View>
										<View className="flex-1 p-4 bg-green-50 rounded-lg">
											<FontAwesome
												name="graduation-cap"
												size={32}
												color="green"
												style={{
													marginHorizontal: 'auto',
												}}
											/>
											<Text className="text-center text-sm font-semibold mt-2">
												Learning Budget
											</Text>
										</View>
									</View>
									<View className="flex-row justify-between items-center gap-4">
										<View className="flex-1 p-4 bg-blue-50 rounded-lg">
											<Feather
												name="users"
												size={32}
												color="blue"
												style={{
													marginHorizontal: 'auto',
												}}
											/>
											<Text className="text-center text-sm font-semibold mt-2">
												Team Building
											</Text>
										</View>
										<View className="flex-1 p-4 bg-yellow-50 rounded-lg">
											<Feather
												name="award"
												size={32}
												color="#ca8a04"
												style={{
													marginHorizontal: 'auto',
												}}
											/>
											<Text className="text-center text-sm font-semibold mt-2">
												Performance Bonus
											</Text>
										</View>
									</View>
								</View>
							</CardContent>
						</Card>
					)}
					renderItem={({ item, index }) => (
						<JobListing
							id={item.id}
							title={item.title}
							department={item.department}
							location={item.location}
							type={item.type}
							salary={item.salary}
							posted={item.posted}
						/>
					)}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</AppSafeView>
	);
}
