import '~/global.css';

import {
	DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PortalHost } from '~/components/primitives/portal';
import { NAV_THEME } from '~/constants/colors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import store, { persistor } from '~/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/localization/i18n';

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

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<I18nextProvider i18n={i18n}>
						<ThemeProvider value={LIGHT_THEME}>
							<StatusBar style="dark" />
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name="(drawer)" />
								<Stack.Screen name="(auth)" />
								<Stack.Screen name="+not-found" />
							</Stack>
							<PortalHost />
						</ThemeProvider>
						<FlashMessage position="bottom" />
					</I18nextProvider>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	);
}
