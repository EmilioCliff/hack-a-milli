import { AntDesign, Feather } from '@expo/vector-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import EventCard from '~/components/events/EventCard';
import EventSkeleton from '~/components/events/EventSkeleton';
import AppControlerInput from '~/components/shared/AppControlInput';
import EmptyState from '~/components/shared/EmptyState';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
	Option,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import getEvents from '~/services/getEvents';

const initialState: Option = {
	label: 'All Events',
	value: '',
};

export default function index() {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<Option>(initialState);
	const [venue, setVenue] = useState<Option>(initialState);
	const { control, handleSubmit, reset } = useForm();

	const queryClient = useQueryClient();
	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: [
			'events',
			{ search: search, status: status?.value, venue: venue?.value },
		],
		queryFn: ({ pageParam = 1 }) =>
			getEvents({
				page: pageParam,
				search: search,
				status: status?.value,
				venue: venue?.value,
			}),
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

	const events = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<View className="flex-1 px-4">
			<FlatList
				data={events}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={() => (
					<>
						<Text className="mt-6 font-extrabold text-2xl">
							View Our Events
						</Text>
						<Card className="p-4 mt-6">
							<View className="flex-row gap-2 items-center mb-4">
								<AntDesign
									name="filter"
									size={18}
									color="black"
								/>
								<Text className="font-bold">Filter by:</Text>
							</View>
							<View className="flex-row gap-2 mb-2">
								<AppControlerInput
									control={control}
									name="search"
									placeholder="Search Event"
									className="border flex-1 border-gray-300 rounded-md h-full px-4 py-2 mb-3"
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
							<View className="flex-row items-center gap-2">
								<Select
									value={status}
									onValueChange={(opt) => setStatus(opt)}
									className="flex-1"
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select Status"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem label="All Events" value="">
											All Events
										</SelectItem>
										<SelectItem
											label="Upcoming"
											value="upcoming"
										>
											Upcoming
										</SelectItem>
										<SelectItem
											label="Completed"
											value="completed"
										>
											Completed
										</SelectItem>
									</SelectContent>
								</Select>
								<Select
									value={venue}
									onValueChange={(opt) => setVenue(opt)}
									className="flex-1"
								>
									<SelectTrigger>
										<SelectValue
											className="text-foreground text-sm native:text-lg"
											placeholder="Select Venue"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem label="All Events" value="">
											All Events
										</SelectItem>
										<SelectItem
											label="Virtual Event"
											value="virtual"
										>
											Virtual Event
										</SelectItem>
										<SelectItem
											label="Physical Event"
											value="physical"
										>
											Physical Event
										</SelectItem>
									</SelectContent>
								</Select>
							</View>
						</Card>
					</>
				)}
				renderItem={({ item, index }) => (
					<EventCard key={index} {...item} />
				)}
				refreshing={isRefreshing}
				onRefresh={() => {
					setIsRefreshing(true);
					queryClient.invalidateQueries({
						queryKey: ['events'],
					});
					reset();
					setSearch('');
					setStatus(initialState);
					setVenue(initialState);
					setIsRefreshing(false);
				}}
				showsVerticalScrollIndicator={false}
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
