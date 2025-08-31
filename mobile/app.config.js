export default ({ config }) => ({
	expo: {
		name: 'mobile',
		slug: 'mobile',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'mobile',
		userInterfaceStyle: 'light',
		newArchEnabled: true,
		androidNavigationBar: {
			visible: 'immersive',
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: 'com.emiliocliff.kenic.hackamilli',
			googleServicesFile: './GoogleService-Info.plist',
			infoPlist: {
				ITSAppUsesNonExemptEncryption: false,
			},
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			package: 'com.emiliocliff.kenic.hackamilli',
			edgeToEdgeEnabled: true,
			googleServicesFile:
				process.env.GOOGLE_SERVICES_JSON || './google-services.json',
		},
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/images/favicon.png',
		},
		plugins: [
			'expo-router',
			'@react-native-firebase/app',
			[
				'expo-splash-screen',
				{
					image: './assets/images/splash-icon.png',
					imageWidth: 200,
					resizeMode: 'contain',
					backgroundColor: '#ffffff',
				},
			],
			'expo-secure-store',
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			router: {},
			eas: {
				projectId: '8707e9e6-c7d1-4567-b8d6-45d6f4b09ce7',
			},
		},
		owner: 'emiliocliff',
	},
});
