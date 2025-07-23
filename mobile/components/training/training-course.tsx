import { View } from 'react-native';
import { Card, CardContent } from '../ui/card';
import { Text } from '../ui/text';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AntDesign, Feather } from '@expo/vector-icons';
import { NAV_THEME } from '~/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface trainingCoursePage {
	id: number;
	title: string;
	duration: string;
	level: string;
	price: string;
	students: number;
	rating: number;
	description: string;
}

export default function TrainingCourse({
	id,
	title,
	duration,
	level,
	price,
	students,
	rating,
	description,
}: trainingCoursePage) {
	return (
		<Card className="mt-6">
			<CardContent className="p-6">
				<View className="flex-row flex-wrap gap-1 items-start justify-between mb-4">
					<View className="flex-shrink flex-1">
						<Text className="font-bold text-xl text-gray-900 mb-2">
							{title}
						</Text>
						<Text className="text-gray-600 text-base mb-3">
							{description}
						</Text>

						<View className="flex-row items-center justify-between text-sm text-gray-600">
							<View className="flex items-center space-x-1">
								<Feather
									name="book-open"
									size={18}
									color="black"
								/>
								<Text>{duration}</Text>
							</View>
							<View className="flex items-center space-x-1">
								<Feather name="users" size={18} color="black" />
								<Text>{students} students</Text>
							</View>
							<View className="flex items-center space-x-1">
								<AntDesign
									name="star"
									size={18}
									color="#facc15"
								/>
								<Text>{rating}</Text>
							</View>
						</View>
					</View>

					<View className="text-right">
						<Badge
							className={`mb-2 ${
								level === 'Beginner'
									? 'bg-green-100'
									: level === 'Intermediate'
										? 'bg-yellow-100'
										: 'bg-red-100'
							}`}
						>
							<Text
								className={`font-bold ${
									level === 'Beginner'
										? ' text-green-800'
										: level === 'Intermediate'
											? ' text-yellow-800'
											: ' text-red-800'
								}`}
							>
								{level}
							</Text>
						</Badge>
						<Text className="text-lg text-right font-bold text-green-600">
							{price}
						</Text>
					</View>
				</View>

				<LinearGradient
					colors={[
						NAV_THEME.kenyaFlag.red.front,
						NAV_THEME.kenyaFlag.green.mid,
					]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					locations={[0, 1]}
				>
					<Button className="flex-row bg-transparent gap-6 items-center">
						<Feather name="play" size={20} color="white" />
						<Text className="font-bold">
							{price === 'Free' ? 'Start Learning' : 'Enroll Now'}
						</Text>
					</Button>
				</LinearGradient>
			</CardContent>
		</Card>
	);
}
