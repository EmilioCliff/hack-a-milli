import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 60;
const STROKE_WIDTH = 4;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function KeNICSpinner() {
	const spin = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.loop(
			Animated.timing(spin, {
				toValue: 1,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		).start();
	}, [spin]);

	const spinInterpolate = spin.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	return (
		<View style={styles.center}>
			<Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
				<Svg width={SIZE} height={SIZE}>
					<Circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						r={RADIUS}
						stroke="#ccc"
						strokeWidth={STROKE_WIDTH}
						fill="none"
					/>
					<Circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						r={RADIUS}
						stroke="#d00" // KeNIC red
						strokeWidth={STROKE_WIDTH}
						fill="none"
						strokeDasharray={`${CIRCUMFERENCE * 0.3}, ${CIRCUMFERENCE}`}
						strokeLinecap="round"
					/>
				</Svg>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
});
