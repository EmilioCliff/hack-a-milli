import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { vs } from 'react-native-size-matters';
import { ThemeToggle } from '~/components/shared/ThemeToogle';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: Platform.select({
					android: {
						height: vs(50),
					},
					default: {},
				}),
				tabBarLabelStyle: {
					fontSize: 12,
				},
				headerRight: () => <ThemeToggle />,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
				}}
			/>
			<Tabs.Screen
				name="news"
				options={{
					title: 'News',
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
				}}
			/>
			<Tabs.Screen
				name="events"
				options={{
					title: 'Events',
				}}
			/>
			<Tabs.Screen
				name="whois"
				options={{
					title: 'WhoIs',
				}}
			/>
		</Tabs>
	);
}
