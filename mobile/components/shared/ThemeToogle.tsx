import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar } from '~/icons/MoonStar';
import { Sun } from '~/icons/Sun';
import { useColorScheme } from '~/hooks/useColorScheme';

export function ThemeToggle() {
	const { isDarkColorScheme, setColorScheme } = useColorScheme();

	function toggleColorScheme() {
		const newTheme = isDarkColorScheme ? 'light' : 'dark';
		setColorScheme(newTheme);
		setAndroidNavigationBar(newTheme);
	}

	return (
		<Pressable onPress={toggleColorScheme} className="active:opacity-70">
			<View className="flex-1 aspect-square pt-0.5 justify-center items-start web:px-5">
				{isDarkColorScheme ? (
					<MoonStar
						className="text-foreground bg-black"
						size={23}
						strokeWidth={1.25}
					/>
				) : (
					<Sun
						className="text-foreground bg-black"
						size={24}
						strokeWidth={1.25}
					/>
				)}
			</View>
		</Pressable>
	);
}
