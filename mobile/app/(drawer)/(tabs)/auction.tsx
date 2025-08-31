import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, TextInput, View } from 'react-native';
import DomainCard from '~/components/auction/DomainCard';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { Redirect, router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { persistor, RootState } from '~/store/store';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import getAuctions from '~/services/getAuctions';
import { unWatchAuction, watchAuction } from '~/store/slices/likes';
import AppControlerInput from '~/components/shared/AppControlInput';
import { useForm } from 'react-hook-form';
import EventSkeleton from '~/components/events/EventSkeleton';
import EmptyState from '~/components/shared/EmptyState';
import { openLoginModal } from '~/store/slices/ui';
import postBid from '~/services/postBid';
import AppShowMessage from '~/components/shared/AppShowMessage';
import postWatcher from '~/services/postWatcher';

interface IdomainCategory {
	id: number;
	name: string;
	label: string;
	icon: keyof typeof Feather.glyphMap;
}

const domainCategories: IdomainCategory[] = [
	{
		id: 1,
		name: 'all',
		label: 'All',
		icon: 'filter',
	},
	{
		id: 2,
		name: 'gold',
		label: 'Gold',
		icon: 'star',
	},
	{
		id: 3,
		name: 'bronze',
		label: 'Bronze',
		icon: 'award',
	},
	{
		id: 4,
		name: 'silver',
		label: 'Silver',
		icon: 'pocket',
	},
];

const Auction = () => {
	const [domainCategory, setDomainCategory] = useState('all');
	const [search, setSearch] = useState('');
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { control, handleSubmit, reset } = useForm();
	const dispatch = useDispatch();
	const watchedAuctionIds = useSelector((state: RootState) => {
		return state.likes.watchAuctionIds;
	});
	const isAuthenticated = useSelector((state: RootState) => {
		return state.user.isAuthenticated;
	});

	const queryClient = useQueryClient();

	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['auctions', { search: search, category: domainCategory }],
		queryFn: ({ pageParam = 1 }) =>
			getAuctions({
				page: pageParam,
				search: search,
				category: domainCategory,
			}),
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

	const toggleLike = async (id: number) => {
		if (!isAuthenticated) {
			dispatch(
				openLoginModal({
					title: 'Login required',
					message: 'You need to login to watch auctions.',
					confirmLabel: 'Login',
				}),
			);
			return;
		}

		var status;
		if (watchedAuctionIds[id]) {
			status = 'inactive';
			dispatch(unWatchAuction('auction:' + id));
		} else {
			status = 'active';
			dispatch(watchAuction('auction:' + id));
		}

		// send to create watcher
		try {
			await postWatcher(id, status);
			AppShowMessage({
				message: 'Auction watchlist updated',
				type: 'success',
			});
			return;
		} catch (error: any) {
			AppShowMessage({
				message: error.message,
			});
			return;
		}
	};

	const onBid = async (auctionId: number, amount: number) => {
		if (!isAuthenticated) {
			dispatch(
				openLoginModal({
					title: 'Login required',
					message: 'You need to login to bin an auctions.',
					confirmLabel: 'Login',
				}),
			);
			return;
		}

		try {
			await postBid(auctionId, amount);
			queryClient.invalidateQueries({ queryKey: ['auctions'] });
			AppShowMessage({
				message: 'Bid placed successfully',
				type: 'success',
			});
			return;
		} catch (error: any) {
			AppShowMessage({
				message: error.message,
			});
			return;
		}
	};

	const auctions = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<AppSafeView>
			<View className="flex-1 px-4 pb-10">
				<FlatList
					data={auctions}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<>
							<ModalToLogo
								title="Domain Auctions"
								subtitle="Bid on premium .KE domains"
								icon={
									<FontAwesome
										name="gavel"
										size={32}
										color="white"
									/>
								}
							/>
							<Button
								onPress={() => router.push('/(auth)/signin')}
							>
								<Text>Go To Login</Text>
							</Button>
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
								<View className="flex-row items-center gap-2 mb-2">
									<AppControlerInput
										control={control}
										name="search"
										placeholder="Search Event"
										className="border flex-1 border-gray-300 rounded-md px-4 py-2 h-full"
									/>

									<Button
										onPress={handleSubmit((val) =>
											setSearch(val.search),
										)}
										variant={'default'}
									>
										<Text>Search</Text>
									</Button>
								</View>
								<View className="flex-row flex-wrap gap-2">
									{domainCategories.map((item, idx) => {
										const isSelected =
											domainCategory === item.name;
										return (
											<Button
												key={idx}
												variant={
													isSelected
														? 'default'
														: 'outline'
												}
												size={'sm'}
												onPress={() =>
													setDomainCategory(item.name)
												}
												style={{ gap: 3 }}
												className="flex-row px-2 items-center"
											>
												<Feather
													name={item.icon}
													size={16}
													color={
														isSelected
															? 'white'
															: 'black'
													}
												/>
												<Text
													className={`font-bold
														${isSelected ? '' : ''}
													`}
												>
													{item.label}
												</Text>
											</Button>
										);
									})}
								</View>
							</Card>
						</>
					)}
					renderItem={({ item, index }) => {
						const isLiked =
							!!watchedAuctionIds['auction:' + item.id];
						return (
							<DomainCard
								key={index}
								isLiked={isLiked}
								toggleLike={toggleLike}
								data={item}
								onBid={onBid}
							/>
						);
					}}
					showsVerticalScrollIndicator={false}
					refreshing={isRefreshing}
					onRefresh={() => {
						setIsRefreshing(true);
						queryClient.invalidateQueries({
							queryKey: ['auctions'],
						});
						reset();
						setSearch('');
						setDomainCategory('all');
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
								title="No Live Auction"
								subtitle="Check back later or try refreshing"
								icon={
									<Feather
										name="calendar"
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
};

export default Auction;
