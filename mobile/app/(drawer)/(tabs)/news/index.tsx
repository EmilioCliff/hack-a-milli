import { FlatList, Image } from 'react-native';
import { View } from 'react-native';
import NewsCard from '~/components/news/NewsCard';
import { Text } from '~/components/ui/text';

const data = [
	{
		id: 1,
		title: '.KE Domain Pricing Revised for 2025',
		imageUrl: 'https://picsum.photos/200/120',
		category: 'Policy Update',
		readTime: 3,
		datePublished: '2025-07-28',
		excerpt:
			'KENIC announces new pricing structure for .KE domains, aiming to enhance accessibility and competitiveness in the local market.',
		content: 'Full article content here...',
		likesCount: 27,
	},
	{
		id: 2,
		title: 'New Cybersecurity Protocols for Domain Registrars',
		imageUrl: 'https://picsum.photos/200/120',
		category: 'Security',
		readTime: 4,
		datePublished: '2025-07-26',
		excerpt:
			'Domain registrars will be required to implement stronger security protocols to protect registrant data under the new KENIC guidelines.',
		content: 'Full article content here...',
		likesCount: 34,
	},
	{
		id: 3,
		title: 'KENIC Launches Youth Awareness Campaign',
		imageUrl: 'https://picsum.photos/200/120',
		category: 'Community',
		readTime: 2,
		datePublished: '2025-07-20',
		excerpt:
			'A new digital literacy initiative by KENIC targets young Kenyans to raise awareness on the importance of .KE domains in digital identity.',
		content: 'Full article content here...',
		likesCount: 12,
	},
	{
		id: 4,
		title: '.KE Registry Upgraded to Improve Reliability',
		imageUrl: 'https://picsum.photos/200/120',
		category: 'Tech Update',
		readTime: 5,
		datePublished: '2025-07-18',
		excerpt:
			'The .KE registry infrastructure has been upgraded to boost performance, reduce downtime, and support higher domain traffic.',
		content: 'Full article content here...',
		likesCount: 19,
	},
];

export default function index() {
	return (
		<View className="px-4">
			<FlatList
				data={data}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={() => (
					<Text className="text-3xl font-extrabold my-4">
						Latest News
					</Text>
				)}
				renderItem={({ item, index }) => <NewsCard {...item} />}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
