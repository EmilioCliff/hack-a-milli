import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '~/components/ui/text';
import AppSafeView from '~/components/shared/AppSafeView';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import MerchCarousel from '~/components/merchandise/MerchCarousel';

const colorOptions = ['Red', 'Green', 'Blue', 'Black', 'White'];
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
const product = {
	id: 1,
	imageUrl: [
		'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
	],
	description:
		'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum eos atque deserunt repellat dicta. Similique libero vel incidunt, neque autem quidem! Reiciendis ea eligendi impedit vel repellendus nihil ab molestiae!',
	title: 'Lenovo Laptop',
	amount: 1500,
};

export default function MerchandiseDetails() {
	const [selectedColor, setSelectedColor] = useState<string | null>('White');
	const [selectedSize, setSelectedSize] = useState<string | null>('M');
	const [selectedQuantity, setSelectedQuantity] = useState(1);

	return (
		<AppSafeView>
			<ScrollView
				showsVerticalScrollIndicator={false}
				showsHorizontalScrollIndicator={false}
				className="flex-1 px-4"
			>
				<MerchCarousel images={product.imageUrl} />
				<Text className="font-bold text-3xl">{product.title}</Text>
				<Text className="mt-2 text-2xl text-secondary">
					KES {product.amount}
				</Text>
				<Text className="text-gray-600 my-4">
					{product.description}
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

				<Button className="mt-6">
					<Text className="text-xl font-bold">Add To Cart</Text>
				</Button>
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
