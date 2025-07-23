import { FontAwesome } from '@expo/vector-icons';
import { FlatList, View } from 'react-native';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import TrainingCourse from '~/components/training/training-course';

const data = [
	{
		id: 1,
		title: 'Domain Management Fundamentals',
		duration: '4 hours',
		level: 'Beginner',
		price: 'Free',
		students: 1250,
		rating: 4.8,
		description:
			'Learn the basics of domain registration, DNS, and domain management.',
	},
	{
		id: 2,
		title: 'Advanced DNS Configuration',
		duration: '6 hours',
		level: 'Advanced',
		price: 'KES 5,000',
		students: 450,
		rating: 4.9,
		description:
			'Master DNS records, security configurations, and troubleshooting.',
	},
	{
		id: 3,
		title: 'Web Security Best Practices',
		duration: '8 hours',
		level: 'Intermediate',
		price: 'KES 7,500',
		students: 680,
		rating: 4.7,
		description: 'Comprehensive guide to securing websites and domains.',
	},
];

export default function TrainingsPage() {
	return (
		<AppSafeView>
			<View className="flex-1 px-4">
				<FlatList
					data={data}
					keyExtractor={(item) => item.id.toString()}
					ListHeaderComponent={() => (
						<ModalToLogo
							title="Training Programs"
							subtitle="Enhance your skills in domain management and web technologies"
							icon={
								<FontAwesome
									name="graduation-cap"
									size={32}
									color="white"
								/>
							}
						/>
					)}
					renderItem={({ item, index }) => (
						<TrainingCourse
							id={item.id}
							title={item.title}
							duration={item.duration}
							level={item.level}
							price={item.price}
							students={item.students}
							rating={item.rating}
							description={item.description}
						/>
					)}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</AppSafeView>
	);
}
