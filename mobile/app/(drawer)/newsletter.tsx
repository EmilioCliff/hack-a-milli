import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { View, FlatList } from 'react-native';
import EventSkeleton from '~/components/events/EventSkeleton';
import ModalToLogo from '~/components/modal/ModalToLogo';
import NewsLetterCard from '~/components/newsletter/NewsLetterCard';
import AppSafeView from '~/components/shared/AppSafeView';
import EmptyState from '~/components/shared/EmptyState';
import { Card } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import getNewsLetters from '~/services/getNewsLetters';

export default function NewsLetterPage() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [year, setYear] = useState('');

	const [downloadProgress, setDownloadProgress] = useState(0);
	const [isDownloading, setIsDownloading] = useState(false);

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

	const newsLetters = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<>
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
											<SelectItem
												label="2025"
												value="2025"
											>
												2025
											</SelectItem>
											<SelectItem
												label="2024"
												value="2024"
											>
												2024
											</SelectItem>
											<SelectItem
												label="2023"
												value="2023"
											>
												2023
											</SelectItem>
											<SelectItem
												label="2022"
												value="2022"
											>
												2022
											</SelectItem>
											<SelectItem
												label="2021"
												value="2021"
											>
												2021
											</SelectItem>
											<SelectItem
												label="2020"
												value="2020"
											>
												2020
											</SelectItem>
										</SelectContent>
									</Select>
								</Card>
							</>
						)}
						renderItem={({ item, index }) => (
							<NewsLetterCard
								key={index}
								data={item}
								setIsDownloading={setIsDownloading}
								setDownloadProgress={setDownloadProgress}
							/>
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
			{isDownloading && (
				<View className="absolute left-0 right-0 top-0 bottom-0 z-50 bg-black/60 items-center justify-center p-6">
					<View className="bg-white p-6 rounded-2xl w-11/12 max-w-md items-center">
						<Text className="text-lg font-bold mb-4">
							Downloading File...
						</Text>
						<Progress
							value={downloadProgress}
							className="w-full h-3 mb-3 bg-gray-200"
						/>
						<Text className="mb-4">{downloadProgress}%</Text>
					</View>
				</View>
			)}
		</>
	);
}
