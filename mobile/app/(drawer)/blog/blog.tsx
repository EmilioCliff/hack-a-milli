import { View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import AppSafeView from '~/components/shared/AppSafeView';

export default function Blog() {
	const router = useRouter();
	return (
		<AppSafeView>
			<Text>Blog</Text>
			<Button onPress={() => router.push('/(drawer)/blog')}>
				<Text>Go Back to Index</Text>
			</Button>
		</AppSafeView>
	);
}
