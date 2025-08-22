import {
	Entypo,
	EvilIcons,
	Feather,
	FontAwesome,
	Ionicons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, Pressable, ScrollView, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { Text } from '~/components/ui/text';
import { NAV_THEME } from '~/constants/colors';
import { TagsStyles } from '~/constants/sharedStyles';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RelatedBlogCard from '~/components/news/RelatedBlogCard';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import getNewsUpdate from '~/services/getNewsUpdate';
import EmptyState from '~/components/shared/EmptyState';
import KeNICSpinner from '~/components/shared/KeNICSpinner';

const { width } = Dimensions.get('window');

export default function NewsPage() {
	const { id } = useLocalSearchParams();

	const insets = useSafeAreaInsets();

	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['event', { id }],
		queryFn: () => getNewsUpdate(Number(id)),
		staleTime: 2 * 10000 * 5,
	});

	if (isLoading || !data?.data)
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<KeNICSpinner />
			</View>
		);

	if (error)
		return (
			<EmptyState
				title=""
				subtitle=""
				icon={<Feather name="calendar" size={38} color="black" />}
			/>
		);

	return (
		<View className="flex-1 px-4">
			<ScrollView
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			>
				<Text className="mt-6 text-sm font-extrabold text-green-700">
					{data.data.topic}
				</Text>
				<Text className="text-2xl font-bold">{data.data.title}</Text>
				<LinearGradient
					colors={[
						NAV_THEME.kenyaFlag.red.front,
						NAV_THEME.kenyaFlag.green.mid,
					]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{ marginBottom: 14 }}
				>
					<Image
						style={{
							width: '100%',
							height: 200,
							resizeMode: 'cover',
						}}
						source={{ uri: data.data.cover_img || '' }}
					/>
				</LinearGradient>
				<RenderHTML
					contentWidth={width - 32}
					source={{ html: data.data.content }}
					tagsStyles={TagsStyles}
				/>
				<View className="flex-row gap-6 border-b-2 items-center border-gray-500 px-4 py-6">
					<View className="flex-row items-center gap-2 p-2 rounded-lg bg-gray-200">
						<FontAwesome name="heart-o" size={18} color="#6b7280" />
						<Text className="text-gray-700">245</Text>
					</View>
					<View className="flex-row items-center gap-2 p-2 rounded-lg bg-gray-200">
						<Ionicons
							name="chatbox-outline"
							size={18}
							color="#6b7280"
						/>
						<Text>3</Text>
					</View>
					<View className="ml-auto">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Pressable>
									<Entypo
										name="dots-three-horizontal"
										size={24}
										color="#6b7280"
									/>
								</Pressable>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								insets={contentInsets}
								className="w-64 native:w-72"
							>
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<View className="flex-row items-center gap-6">
										<FontAwesome
											name="heart-o"
											size={18}
											color="black"
										/>
										<Text>Like News</Text>
									</View>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<View className="flex-row items-center gap-6">
										<EvilIcons
											name="share-google"
											size={18}
											color="black"
										/>
										<Text>Share News</Text>
									</View>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</View>
				</View>
				<Text className="text-2xl font-bold mt-6">
					Related Articles
				</Text>
				{data.related_updates?.map((news, index) => (
					<RelatedBlogCard key={index} {...news} />
				))}
			</ScrollView>
		</View>
	);
}
