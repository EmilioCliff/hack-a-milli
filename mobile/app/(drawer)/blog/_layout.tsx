import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { Button } from '~/components/ui/button';

export default function _layout() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerShown: true,
					title: '',
					headerShadowVisible: false,
					headerLeft: () => (
						<Button
							onPress={() => router.navigate('/(drawer)/(tabs)')}
							className="ml-2 bg-white flex-row gap-2 items-center"
							style={{
								paddingTop: 0,
								paddingBottom: 0,
								paddingStart: 0,
								paddingEnd: 0,
							}}
						>
							<Entypo
								name="chevron-left"
								size={16}
								color="black"
							/>
							<Text
								style={{ fontSize: 14 }}
								className="font-bold text-black"
							>
								Back to Home
							</Text>
						</Button>
					),
				}}
			/>
			<Stack.Screen
				name="blog"
				options={{
					headerShown: true,
					title: '',
					headerShadowVisible: false,
					headerLeft: () => (
						<Button
							onPress={() => router.back()}
							className="ml-2 bg-white flex-row gap-2 items-center"
							style={{
								paddingTop: 0,
								paddingBottom: 0,
								paddingStart: 0,
								paddingEnd: 0,
							}}
						>
							<Entypo
								name="chevron-left"
								size={16}
								color="black"
							/>
							<Text
								style={{ fontSize: 14 }}
								className="font-bold text-black"
							>
								Back to Blogs
							</Text>
						</Button>
					),
				}}
			/>
		</Stack>
	);
}
