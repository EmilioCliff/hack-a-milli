import React from 'react';
import { useRouter } from 'expo-router';
import { Button } from '~/components/ui/button';
import AppSafeView from '~/components/shared/AppSafeView';
import { Text } from '~/components/ui/text';

export default function index() {
	const router = useRouter();
	return (
		<AppSafeView>
			<Text>index</Text>
			<Button onPress={() => router.push('/(drawer)/blog/blog')}>
				<Text> Go to Blog</Text>
			</Button>
		</AppSafeView>
	);
}
