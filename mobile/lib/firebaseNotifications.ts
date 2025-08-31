import messaging from '@react-native-firebase/messaging';
import * as SecureStore from 'expo-secure-store';
import { SUBSCRIPTION_TOPICS } from '~/constants/app';

export const setUpAppOnFirstInstall = async () => {
	const status = await requestUserPermission();
	if (status) {
		console.log('accepted');
		const fcmToken = await getFcmToken();
		if (fcmToken) {
			await SecureStore.setItemAsync('fcm_token', fcmToken);
		}
		SUBSCRIPTION_TOPICS.map((topic, _) => {
			subscribeTopic(topic);
		});
	}
};

// Request user permission for notifications
export const requestUserPermission = async () => {
	const authStatus = await messaging().requestPermission();
	const enabled =
		authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		authStatus === messaging.AuthorizationStatus.PROVISIONAL;
	console.log(`Authorization status: ${authStatus}`);
	return enabled;
};

export const getFcmToken = async () => {
	const fmcToken = await messaging()
		.getToken()
		.then((token) => {
			console.log(token);
			return token;
		})
		.catch((e) => {
			console.log(e);
			return '';
		});

	return fmcToken;
};

// Subscribe to a topic
export const subscribeTopic = async (topic: string) => {
	console.log('subscribing to topic', topic);

	await messaging()
		.subscribeToTopic(topic)
		.then(() => console.log('Subscribed to topic:', topic))
		.catch((e) => {
			console.log(e);
		});
};

// Unsubscribe from a topic
export const unsubscribeTopic = async (topic: string) => {
	await messaging()
		.unsubscribeFromTopic(topic)
		.then(() => console.log('Unsubscribed from topic:', topic))
		.catch((e) => {
			console.log(e);
		});
};
