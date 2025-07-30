import {
	Feather,
	Ionicons,
	FontAwesome,
	FontAwesome5,
	Entypo,
	AntDesign,
} from '@expo/vector-icons';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { RelativePathString, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { NAV_THEME } from '~/constants/colors';

const CustomeDrawerContent = (props: DrawerContentComponentProps) => {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	return (
		<DrawerContentScrollView
			style={{ borderRadius: 0 }}
			contentContainerStyle={{
				paddingTop: 0,
				paddingStart: 0,
				paddingEnd: 0,
				margin: 0,
				height: '100%',
			}}
			{...props}
		>
			<LinearGradient
				colors={[
					NAV_THEME.kenyaFlag.red.front,
					NAV_THEME.kenyaFlag.black.back,
					NAV_THEME.kenyaFlag.green.back,
				]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				locations={[0, 0.6, 1]}
				style={[
					styles.backgroundGradient,
					{ paddingTop: 12 + insets.top },
				]}
			>
				<Text className="text-2xl font-extrabold text-white">
					KENIC Services
				</Text>
				<Text className="text-white text-md">Explore all features</Text>
			</LinearGradient>
			<DrawerItem
				icon={() => (
					<Ionicons name="people-sharp" size={24} color="black" />
				)}
				label={'Careers'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/careers')}
			/>
			<DrawerItem
				icon={() => (
					<FontAwesome
						name="graduation-cap"
						size={24}
						color="black"
					/>
				)}
				label={'Training Programs'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/trainings')}
			/>
			<DrawerItem
				icon={() => (
					<Entypo name="shopping-bag" size={24} color="black" />
				)}
				label={'Merchandise'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/merchandise')}
			/>
			<DrawerItem
				icon={() => (
					<Ionicons
						name="chatbubble-ellipses"
						size={24}
						color="black"
					/>
				)}
				label={'Chatbot Support'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/chatbot')}
			/>
			<DrawerItem
				icon={() => (
					<FontAwesome name="envelope" size={24} color="black" />
				)}
				label={'Newsletter'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/newsletter')}
			/>
			<DrawerItem
				icon={() => (
					<FontAwesome5 name="book-reader" size={24} color="black" />
				)}
				label={'Blogs'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/blog')}
			/>
			<DrawerItem
				icon={() => (
					<FontAwesome5 name="globe-africa" size={24} color="black" />
				)}
				label={'.ke Domain Products'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/domain-products')}
			/>
			<DrawerItem
				icon={() => (
					<FontAwesome name="building" size={24} color="black" />
				)}
				label={'All Registrars'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/registrars')}
			/>

			<View className="mx-4 rounded-full opacity-40 my-4  h-1 bg-slate-600" />

			<DrawerItem
				icon={() => (
					<Ionicons name="settings" size={24} color="black" />
				)}
				label={'Settings'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/settings')}
			/>
			<DrawerItem
				icon={() => (
					<FontAwesome name="phone" size={24} color="black" />
				)}
				label={'Contact Support'}
				labelStyle={styles.label}
				style={styles.item}
				onPress={() => router.push('/(drawer)/contact')}
			/>
			<View className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-gray-50">
				<Text className="text-sm text-gray-600 text-center">
					Kenya Network Information Centre
				</Text>
				<Text className="text-xs text-gray-500 text-center mt-1">
					Managing .KE domains since 1999
				</Text>
			</View>
		</DrawerContentScrollView>
	);
};

export default function DrawerLayout() {
	const router = useRouter();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				drawerContent={(props) => <CustomeDrawerContent {...props} />}
				screenOptions={{
					headerShown: false,
					drawerType: 'front',
					drawerHideStatusBarOnOpen: true,
				}}
			>
				<Drawer.Screen
					name="contact"
					options={{
						headerShown: true,
						title: '',
						headerShadowVisible: false,
						headerLeft: () =>
							backToHome(
								'/(drawer)/(tabs)' as RelativePathString,
							),
					}}
				/>
				<Drawer.Screen
					name="registrars"
					options={{
						headerShown: true,
						title: '',
						headerShadowVisible: false,
						headerLeft: () =>
							backToHome(
								'/(drawer)/(tabs)' as RelativePathString,
							),
					}}
				/>
				<Drawer.Screen
					name="blog"
					options={{
						headerShown: false,
						title: '',
						headerShadowVisible: false,
					}}
				/>
				<Drawer.Screen
					name="domain-products"
					options={{
						headerShown: true,
						title: '',
						headerShadowVisible: false,
						headerLeft: () =>
							backToHome(
								'/(drawer)/(tabs)' as RelativePathString,
							),
					}}
				/>
				<Drawer.Screen
					name="careers"
					options={{
						headerShown: true,
						title: '',
						headerShadowVisible: false,
						headerLeft: () =>
							backToHome(
								'/(drawer)/(tabs)' as RelativePathString,
							),
					}}
				/>
				<Drawer.Screen
					name="trainings"
					options={{
						headerShown: true,
						title: '',
						headerShadowVisible: false,
						headerLeft: () =>
							backToHome(
								'/(drawer)/(tabs)' as RelativePathString,
							),
					}}
				/>
				<Drawer.Screen
					name="merchandise"
					options={{
						headerShown: false,
						title: '',
						headerShadowVisible: false,
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
}

const backToHome = (url: RelativePathString) => {
	const router = useRouter();

	return (
		<Button
			onPress={() => router.navigate(url)}
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
				Back to Home
			</Text>
		</Button>
	);
};

const styles = StyleSheet.create({
	backgroundGradient: {
		width: '100%',
		height: 'auto',
		borderTopRightRadius: 15,
		borderTopLeftRadius: 15,
		paddingStart: 16,
		paddingBottom: 16,
	},
	item: {
		paddingVertical: 0,
		margin: 0,
	},
	label: {
		fontSize: 16,
		fontWeight: 800,
	},
});
