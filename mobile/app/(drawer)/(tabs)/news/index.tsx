import { Feather } from '@expo/vector-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, Image } from 'react-native';
import { View } from 'react-native';
import NewsCard from '~/components/news/NewsCard';
import NewsUpdateSkeleton from '~/components/news/NewsSkeleton';
import EmptyState from '~/components/shared/EmptyState';
import { Text } from '~/components/ui/text';
import getNewsUpdates from '~/services/getNewsUpdates';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '~/store/store';
import { clearLikes, likeNews, unlikeNews } from '~/store/slices/likes';

export default function index() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const dispatch = useDispatch();
	const likedNewsIds = useSelector(
		(state: RootState) => state.likes.likedNewsIds,
	);

	const queryClient = useQueryClient();

	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['news-updates'],
		queryFn: ({ pageParam = 1 }) => getNewsUpdates(pageParam),
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

	const toggleLike = (id: string) => {
		if (likedNewsIds[id]) {
			dispatch(unlikeNews(id));
		} else {
			dispatch(likeNews(id));
		}
	};

	const newsUpdates = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<View className="flex-1 px-4">
			<FlatList
				data={newsUpdates}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={() => (
					<Text className="text-3xl font-extrabold my-4">
						Latest News
					</Text>
				)}
				renderItem={({ item, index }) => {
					const isLiked = !!likedNewsIds['news:' + item.id];

					return (
						<NewsCard
							key={index}
							isLiked={isLiked}
							toggleLike={toggleLike}
							data={item}
						/>
					);
				}}
				showsVerticalScrollIndicator={false}
				onEndReached={() => fetchNextPage()}
				refreshing={isRefreshing}
				onRefresh={() => {
					setIsRefreshing(true);
					queryClient.invalidateQueries({
						queryKey: ['news-updates'],
					});
					setIsRefreshing(false);
				}}
				ListEmptyComponent={
					isLoading ? (
						<View>
							{[...Array(5)].map((_, idx) => (
								<NewsUpdateSkeleton key={idx} />
							))}
						</View>
					) : (
						<EmptyState
							title="No News Found"
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
	);
}
