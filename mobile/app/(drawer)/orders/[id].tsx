import { View } from 'react-native';
import React from 'react';
import { Text } from '~/components/ui/text';
import { useLocalSearchParams } from 'expo-router';

export default function OrderItem() {
	const { id } = useLocalSearchParams();
	return (
		<View>
			<Text>OrderItem: {id}</Text>
		</View>
	);
}
