import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { CheckCircle } from 'lucide-react-native'; // Optional success icon
import { router, useLocalSearchParams } from 'expo-router';

export default function OrderSuccessScreen() {
	const { trackingId, total } = useLocalSearchParams();

	return (
		<View className="flex-1 justify-center bg-white px-6">
			<View className="mx-auto">
				<CheckCircle size={64} color="#16a34a" className="mb-6" />
			</View>

			<Text className="text-2xl font-semibold text-center text-green-600 mb-2">
				Order Placed Successfully!
			</Text>

			<Text className="text-base text-gray-600 text-center mb-8">
				Thank you for your purchase. Your order has been confirmed and
				will be processed shortly.
			</Text>

			<Text className="text-2xl font-bold text-center mt-4 mb-2">
				Order Details
			</Text>
			<View className="flex-row justify-between">
				<Text className="text-lg">Order Number: </Text>
				<Text className="text-lg font-bold">{trackingId}</Text>
			</View>
			<View className="flex-row justify-between">
				<Text className="text-lg">Total Amount: </Text>
				<Text className="text-lg font-bold">KES {total}</Text>
			</View>
			<View className="flex-row justify-between">
				<Text className="text-lg">Estimated Delivery: </Text>
				<Text className="text-lg font-bold">3-5 Business Days</Text>
			</View>

			<View className="mt-8 flex-row justify-center gap-4">
				<Button
					className="bg-secondary px-6 py-3 rounded-xl "
					onPress={() => router.push('/(drawer)/merchandise')}
				>
					<Text className="text-white font-medium text-base">
						Continue Shopping
					</Text>
				</Button>
				<Button
					className="bg-primary px-6 py-3 rounded-xl "
					onPress={() => router.push('/(drawer)/merchandise')}
				>
					<Text className="text-white font-medium text-base">
						Track Order
					</Text>
				</Button>
			</View>
		</View>
	);
}
