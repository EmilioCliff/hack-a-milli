import { View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function MerchCarousel({ images }: { images: string[] }) {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<View className="mt-4 mb-6">
			<Carousel
				width={width - 32} // padding-x 4 * 2
				height={250}
				data={images}
				onSnapToItem={(index) => setActiveIndex(index)}
				renderItem={({ item }) => (
					<Image
						source={{ uri: item }}
						className="rounded-2xl"
						style={{
							width: '100%',
							height: '100%',
							resizeMode: 'cover',
							backgroundColor: '#f5f6fa',
							borderRadius: 16,
						}}
					/>
				)}
				pagingEnabled
				// mode="parallax"
			/>

			{/* Dots */}
			<View className="flex-row justify-center mt-3 gap-1">
				{images.map((_, index) => (
					<View
						key={index}
						className={`w-2 h-2 rounded-full ${
							index === activeIndex ? 'bg-red-500' : 'bg-gray-300'
						}`}
					/>
				))}
			</View>
		</View>
	);
}
