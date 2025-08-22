import { AntDesign, FontAwesome, Octicons } from '@expo/vector-icons';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalToLogo from '~/components/modal/ModalToLogo';
import RegistrarCard from '~/components/registrars/RegistrarCard';
import RegistrarSkeleton from '~/components/registrars/RegistrarSkeleton';
import AppControlerInput from '~/components/shared/AppControlInput';
import AppSafeView from '~/components/shared/AppSafeView';
import EmptyState from '~/components/shared/EmptyState';
import KeNICSpinnerOverlay from '~/components/shared/KeNICSpinnerOverlay';
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
import { NAV_THEME } from '~/constants/colors';
import getRegistrars from '~/services/getRegistrars';

const initialState: Option = {
	label: 'All Services',
	value: '',
};

export default function RegistrarsPage() {
	const insets = useSafeAreaInsets();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const { control, handleSubmit, reset } = useForm();
	const [search, setSearch] = useState('');
	const [service, setService] = useState<Option>(initialState);

	const queryClient = useQueryClient();

	const { data, fetchNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['registrars', { search: search, service: service?.value }],
		queryFn: ({ pageParam = 1 }) =>
			getRegistrars({
				page: pageParam,
				search: search,
				service: service?.value,
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

	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	const registrars = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={registrars}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<>
							<ModalToLogo
								title="KENIC Accredited Registrars"
								subtitle="Choose from our trusted network of domain registrars"
								icon={
									<Octicons
										name="organization"
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
								<View className="flex-row gap-2 mb-2">
									<AppControlerInput
										control={control}
										name="search"
										placeholder="Search Registrar"
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
								<View className="flex-row gap-2">
									<Select
										value={service}
										onValueChange={(opt) => setService(opt)}
										className="w-full"
									>
										<SelectTrigger>
											<SelectValue
												className="text-foreground text-sm native:text-lg"
												placeholder="Select a service"
											/>
										</SelectTrigger>
										<SelectContent insets={contentInsets}>
											<SelectItem
												label="All Services"
												value=""
											>
												All Services
											</SelectItem>
											<SelectItem
												label="Web Hosting"
												value="web hosting"
											>
												Web Hosting
											</SelectItem>
											<SelectItem
												label="SSL Certificates"
												value="ssl certificates"
											>
												SSL Certificates
											</SelectItem>
											<SelectItem
												label="Email Services"
												value="email services"
											>
												Email Services
											</SelectItem>
										</SelectContent>
									</Select>
								</View>
							</Card>
						</>
					)}
					ListFooterComponent={() => (
						<View className="rounded-lg overflow-hidden mt-6">
							<LinearGradient
								colors={[
									NAV_THEME.kenyaFlag.red.front,
									NAV_THEME.kenyaFlag.green.mid,
								]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								locations={[0, 1]}
								style={{ padding: 12, alignItems: 'center' }}
							>
								<Octicons
									name="organization"
									size={32}
									color="white"
								/>
								<Text className="mt-2 text-white text-xl font-bold">
									Become a KENIC Registrar
								</Text>
								<Text className="my-4 text-white text-center text-sm">
									Join our network of trusted domain
									registrars and grow your business
								</Text>
								<Button className="bg-white mb-4">
									<Text className="text-black">
										Learn More
									</Text>
								</Button>
							</LinearGradient>
						</View>
					)}
					renderItem={({ item, index }) => (
						<RegistrarCard {...item} />
					)}
					showsVerticalScrollIndicator={false}
					onEndReached={() => fetchNextPage()}
					refreshing={isRefreshing}
					onRefresh={() => {
						setIsRefreshing(true);
						reset();
						setSearch('');
						setService(initialState);
						queryClient.invalidateQueries({
							queryKey: ['registrars'],
						});
						setIsRefreshing(false);
					}}
					ListEmptyComponent={
						isLoading ? (
							<View>
								{[...Array(5)].map((_, idx) => (
									<RegistrarSkeleton key={idx} />
								))}
							</View>
						) : (
							<EmptyState
								title="No Open Job Positions"
								subtitle="Check back later or try refreshing"
								icon={
									<FontAwesome
										name="building"
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
