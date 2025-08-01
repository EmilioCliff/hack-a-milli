import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { Link, router } from 'expo-router';

interface relatedBlogCardProps {
	id: number;
	title: string;
	readTime: number;
	datePublished: string;
	excerpt: string;
}

export default function RelatedBlogCard(props: relatedBlogCardProps) {
	return (
		<Link
			href={{
				pathname: '/(drawer)/(tabs)/news/[id]',
				params: { id: props.id },
			}}
			asChild
		>
			<Pressable className="border-t-2 border-gray-100 py-4 mt-2 px-4">
				<Text className="text-lg font-bold">{props.title}</Text>
				<Text
					numberOfLines={3}
					ellipsizeMode="tail"
					className="text-gray-600 my-2"
				>
					{props.excerpt}
				</Text>

				<Text className="text-gray-600">
					{props.datePublished} · {props.readTime} min read
				</Text>
			</Pressable>
		</Link>
	);
}
