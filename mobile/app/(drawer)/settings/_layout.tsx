import { Entypo } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function SettingsLayout() {
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
				name="[id]"
				options={{
					headerShown: true,
					title: '',
					headerShadowVisible: false,
					headerLeft: () => backButton(),
				}}
			/>
			<Stack.Screen
				name="password"
				options={{
					headerShown: true,
					title: '',
					headerShadowVisible: false,
					headerLeft: () => backButton(),
				}}
			/>
		</Stack>
	);
}

const backButton = () => {
	return (
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
			<Entypo name="chevron-left" size={16} color="black" />
			<Text style={{ fontSize: 14 }} className="font-bold text-black">
				Back to Settings
			</Text>
		</Button>
	);
};
