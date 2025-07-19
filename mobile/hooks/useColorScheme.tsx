import { useColorScheme as useNativewindColorScheme } from 'nativewind';

export function useColorScheme() {
	const { colorScheme, setColorScheme, toggleColorScheme } =
		useNativewindColorScheme();
	return {
		colorScheme: 'light', // defaults to light
		isDarkColorScheme: colorScheme === 'dark',
		setColorScheme,
		toggleColorScheme,
	};
}
