import { Image, Pressable, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { IMAGES } from '~/constants/images';
import { Text } from '~/components/ui/text';
import { EvilIcons, Feather } from '@expo/vector-icons';
import { NAV_THEME } from '~/constants/colors';
import { useNavigation, useRouter } from 'expo-router';
import { Button } from '../ui/button';
import { DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeHeader() {
	const nativagtion = useNavigation();
	const insets = useSafeAreaInsets();

	return (
		<LinearGradient
			colors={['#dc2626', '#b91c1c']}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 0 }}
			locations={[0, 1]}
			style={{
				paddingTop: insets.top,
				paddingBottom: 12,
			}}
		>
			<View className={`flex-row items-center justify-between px-4`}>
				<View className="flex-row items-center gap-2">
					<View className="bg-white/45 p-2 rounded-lg">
						<Image source={IMAGES.appLogo} />
					</View>
					<View>
						<Text className="font-extrabold text-lg text-white">
							KENIC
						</Text>
						<Text className="text-xs text-white">
							Kenya Network Information Center
						</Text>
					</View>
				</View>
				<Pressable
					onPress={() =>
						nativagtion.dispatch(DrawerActions.toggleDrawer())
					}
				>
					<Feather name="menu" size={s(18)} color={'white'} />
				</Pressable>
			</View>
		</LinearGradient>
	);
}
