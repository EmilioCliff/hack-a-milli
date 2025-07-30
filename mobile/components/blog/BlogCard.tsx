import { Image, View } from 'react-native';
import { Badge } from '../ui/badge';
import { Text } from '../ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NAV_THEME } from '~/constants/colors';
import { Link } from 'expo-router';

interface Publisher {
	name: string;
	profileUrl: string;
}

interface blogCardProps {
	id: number;
	coverImg: string;
	category: string;
	title: string;
	description: string;
	featured: boolean;
	readTime: number;
	datePublished: string;
	publisher: Publisher;
}

export default function BlogCard(props: blogCardProps) {
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
					source={{ uri: props.coverImg }}
				/>
			</LinearGradient>
			<View className="px-4">
				<View className="flex-row justify-between items-center mb-2">
					<Badge
						className={`${props.featured ? 'bg-black' : ''}`}
						variant={props.featured ? 'default' : 'outline'}
					>
						<Text className="font-bold">{props.category}</Text>
					</Badge>
					<Text>{props.readTime} min read</Text>
				</View>
				<Link
					href={{
						pathname: '/(drawer)/blog/[id]',
						params: { id: props.id },
					}}
				>
					<Text className="text-lg font-bold">{props.title}</Text>
				</Link>
				<Text
					numberOfLines={3}
					ellipsizeMode="tail"
					className="my-2 text-gray-600"
				>
					{props.description}
				</Text>
				<View className="flex-row justify-between items-center mb-4">
					<View className="flex-row justify-start items-center gap-2">
						<Avatar alt="Publisher Avatar">
							<AvatarImage
								source={{ uri: props.publisher.profileUrl }}
							/>
							<AvatarFallback>
								<Text>
									{props.publisher.name
										.split(' ')
										.map((word) => word.charAt(0))
										.join('')
										.toUpperCase()}
								</Text>
							</AvatarFallback>
						</Avatar>
						<View>
							<Text className="text-sm font-semibold">
								{props.publisher.name}
							</Text>
							<Text className="text-xs text-gray-500">
								{props.datePublished}
							</Text>
						</View>
					</View>
					<View className="flex-row justify-end items-center gap-2">
						<FontAwesome name="heart-o" size={16} color="black" />
						<EvilIcons
							name="share-google"
							size={24}
							color="black"
						/>
					</View>
				</View>
			</View>
		</View>
	);
}
