import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { router } from 'expo-router';
import {
	getMessaging,
	getInitialNotification,
	onNotificationOpenedApp,
	setBackgroundMessageHandler,
	onMessage,
	FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

const messaging = getMessaging();

interface NotificationContextType {
	notification: FirebaseMessagingTypes.RemoteMessage | null;
	error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			'useNotification must be used within a NotificationProvider',
		);
	}
	return context;
};

interface NotificationProviderProps {
	children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
	children,
}) => {
	const [notification, setNotification] =
		useState<FirebaseMessagingTypes.RemoteMessage | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		// app opened from quit state
		getInitialNotification(messaging).then((remoteMessage) => {
			if (remoteMessage) {
				console.log('Initial notification:', remoteMessage);
				handleNotificationNavigation(remoteMessage);
				setNotification(remoteMessage);
			}
		});

		// foreground
		const unsubscribeOnMessage = onMessage(messaging, (remoteMessage) => {
			console.log('onMessage:', remoteMessage);
		});

		// app opened from background
		const unsubscribeOnOpen = onNotificationOpenedApp(
			messaging,
			(remoteMessage) => {
				if (remoteMessage) {
					console.log('onNotificationOpenedApp:', remoteMessage);
					handleNotificationNavigation(remoteMessage);
					setNotification(remoteMessage);
				}
			},
		);

		// background message handler
		setBackgroundMessageHandler(messaging, async (remoteMessage) => {
			console.log('Background message:', remoteMessage);
		});

		return () => {
			unsubscribeOnMessage();
			unsubscribeOnOpen();
		};
	}, []);

	return (
		<NotificationContext.Provider value={{ notification, error }}>
			{children}
		</NotificationContext.Provider>
	);
};

const handleNotificationNavigation = (
	remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
	const type = remoteMessage?.data?.type;

	switch (type) {
		case 'event':
			if (remoteMessage.data?.eventId) {
				router.replace({
					pathname: '/(drawer)/(tabs)/events/[id]',
					params: { id: String(remoteMessage.data.eventId) },
				});
			}
			break;
		case 'news':
			if (remoteMessage.data?.newsId) {
				router.replace({
					pathname: '/(drawer)/(tabs)/news/[id]',
					params: { id: String(remoteMessage.data.newsId) },
				});
			}
			break;
		default:
			break;
	}
};
