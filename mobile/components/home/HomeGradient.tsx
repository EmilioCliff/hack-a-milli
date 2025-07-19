import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeGradient({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<LinearGradient
			// className="pt-20 -mt-20"
			// style={style.background}

			// colors={['#ff0000', '#00ff00']}
			// start={{ x: 0.5, y: 0 }}
			// end={{ x: 0.5, y: 1 }}

			// colors={['#ff0000', '#00ff00']}
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
			colors={['#ff0000', '#00ff00']}
			locations={[0.55, 1]}
			// start={{ x: 1, y: 1 }}
			// end={{ x: 0, y: 0 }}

			// colors={['#dc2626', '#b91c1c']}
			// locations={[0.5, 0.8]}
			// start={{ x: 0.7, y: 0.9 }}
		>
			<View className="flex flex-row items-center justify-between pb-2 px-4">
				{children}
			</View>
		</LinearGradient>
	);
}

const style = StyleSheet.create({
	background: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		// height: 20,
	},
	button: {
		padding: 15,
		alignItems: 'center',
		borderRadius: 5,
	},
});
