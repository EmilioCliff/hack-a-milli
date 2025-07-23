import { View } from 'react-native';
import React, { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { NAV_THEME } from '~/constants/colors';
import { Text } from '../ui/text';

interface modalToLogoProps {
	title: string;
	subtitle: string;
	icon: ReactNode;
}

export default function ModalToLogo({
	title,
	subtitle,
	icon,
}: modalToLogoProps) {
	return (
		<View className="mt-1">
			<LinearGradient
				colors={[
					NAV_THEME.kenyaFlag.red.front,
					NAV_THEME.kenyaFlag.green.mid,
				]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				locations={[0, 1]}
				style={{
					padding: 16,
					borderRadius: 16,
					width: 64,
					height: 64,
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: 16,
					marginHorizontal: 'auto',
				}}
			>
				{icon}
			</LinearGradient>
			<Text className="text-center text-2xl font-bold text-gray-900 mb-2">
				{title}
			</Text>
			<Text className="text-center text-gray-600">{subtitle}</Text>
		</View>
	);
}
