import '~/global.css';

import {
	DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PortalHost } from '@rn-primitives/portal';
import { NAV_THEME } from '~/constants/colors';

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
	return (
		<ThemeProvider value={LIGHT_THEME}>
			<StatusBar style="dark" />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(drawer)" />
				<Stack.Screen name="(auth)" />
				<Stack.Screen name="+not-found" />
			</Stack>
			<PortalHost />
		</ThemeProvider>
	);
}
