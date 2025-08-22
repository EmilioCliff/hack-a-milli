import { FlatList, View } from 'react-native';
import AppSafeView from '~/components/shared/AppSafeView';
import ModalToLogo from '~/components/modal/ModalToLogo';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import JobListing from '~/components/careers/job-listing';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import getJobPostings from '~/services/getJobPostings';
import EmptyState from '~/components/shared/EmptyState';
import JobPostingSkeleton from '~/components/careers/JobCareerSkeleton';

export default function CareersPage() {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const queryClient = useQueryClient();

	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['job-postings'],
		queryFn: ({ pageParam = 1 }) => getJobPostings(pageParam),
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

	const jobPostings = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={jobPostings}
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
						<JobListing key={index} {...item} />
					)}
					showsVerticalScrollIndicator={false}
					onEndReached={() => fetchNextPage()}
					refreshing={isRefreshing}
					onRefresh={() => {
						setIsRefreshing(true);
						queryClient.invalidateQueries({
							queryKey: ['job-postings'],
						});
						setIsRefreshing(false);
					}}
					ListEmptyComponent={
						isLoading ? (
							<View>
								{[...Array(5)].map((_, idx) => (
									<JobPostingSkeleton key={idx} />
								))}
							</View>
						) : (
							<EmptyState
								title="No Open Job Positions"
								subtitle="Check back later or try refreshing"
								icon={
									<Ionicons
										name="people-sharp"
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
