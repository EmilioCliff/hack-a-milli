import { Image, View } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { IMAGES } from '~/constants/images';
import { Text } from '~/components/ui/text';
import { EvilIcons, Feather } from '@expo/vector-icons';
import { NAV_THEME } from '~/constants/colors';

export default function HomeHeader() {
	return (
		<View
			className="flex flex-row items-center justify-between pt-20 -mt-20 pb-4 px-4 text-white"
			style={{ backgroundColor: NAV_THEME.light.primary }}
		>
			<View className="flex flex-row items-center gap-2">
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
			<View className="flex flex-row gap-4 items-center">
				<EvilIcons name="bell" size={s(20)} color={'white'} />
				<Feather name="menu" size={s(18)} color={'white'} />
			</View>
		</View>
	);
}
// D12323;
