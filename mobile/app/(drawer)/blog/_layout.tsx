import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function _layout() {
	return (
		<Stack>
			<Stack.Screen name="index" />
			<Stack.Screen name="blog" />
		</Stack>
	);
}
