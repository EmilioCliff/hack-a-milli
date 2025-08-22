import { Image, Share, TouchableOpacity, View } from 'react-native';
import { Text } from '../ui/text';
import { Card } from '../ui/card';
import { LinearGradient } from 'expo-linear-gradient';
import { NAV_THEME } from '~/constants/colors';
import { Badge } from '../ui/badge';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { NewsUpdate } from '~/lib/types';
import { format } from 'date-fns';

interface newsCardProps {
	data: NewsUpdate;
	isLiked: boolean;
	toggleLike: (id: string) => void;
}

export default function NewsCard(props: newsCardProps) {
	const onShare = async (id: number, title: string) => {
		Share.share({
			message: `Read about KeNIC News Update on: ${title}`,
			url: `${process.env.EXPO_PUBLIC_WEBSITE_URL}/news/${id}`,
		});
	};
	return (
		<Card className="flex-row flex-wrap gap-2 overflow-hidden mt-4">
			<LinearGradient
				colors={[
					NAV_THEME.kenyaFlag.red.front,
					NAV_THEME.kenyaFlag.green.mid,
				]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{ width: '30%', aspectRatio: 1 }}
			>
				<Image
					style={{
						width: '100%',
						height: '100%',
						resizeMode: 'cover',
					}}
					source={{ uri: props.data.cover_img || '' }}
				/>
			</LinearGradient>
			<View className="p-2 flex-shrink flex-1">
				<View className="flex-row gap-2 mb-2">
					<Badge variant={'outline'}>
						<Text className="font-semibold">
							{props.data.topic}
						</Text>
					</Badge>
					<Text className="text-gray-600">
						{props.data.min_read} min read
					</Text>
				</View>
				<Link
					href={{
						pathname: '/(drawer)/(tabs)/news/[id]',
						params: { id: props.data.id },
					}}
				>
					<Text className="text-lg font-bold">
						{props.data.title}
					</Text>
				</Link>
				<Text
					numberOfLines={3}
					ellipsizeMode="tail"
					className="text-gray-600 mb-4"
				>
					{props.data.excerpt}
				</Text>
				<View className="flex-row justify-between items-center">
					<Text className="text-gray-400">
						{format(props.data.date, 'yyyy-MM-dd')}
					</Text>
					<View className="flex-row justify-end items-center gap-2">
						<TouchableOpacity
							onPress={() =>
								props.toggleLike('news:' + props.data.id)
							}
						>
							{props.isLiked ? (
								<FontAwesome
									name="heart"
									size={18}
									color="red"
								/>
							) : (
								<FontAwesome
									name="heart-o"
									size={18}
									color="black"
								/>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() =>
								onShare(props.data.id, props.data.title)
							}
						>
							<EvilIcons
								name="share-google"
								size={24}
								color="black"
							/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Card>
	);
}
