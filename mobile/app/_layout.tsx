import '~/global.css';

import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
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
import { NotificationProvider } from '~/context/NotificationContext';
import { useEffect, useState } from 'react';
// import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as NavigationBar from 'expo-navigation-bar';
import { setUpAppOnFirstInstall } from '~/lib/firebaseNotifications';
import OnboardingScreen from '~/components/shared/OnBoardingScreen';
import { IS_ANDROID } from '~/constants/os';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IS_ONBOARDED } from '~/constants/app';
import KenicSplash from '~/components/shared/SplashScreen';
import LoginModal from '~/components/shared/LoginModal';

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldSetBadge: false,
		shouldPlaySound: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
	const [isAppReady, setAppReady] = useState(false);
	const [isFirstInstall, setIsFirstInstall] = useState(false);

	useEffect(() => {
		if (IS_ANDROID) NavigationBar.setVisibilityAsync('hidden');
		async function prepareApp() {
			try {
				const onboarded = await AsyncStorage.getItem(IS_ONBOARDED);
				if (!onboarded) {
					setIsFirstInstall(true);
				}

				// get home data first
			} catch (e) {
				console.warn('App init error', e);
			}
		}
		prepareApp();
	}, []);

	if (isFirstInstall) {
		return (
			<OnboardingScreen
				onDone={async () => {
					setIsFirstInstall(false);
					setUpAppOnFirstInstall();
					await AsyncStorage.setItem(IS_ONBOARDED, 'true');
				}}
			/>
		);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<I18nextProvider i18n={i18n}>
						<NotificationProvider>
							<ThemeProvider value={LIGHT_THEME}>
								<StatusBar style="dark" />
								{!isAppReady ? (
									<KenicSplash
										onFinish={() => setAppReady(true)}
									/>
								) : (
									<Stack
										screenOptions={{ headerShown: false }}
									>
										<Stack.Screen name="(drawer)" />

										<Stack.Screen name="(auth)" />

										<Stack.Screen name="+not-found" />
									</Stack>
								)}
								<LoginModal />
								<PortalHost />
							</ThemeProvider>
							<FlashMessage position="bottom" />
						</NotificationProvider>
					</I18nextProvider>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	);
}
