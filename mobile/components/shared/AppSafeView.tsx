import React from 'react';
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { IS_ANDROID } from '~/constants/os';

interface AppSafeViewProps {
	children: React.ReactNode;
	style?: ViewStyle;
}

export default function AppSafeView({
	children,
	style = {},
}: AppSafeViewProps) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={[styles.container, style]}>{children}</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		paddingTop: IS_ANDROID ? StatusBar.currentHeight || 0 : 0,
		backgroundColor: '#f3f4f6',
	},
	container: {
		flex: 1,
	},
});
