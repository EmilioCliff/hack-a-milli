import { useRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Dimensions,
	Image,
	Pressable,
} from 'react-native';
import KenyanFlagWaves from './KenyaWave';
import { IMAGES } from '~/constants/images';

const { width, height } = Dimensions.get('window');

const slides = [
	{
		id: '1',
		title: 'Welcome to KeNIC',
		subtitle: 'Your digital identity begins with .ke domains.',
		image: IMAGES.playStoreLogo,
	},
	{
		id: '2',
		title: 'Stay Updated',
		subtitle: 'Get news, blogs, careers & event updates right in the app.',
		image: IMAGES.playStoreLogo,
	},
	{
		id: '3',
		title: 'Auctions & Registrars',
		subtitle:
			'Access domain auctions and connect with accredited registrars.',
		image: IMAGES.playStoreLogo,
	},
	{
		id: '4',
		title: 'Join the Future',
		subtitle:
			'Kenya’s digital gateway is here. Secure your .ke identity today.',
		image: IMAGES.playStoreLogo,
	},
];

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
	const flatListRef = useRef<FlatList>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNext = () => {
		if (currentIndex < slides.length - 1) {
			flatListRef.current?.scrollToIndex({
				index: currentIndex + 1,
				animated: true,
			});
		} else {
			onDone();
		}
	};

	return (
		<View style={styles.container}>
			<FlatList
				ref={flatListRef}
				data={slides}
				keyExtractor={(item) => item.id}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={(e) => {
					const index = Math.round(
						e.nativeEvent.contentOffset.x / width,
					);
					setCurrentIndex(index);
				}}
				renderItem={({ item }) => (
					<View style={[styles.slide, { width }]}>
						<View style={styles.content}>
							<Image source={item.image} style={styles.image} />
							<Text style={styles.title}>{item.title}</Text>
							<Text style={styles.subtitle}>{item.subtitle}</Text>
						</View>
					</View>
				)}
				getItemLayout={(_, index) => ({
					length: width,
					offset: width * index,
					index,
				})}
			/>

			<View style={styles.controls}>
				<View style={styles.dots}>
					{slides.map((_, index) => (
						<View
							key={index}
							style={[
								styles.dot,
								{
									backgroundColor:
										index === currentIndex
											? '#CE1126'
											: '#ccc',
								},
							]}
						/>
					))}
				</View>

				<Pressable style={styles.button} onPress={handleNext}>
					<Text style={styles.buttonText}>
						{currentIndex === slides.length - 1
							? 'Get Started'
							: 'Next'}
					</Text>
				</Pressable>
			</View>

			<View style={styles.wavesContainer}>
				<KenyanFlagWaves height={150} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#fff' },
	slide: { justifyContent: 'center', alignItems: 'center', padding: 20 },
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	image: { width: 250, height: 250, resizeMode: 'contain', marginBottom: 20 },
	title: {
		fontSize: 26,
		fontWeight: '700',
		color: '#006B3F',
		textAlign: 'center',
		marginBottom: 10,
	},
	subtitle: { fontSize: 16, color: '#333', textAlign: 'center' },
	controls: {
		position: 'absolute',
		bottom: 100,
		width: '100%',
		alignItems: 'center',
	},
	dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
	dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 5 },
	button: {
		backgroundColor: '#CE1126',
		paddingVertical: 14,
		paddingHorizontal: 40,
		borderRadius: 30,
		marginBottom: 36,
	},
	buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
	wavesContainer: { position: 'absolute', bottom: 0, width: '100%' },
});
