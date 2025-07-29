import { View, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Text } from '~/components/ui/text';

export default function OrderPage() {
	return (
		<View>
			<Text>OrderPage</Text>
			<Link
				href={{
					pathname: '/(drawer)/orders/[id]',
					params: { id: 1 },
				}}
			>
				<Pressable>
					<Text>Order: 1</Text>
				</Pressable>
			</Link>
		</View>
	);
}
