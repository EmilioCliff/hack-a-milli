import { TextInput, View } from 'react-native';
import { Card, CardHeader } from '../ui/card';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Button } from '../ui/button';
import { NAV_THEME } from '~/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../ui/text';

const SubscriptionCard = () => {
	return (
		<Card className="overflow-hidden mt-16">
			<CardHeader className="bg-green-50">
				<View className="flex-row gap-2 items-center">
					<EvilIcons name="bell" size={24} color="#6b7280" />
					<Text className="text-green-800 text-xl font-semibold">
						Subscribe to Our NewsLetter
					</Text>
				</View>
			</CardHeader>
			<View className="p-4">
				<Text className="text-lg font-bold mb-2">Email Address</Text>
				<TextInput
					placeholder="Enter your email address"
					value={''}
					className="border border-gray-300 rounded-md px-4 py-2 mb-6"
				/>
				<Text className="text-lg font-bold mb-2">
					Full Name (Optional)
				</Text>
				<TextInput
					placeholder="Enter your full name"
					value={''}
					className="border border-gray-300 rounded-md px-4 py-2 mb-6"
				/>
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
						<FontAwesome
							name="envelope-o"
							size={18}
							color="white"
						/>
						<Text className="text-white font-bold">
							Subscribe Now
						</Text>
					</Button>
				</LinearGradient>
			</View>
		</Card>
	);
};

export default SubscriptionCard;
