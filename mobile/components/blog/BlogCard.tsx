import { Image, Share, TouchableOpacity, View } from 'react-native';
import { Badge } from '../ui/badge';
import { Text } from '../ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EvilIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NAV_THEME } from '~/constants/colors';
import { Link } from 'expo-router';
import { Blog } from '~/lib/types';
import { format } from 'date-fns';
import AppShowMessage from '../shared/AppShowMessage';

interface blogCardProps {
	data: Blog;
	isLiked: boolean;
	toggleLike: (id: string) => void;
}

export default function BlogCard(props: blogCardProps) {
	const onShare = async (id: number, title: string) => {
		Share.share({
			message: `Read about KeNIC Blog on: ${title}`,
			url: `${process.env.EXPO_PUBLIC_WEBSITE_URL}/blogs/${id}`,
		});
	};
	return (
		<View className="mt-6 rounded-lg overflow-hidden border border-border shadow-sm  shadow-foreground/10">
			<LinearGradient
				colors={[
					NAV_THEME.kenyaFlag.red.front,
					NAV_THEME.kenyaFlag.green.mid,
				]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				locations={[0, 1]}
				style={{ marginBottom: 14 }}
			>
				<Image
					style={{
						width: '100%',
						height: 120,
						resizeMode: 'cover',
					}}
					source={{ uri: props.data.cover_img }}
				/>
			</LinearGradient>
			<View className="px-4">
				<View className="flex-row justify-between items-center mb-2">
					<Badge variant={'outline'}>
						<Text className="font-bold">{props.data.topic}</Text>
					</Badge>
					<Text>{props.data.min_read} min read</Text>
				</View>
				<Link
					href={{
						pathname: '/(drawer)/blog/[id]',
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
					className="my-2 text-gray-600"
				>
					{props.data.description}
				</Text>
				<View className="flex-row justify-between items-center mb-4">
					<View className="flex-row justify-start items-center gap-2">
						<Avatar alt="Publisher Avatar">
							<AvatarImage
								source={{
									uri: props.data.author_details.avatar_url,
								}}
							/>
							<AvatarFallback>
								<Text>
									{props.data.author_details.full_name
										.split(' ')
										.map((word) => word.charAt(0))
										.join('')
										.toUpperCase()}
								</Text>
							</AvatarFallback>
						</Avatar>
						<View>
							<Text className="text-sm font-semibold">
								{props.data.author_details.full_name}
							</Text>
							<Text className="text-xs text-gray-500">
								{format(props.data.published_at, 'yyyy-MM-dd')}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-end items-center gap-2">
						{/* <FontAwesome name="heart-o" size={16} color="black" /> */}
						<TouchableOpacity
							onPress={() =>
								props.toggleLike('blog:' + props.data.id)
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
		</View>
	);
}
