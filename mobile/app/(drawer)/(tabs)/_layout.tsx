import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { vs } from 'react-native-size-matters';
import HomeHeader from '~/components/shared/HomeHeader';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: Platform.select({
					android: {
						height: vs(50),
					},
					default: {},
				}),
				tabBarLabelStyle: {
					fontSize: 12,
				},
				header: () => <HomeHeader />,
				animation: 'shift',
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="news"
				options={{
					title: 'News',
					tabBarIcon: ({ color, size }) => (
						<FontAwesome
							name="newspaper-o"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="whois"
				options={{
					title: 'WhoIs',
					tabBarIcon: ({ color, size }) => (
						<Feather name="search" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="events"
				options={{
					title: 'Events',
					tabBarIcon: ({ color, size }) => (
						<Feather name="calendar" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<Feather name="user" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
