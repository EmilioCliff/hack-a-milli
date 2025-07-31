import { AntDesign, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, TextInput, FlatList } from 'react-native';
import ModalToLogo from '~/components/modal/ModalToLogo';
import NewsLetterCard from '~/components/newsletter/NewsLetterCard';
import AppSafeView from '~/components/shared/AppSafeView';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { NAV_THEME } from '~/constants/colors';

const data = [
	{
		id: 1,
		title: 'Kenya Launches New Tech Innovation Hub',
		description:
			'The government partners with local startups to open a state-of-the-art technology hub in Nairobi.',
		date: '2025-06-15',
	},
	{
		id: 2,
		title: 'KeNIC Announces New Domain Pricing',
		description:
			'KeNIC has revised its .KE domain pricing structure to promote local digital adoption.',
		date: '2025-05-10',
	},
	{
		id: 3,
		title: 'Truehost Cloud Expands Data Center Capacity',
		description:
			'Truehost Kenya opens new server infrastructure to boost hosting performance and redundancy.',
		date: '2025-04-27',
	},
	{
		id: 4,
		title: 'Cybersecurity Awareness Month Campaign',
		description:
			'The Communications Authority launches a national campaign to educate citizens on cybersecurity best practices.',
		date: '2025-03-08',
	},
];

export default function NewsLetterPage() {
	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={data}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<>
							<ModalToLogo
								title="KENIC Newsletter"
								subtitle="Stay updated with the latest .ke domain news and insights"
								icon={
									<FontAwesome
										name="envelope-o"
										size={32}
										color="white"
									/>
								}
							/>
							<Card className="p-4 mt-6">
								<View className="flex-row gap-2 items-center mb-4">
									<AntDesign
										name="filter"
										size={18}
										color="black"
									/>
									<Text className="font-bold">
										Filter by:
									</Text>
								</View>
								<Select
									defaultValue={{
										value: 'all years',
										label: 'All Years',
									}}
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select year"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											label="All Years"
											value="all years"
										>
											All Location
										</SelectItem>
										<SelectItem label="2025" value="2025">
											2025
										</SelectItem>
										<SelectItem label="2024" value="2024">
											2024
										</SelectItem>
										<SelectItem label="2023" value="2023">
											2023
										</SelectItem>
										<SelectItem label="2022" value="2022">
											2022
										</SelectItem>
										<SelectItem label="2021" value="2021">
											2021
										</SelectItem>
										<SelectItem label="2020" value="2020">
											2020
										</SelectItem>
									</SelectContent>
								</Select>
							</Card>
						</>
					)}
					ListFooterComponent={() => (
						<Card className="overflow-hidden mt-16">
							<CardHeader className="bg-green-50">
								<View className="flex-row gap-2 items-center">
									<EvilIcons
										name="bell"
										size={24}
										color="#6b7280"
									/>
									<Text className="text-green-800 text-xl font-semibold">
										Subscribe to Our NewsLetter
									</Text>
								</View>
							</CardHeader>
							<View className="p-4">
								<Text className="text-lg font-bold mb-2">
									Email Address
								</Text>
								<TextInput
									placeholder="Enter your email address"
									value={''}
									className="border border-gray-300 rounded-md px-4 py-2 mb-6"
								/>
								<Text className="text-lg font-bold mb-2">
									Full Name (Optional)
								</Text>
								<TextInput
									placeholder="Enter your full name"
									value={''}
									className="border border-gray-300 rounded-md px-4 py-2 mb-6"
								/>
								<LinearGradient
									colors={[
										NAV_THEME.kenyaFlag.red.front,
										NAV_THEME.kenyaFlag.green.mid,
									]}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 0 }}
									locations={[0, 1]}
								>
									<Button className="flex-row bg-transparent gap-6 items-center">
										<FontAwesome
											name="envelope-o"
											size={18}
											color="white"
										/>
										<Text className="text-white font-bold">
											Subscribe Now
										</Text>
									</Button>
								</LinearGradient>
							</View>
						</Card>
					)}
					renderItem={({ item, index }) => (
						<NewsLetterCard {...item} />
					)}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</AppSafeView>
	);
}
