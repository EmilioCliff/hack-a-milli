import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Easing,
	Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function KenicSplash({ onFinish }: { onFinish: () => void }) {
	// Animated values
	const scaleLogo = useRef(new Animated.Value(0.5)).current;
	const opacityLogo = useRef(new Animated.Value(0)).current;

	const translateText = useRef(new Animated.Value(10)).current;
	const opacityText = useRef(new Animated.Value(0)).current;

	const scaleKe = useRef(new Animated.Value(0)).current;
	const opacityKe = useRef(new Animated.Value(0)).current;

	const loadingWidth = useRef(new Animated.Value(0)).current;

	// Spin animation
	const spinValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Logo animation
		Animated.sequence([
			Animated.parallel([
				Animated.timing(scaleLogo, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(opacityLogo, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
			Animated.parallel([
				Animated.timing(translateText, {
					toValue: 0,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(opacityText, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
			Animated.parallel([
				Animated.timing(scaleKe, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(opacityKe, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
			Animated.timing(loadingWidth, {
				toValue: width * 0.5,
				duration: 1500,
				easing: Easing.out(Easing.ease),
				useNativeDriver: false,
			}),
		]).start(() => {
			onFinish();
		});

		// Loop spin
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 3000,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		).start();
	}, []);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	return (
		<LinearGradient
			colors={['#dc2626', '#b91c1c', '#16a34a']}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={styles.container}
		>
			<View style={styles.centerContent}>
				{/* Logo */}
				<Animated.View
					style={[
						styles.logoBox,
						{
							transform: [{ scale: scaleLogo }],
							opacity: opacityLogo,
						},
					]}
				>
					<Animated.View style={{ transform: [{ rotate: spin }] }}>
						<Feather name="globe" size={60} color="white" />
					</Animated.View>
				</Animated.View>

				<Animated.View
					style={{
						transform: [{ translateY: translateText }],
						opacity: opacityText,
					}}
				>
					<Text style={styles.title}>KENIC</Text>
					<Text style={styles.subtitle}>
						Kenya Network Information Centre
					</Text>
				</Animated.View>

				{/* .ke */}
				<Animated.View
					style={[
						styles.keBox,
						{ transform: [{ scale: scaleKe }], opacity: opacityKe },
					]}
				>
					<Text style={styles.keText}>Your Digital Identity </Text>
					<Text style={styles.keHighlight}>.ke</Text>
				</Animated.View>

				{/* Loading bar */}
				<View style={styles.loadingContainer}>
					<Animated.View
						style={[styles.loadingBar, { width: loadingWidth }]}
					/>
				</View>
				<Text style={styles.loadingText}>
					Loading your digital gateway...
				</Text>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centerContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoBox: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		padding: 20,
		borderRadius: 24,
		marginBottom: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: 'white',
		textAlign: 'center',
		marginBottom: 20,
	},
	keBox: {
		backgroundColor: 'rgba(255,255,255,0.2)',
		padding: 12,
		borderRadius: 16,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20,
	},
	keText: {
		fontSize: 18,
		color: 'white',
	},
	keHighlight: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#86efac',
		marginLeft: 6,
	},
	loadingContainer: {
		marginTop: 40,
		width: '60%',
		height: 6,
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 10,
		overflow: 'hidden',
	},
	loadingBar: {
		height: '100%',
		backgroundColor: '#4ade80',
		borderRadius: 10,
	},
	loadingText: {
		marginTop: 10,
		color: 'rgba(255,255,255,0.8)',
	},
});
