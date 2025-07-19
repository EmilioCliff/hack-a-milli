import React, { useEffect, useRef, useState } from 'react';
import {
	Animated,
	Easing,
	Dimensions,
	FlatList,
	Image,
	View,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from 'react-native';
import { vs } from 'react-native-size-matters';
import { IMAGES } from '~/constants/images';

type CarouselItem = {
	id: string;
	image: any;
};

const carouselData: CarouselItem[] = [
	{ id: '01', image: IMAGES.event },
	{ id: '02', image: IMAGES.event },
	{ id: '03', image: IMAGES.event },
	{ id: '04', image: IMAGES.event },
	{ id: '05', image: IMAGES.event },
];

export default function Carousel() {
	const flatListRef = useRef<FlatList<CarouselItem>>(null);
	const screenWidth = Dimensions.get('window').width;
	const horizontalPadding = 16 * 2; // px-4 on both sides
	const itemWidth = screenWidth - horizontalPadding;

	const [activeIndex, setActiveIndex] = useState(0);

	const progressAnimRefs = useRef(
		carouselData.map(() => new Animated.Value(0)),
	).current;

	const animationDuration = 5000;
	const intervalRef = useRef<number | null>(null);

	const animateProgress = (index: number) => {
		progressAnimRefs.forEach((anim, i) => {
			if (i !== index) {
				anim.stopAnimation();
				anim.setValue(0);
			}
		});

		Animated.timing(progressAnimRefs[index], {
			toValue: 1,
			duration: animationDuration,
			useNativeDriver: false,
			easing: Easing.linear,
		}).start();
	};

	useEffect(() => {
		animateProgress(activeIndex);

		if (intervalRef.current) clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			const nextIndex = (activeIndex + 1) % carouselData.length;

			flatListRef.current?.scrollToIndex({
				index: nextIndex,
				animated: true,
			});
		}, 5000);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [activeIndex]);

	const getItemLayout = (_: any, index: number) => ({
		length: itemWidth,
		offset: itemWidth * index,
		index,
	});

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollX = event.nativeEvent.contentOffset.x;
		const index = Math.round(scrollX / itemWidth);
		if (index !== activeIndex) setActiveIndex(index);
	};

	const renderItem = ({ item }: { item: CarouselItem }) => (
		<View style={{ width: itemWidth }}>
			<Image
				source={item.image}
				style={{
					height: vs(250),
					width: '100%',
				}}
				resizeMode="stretch"
			/>
		</View>
	);

	return (
		<View className="mx-4 mb-10 rounded-b-3xl relative">
			<View className="overflow-hidden rounded-b-3xl">
				<View className="absolute top-2 left-4 right-4 flex-row gap-2 z-10">
					{carouselData.map((_, index) => (
						<View
							className="flex-1 h-[4] bg-secondary/40 overflow-hidden rounded-sm"
							key={index}
						>
							<Animated.View
								className={'bg-secondary h-[4] rounded-sm'}
								style={{
									width: progressAnimRefs[index].interpolate({
										inputRange: [0, 1],
										outputRange: ['0%', '100%'],
									}),
								}}
							/>
						</View>
					))}
				</View>

				<FlatList
					data={carouselData}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					horizontal
					pagingEnabled
					ref={flatListRef}
					getItemLayout={getItemLayout}
					onScroll={handleScroll}
					showsHorizontalScrollIndicator={false}
					snapToInterval={itemWidth}
					decelerationRate="fast"
				/>
			</View>

			<View className="absolute top-2 left-0 right-0 -bottom-2 rounded-b-3xl bg-secondary -z-10"></View>
			<View className="absolute top-2 left-0 right-0 -bottom-4 rounded-b-3xl bg-secondary/50 -z-10"></View>
			<View className="absolute top-2 left-0 right-0 -bottom-5 rounded-b-3xl bg-secondary/40 -z-10"></View>
			<View className="absolute top-2 left-0 right-0 -bottom-7 rounded-b-3xl bg-secondary/20 -z-10"></View>
		</View>
	);
}
