import { FlatList, Pressable, TouchableOpacity, View } from 'react-native';
import AppSafeView from '~/components/shared/AppSafeView';
import { Link, router, useRouter } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import MerchCard from '~/components/merchandise/MerchCard';
import { s } from 'react-native-size-matters';
import ModalToLogo from '~/components/modal/ModalToLogo';
import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import getMerchandises from '~/services/getMerchandises';
import JobPostingSkeleton from '~/components/careers/JobCareerSkeleton';
import EmptyState from '~/components/shared/EmptyState';
import MerchSkeleton from '~/components/merchandise/MerchSkeleton';

const colNum = 2;
const gap = 12;

export default function index() {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const queryClient = useQueryClient();

	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['merchandise'],
		queryFn: ({ pageParam = 1 }) => getMerchandises(pageParam),
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

	const jobMerchandises = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<AppSafeView>
			<FlatList
				numColumns={2}
				data={jobMerchandises}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={() => (
					<View className="mb-4">
						<ModalToLogo
							title="KENIC Store"
							subtitle="Official KENIC merchandise and branded items"
							icon={
								<Entypo
									name="shopping-bag"
									size={32}
									color="white"
								/>
							}
						/>
					</View>
				)}
				renderItem={({ item, index }) => (
					<View
						style={{
							// flexGrow: 1,
							paddingLeft: index % colNum === 0 ? gap : 0,
							paddingRight: index % 1 === 0 ? gap : 0,
							paddingBottom: index % 1 === 0 ? gap : 0,
							paddingTop: index < colNum ? gap : 0,
						}}
					>
						<Link
							href={{
								pathname: '/(drawer)/merchandise/[id]',
								params: { id: item.id },
							}}
							asChild
						>
							<Pressable>
								<MerchCard key={index} {...item} />
							</Pressable>
						</Link>
					</View>
				)}
				showsVerticalScrollIndicator={false}
				onEndReached={() => fetchNextPage()}
				refreshing={isRefreshing}
				onRefresh={() => {
					setIsRefreshing(true);
					queryClient.invalidateQueries({
						queryKey: ['merchandise'],
					});
					setIsRefreshing(false);
				}}
				ListEmptyComponent={
					isLoading ? (
						<View className="p-4">
							{[...Array(5)].map((_, idx) => (
								<MerchSkeleton key={idx} />
							))}
						</View>
					) : (
						<EmptyState
							title="No Products Vailable"
							subtitle="Check back later or try refreshing"
							icon={
								<Entypo
									name="shopping-bag"
									size={38}
									color="black"
								/>
							}
						/>
					)
				}
			/>
			<TouchableOpacity
				onPress={() => router.push('/(drawer)/merchandise/cart')}
				className="absolute right-4 bottom-4 z-10 justify-center items-center rounded-full bg-black"
				style={{ height: s(32), width: s(32) }}
			>
				<Entypo name="shopping-cart" size={18} color="white" />
			</TouchableOpacity>
		</AppSafeView>
	);
}
