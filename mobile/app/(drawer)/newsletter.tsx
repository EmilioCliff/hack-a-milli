import { AntDesign, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import EventSkeleton from '~/components/events/EventSkeleton';
import ModalToLogo from '~/components/modal/ModalToLogo';
import NewsLetterCard from '~/components/newsletter/NewsLetterCard';
import { getDownloadURLHelper } from '~/components/registrars/helper';
import AppSafeView from '~/components/shared/AppSafeView';
import EmptyState from '~/components/shared/EmptyState';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { NAV_THEME } from '~/constants/colors';
import getNewsLetters from '~/services/getNewsLetters';

export default function NewsLetterPage() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [year, setYear] = useState('');
	// const [downloadableLink, setDownloadableLink] = useState(
	// 	'https://firebasestorage.googleapis.com/v0/b/kenic-hack-a-milli.firebasestorage.app/o/news-letters%2Fpublished%2FTika%20In%20Action.pdf?alt=media&token=6fe8f784-ad22-4a04-af55-60fc647a0a5f',
	// );

	const queryClient = useQueryClient();

	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['news-letters', { year: year }],
		queryFn: ({ pageParam = 1 }) =>
			getNewsLetters({ page: pageParam, date_range: year }),
		staleTime: 2 * 10000 * 5,
		initialPageParam: 1,
		retry: (failureCount, error) => {
			if (failureCount < 5) {
				return true;
			}
			return false;
		},
		getNextPageParam: (lastPage) => {
			return lastPage.pagination?.has_next
				? lastPage.pagination?.next_page
				: null;
		},
	});

	const helperDownloadLink = async () => {
		try {
			const link = await getDownloadURLHelper();
			console.log(link);
		} catch (error) {
			console.log(error);
		}
	};

	const newsLetters = data?.pages.flatMap((page) => page.data) ?? [];
	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={newsLetters}
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
							<Button onPress={helperDownloadLink}>
								<Text>Get Downloadable Link</Text>
							</Button>
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
					refreshing={isRefreshing}
					onRefresh={() => {
						setIsRefreshing(true);
						queryClient.invalidateQueries({
							queryKey: ['news-letters'],
						});
						setYear('');
						setIsRefreshing(false);
					}}
					onEndReached={() => fetchNextPage()}
					ListEmptyComponent={
						isLoading ? (
							<View>
								{[...Array(5)].map((_, idx) => (
									<EventSkeleton key={idx} />
								))}
							</View>
						) : (
							<EmptyState
								title="No Events Found"
								subtitle="Check back later or try refreshing"
								icon={
									<FontAwesome
										name="envelope"
										size={38}
										color="black"
									/>
								}
							/>
						)
					}
				/>
			</View>
		</AppSafeView>
	);
}
