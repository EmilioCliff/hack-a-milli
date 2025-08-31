import { Entypo } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function AuthLayout() {
	return (
		<View className="flex-1">
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="signin"
					options={{
						headerShown: true,
						title: '',
						headerShadowVisible: false,
						headerStyle: { backgroundColor: '#f3f4f6' },
						headerLeft: () => (
							<Button
								onPress={() => {
									if (router.canGoBack()) {
										router.back();
									} else {
										router.replace('/(drawer)/(tabs)');
									}
								}}
								className="ml-2 bg-gray-100 flex-row gap-2 items-center"
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
									Go Back
								</Text>
							</Button>
						),
					}}
				/>
				<Stack.Screen name="signup" />
				<Stack.Screen
					name="forgot-password"
					options={{
						headerShown: true,
						title: '',
						headerShadowVisible: false,
						headerStyle: { backgroundColor: '#f3f4f6' },
						headerLeft: () => (
							<Button
								onPress={() => router.back()}
								className="ml-2 bg-gray-100 flex-row gap-2 items-center"
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
									Back To Login
								</Text>
							</Button>
						),
					}}
				/>
			</Stack>
		</View>
	);
}
