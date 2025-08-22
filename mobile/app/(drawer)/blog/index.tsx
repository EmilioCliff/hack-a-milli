import { FontAwesome5 } from '@expo/vector-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BlogCard from '~/components/blog/BlogCard';
import BlogSkeleton from '~/components/blog/BlogSkeleton';
import MerchSkeleton from '~/components/merchandise/MerchSkeleton';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import EmptyState from '~/components/shared/EmptyState';
import getBlogs from '~/services/getBlogs';
import { likeBlog, unlikeBlog } from '~/store/slices/likes';
import { RootState } from '~/store/store';

export default function index() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const dispatch = useDispatch();
	const likedBlogIds = useSelector(
		(state: RootState) => state.likes.likedBlogIds,
	);

	const queryClient = useQueryClient();

	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['blogs'],
		queryFn: ({ pageParam = 1 }) => getBlogs(pageParam),
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
		if (likedBlogIds[id]) {
			dispatch(unlikeBlog(id));
		} else {
			dispatch(likeBlog(id));
		}
	};

	const blogs = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={blogs}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<ModalToLogo
							title="KENIC Blog"
							subtitle="Insights, tutorials and industry updates"
							icon={
								<FontAwesome5
									name="book-reader"
									size={32}
									color="white"
								/>
							}
						/>
					)}
					renderItem={({ item, index }) => {
						const isLiked = !!likedBlogIds['blog:' + item.id];
						return (
							<BlogCard
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
							queryKey: ['blogs'],
						});
						setIsRefreshing(false);
					}}
					ListEmptyComponent={
						isLoading ? (
							<View>
								{[...Array(5)].map((_, idx) => (
									<BlogSkeleton key={idx} />
								))}
							</View>
						) : (
							<EmptyState
								title="No Open Job Positions"
								subtitle="Check back later or try refreshing"
								icon={
									<FontAwesome5
										name="book-reader"
										size={32}
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
