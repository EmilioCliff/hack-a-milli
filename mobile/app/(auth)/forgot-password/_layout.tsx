import { Entypo } from '@expo/vector-icons';
import { RelativePathString, router, Stack } from 'expo-router';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function AuthLayout() {
	return (
		<View className="flex-1">
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen
					name="reset-password"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</View>
	);
}

const backToHome = (url: RelativePathString) => {
	return (
		<Button
			onPress={() => router.navigate(url)}
			className="ml-2 bg-gray-100 flex-row gap-2 items-center"
			style={{
				paddingTop: 0,
				paddingBottom: 0,
				paddingStart: 0,
				paddingEnd: 0,
			}}
		>
			<Entypo name="chevron-left" size={16} color="black" />
			<Text style={{ fontSize: 14 }} className="font-bold text-black">
				Back to Home
			</Text>
		</Button>
	);
};
