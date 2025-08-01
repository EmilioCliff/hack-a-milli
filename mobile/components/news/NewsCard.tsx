import { Image, Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { Card } from '../ui/card';
import { LinearGradient } from 'expo-linear-gradient';
import { NAV_THEME } from '~/constants/colors';
import { Badge } from '../ui/badge';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface newsCardProps {
	id: number;
	title: string;
	imageUrl: string;
	category: string;
	readTime: number;
	datePublished: string;
	excerpt: string;
	content: string;
	likesCount?: number;
}

export default function NewsCard(props: newsCardProps) {
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
					source={{ uri: props.imageUrl || '' }}
				/>
			</LinearGradient>
			<View className="p-2 flex-shrink flex-1">
				<View className="flex-row gap-2 mb-2">
					<Badge variant={'outline'}>
						<Text className="font-semibold">{props.category}</Text>
					</Badge>
					<Text className="text-gray-600">
						{props.readTime} min read
					</Text>
				</View>
				<Link
					href={{
						pathname: '/(drawer)/(tabs)/news/[id]',
						params: { id: props.id },
					}}
				>
					<Text className="text-lg font-bold">{props.title}</Text>
				</Link>
				<Text
					numberOfLines={3}
					ellipsizeMode="tail"
					className="text-gray-600 mb-4"
				>
					{props.excerpt}
				</Text>
				<View className="flex-row justify-between items-center">
					<Text className="text-gray-400">{props.datePublished}</Text>
					<View className="flex-row justify-end items-center gap-2">
						<FontAwesome name="heart-o" size={18} color="black" />
						<EvilIcons
							name="share-google"
							size={24}
							color="black"
						/>
					</View>
				</View>
			</View>
		</Card>
	);
}
