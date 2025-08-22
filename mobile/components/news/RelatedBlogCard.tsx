import { Pressable } from 'react-native';
import { Text } from '../ui/text';
import { Link } from 'expo-router';
import { NewsUpdate } from '~/lib/types';
import ExpandableHtml from '../events/ExpandableHtml';
import { format } from 'date-fns';

export default function RelatedBlogCard(props: NewsUpdate) {
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
					{format(props.date, 'yyyy-MM-dd')} · {props.min_read} min
					read
				</Text>
			</Pressable>
		</Link>
	);
}
