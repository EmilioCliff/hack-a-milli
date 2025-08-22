import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from '~/components/ui/text';
import AppSafeView from '~/components/shared/AppSafeView';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import MerchCarousel from '~/components/merchandise/MerchCarousel';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import getMerchandise from '~/services/getMerchandise';
import KeNICSpinner from '~/components/shared/KeNICSpinner';
import EmptyState from '~/components/shared/EmptyState';
import { Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { addToCart } from '~/store/slices/cart';

const colorOptions = ['Red', 'Green', 'Blue', 'Black', 'White'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];

export default function MerchandiseDetails() {
	const [selectedColor, setSelectedColor] = useState<string | null>('White');
	const [selectedSize, setSelectedSize] = useState<string | null>('M');
	const [selectedQuantity, setSelectedQuantity] = useState(1);

	const dispatch = useDispatch();
	const { id } = useLocalSearchParams();

	const { data, isLoading, error } = useQuery({
		queryKey: ['merchandise', { id }],
		queryFn: () => getMerchandise(Number(id)),
		staleTime: 2 * 10000 * 5,
	});

	const handleAddToCart = () => {
		if (!data?.data) return;

		dispatch(
			addToCart({
				id: data.data.id,
				title: data.data.name,
				price: data.data.price,
				quantity: selectedQuantity,
				size: selectedSize!,
				color: selectedColor!,
				imageUrl: data.data.image_url[0],
			}),
		);
	};

	if (isLoading || !data?.data)
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<KeNICSpinner />
			</View>
		);

	if (error)
		return (
			<EmptyState
				title=""
				subtitle=""
				icon={<Entypo name="shopping-bag" size={38} color="black" />}
			/>
		);

	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				className="flex-1 px-4"
			>
				<MerchCarousel images={data.data.image_url} />
				<Text className="font-bold text-3xl">{data.data.name}</Text>
				<Text className="mt-2 text-2xl text-secondary">
					KES {data.data.price}
				</Text>
				<Text className="text-gray-600 my-4">
					{data.data.description}
				</Text>

				<Text className="font-bold text-lg mb-2">Select Color</Text>
				<View className="flex-row flex-wrap">
					{colorOptions.map((color) => (
						<OptionBox
							key={color}
							label={color}
							selected={selectedColor === color}
							onPress={() => setSelectedColor(color)}
						/>
					))}
				</View>

				<Text className="font-bold text-lg mt-4 mb-2">Select Size</Text>
				<View className="flex-row flex-wrap">
					{sizeOptions.map((size) => (
						<OptionBox
							key={size}
							label={size}
							selected={selectedSize === size}
							onPress={() => setSelectedSize(size)}
						/>
					))}
				</View>

				<Text className="font-bold text-lg mt-4 mb-2">
					Select Color
				</Text>
				<View className="flex-row gap-4">
					<Button
						onPress={() =>
							setSelectedQuantity((prev) => Math.max(1, prev - 1))
						}
						className="bg-white border items-center justify-center border-gray-300"
					>
						<Text className="text-black">-</Text>
					</Button>
					<Button className="bg-white border items-center justify-center border-gray-300">
						<Text className="text-black">{selectedQuantity}</Text>
					</Button>
					<Button
						onPress={() => setSelectedQuantity((prev) => prev + 1)}
						className="bg-white border items-center justify-center border-gray-300"
					>
						<Text className="text-black">+</Text>
					</Button>
				</View>
				<TouchableOpacity
					onPress={handleAddToCart}
					activeOpacity={0.7} // lower = more fade on press
					className="mt-6 bg-primary rounded-xl h-10 px-4 py-2 native:h-12 native:px-5 native:py-3"
				>
					<Text className="text-xl font-bold text-white text-center">
						Add To Cart
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</AppSafeView>
	);
}

const OptionBox = ({
	label,
	selected,
	onPress,
}: {
	label: string;
	selected: boolean;
	onPress: () => void;
}) => (
	<TouchableOpacity
		onPress={onPress}
		className={`px-4 py-2 rounded-md mr-2 mb-2 border ${
			selected ? 'border-primary' : 'border-gray-300'
		}`}
	>
		<Text
			className={`text-base font-bold ${selected ? 'text-primary' : 'text-gray-500'}`}
		>
			{label}
		</Text>
	</TouchableOpacity>
);
