// import { View, Image, Pressable } from 'react-native';
// import { Card } from '../ui/card';
// import { Text } from '../ui/text';
// import { Button } from '../ui/button';
// import { AntDesign } from '@expo/vector-icons';
// import { s } from 'react-native-size-matters';

// interface cartItemProps {
// 	id: number;
// 	imageUrl: string;
// 	title: string;
// 	amount: number;
// }

// export default function CartItem(props: cartItemProps) {
// 	return (
// 		<Card className="flex-row p-2 gap-2 mb-2">
// 			<View className="justify-center items-center">
// 				<Image
// 					className="rounded-lg"
// 					source={{ uri: props.imageUrl }}
// 					style={{ width: s(80), height: s(80) }}
// 				/>
// 			</View>
// 			<View className="flex flex-grow justify-between">
// 				<Text className="font-bold text-lg">{props.title}</Text>
// 				<Text className="font-bold text-md">{props.amount}</Text>
// 				<View
// 					style={{ width: s(100) }}
// 					className="flex flex-row p-1 justify-between items-center border border-border rounded-full"
// 				>
// 					<Button
// 						variant={'secondary'}
// 						size={'sm'}
// 						className="rounded-full"
// 						// onPress={props.onIncrease}
// 					>
// 						<Text className="text-lg font-bold">+</Text>
// 					</Button>
// 					<Text>10</Text>
// 					<Button
// 						variant={'secondary'}
// 						size={'sm'}
// 						className="rounded-full"
// 						// onPress={props.onDecrease}
// 					>
// 						<Text className="text-lg font-bold">-</Text>
// 					</Button>
// 				</View>
// 			</View>
// 			<View>
// 				<Pressable className="mt-auto flex flex-row gap-2 items-center justify-between">
// 					<AntDesign name="delete" color={'#dc2626'} size={14} />
// 					<Text style={{ color: '#dc2626' }}>Delete</Text>
// 				</Pressable>
// 			</View>
// 		</Card>
// 	);
// }

import { View, Image, Pressable } from 'react-native';
import { Card } from '../ui/card';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { AntDesign } from '@expo/vector-icons';
import { s } from 'react-native-size-matters';

interface CartItemProps {
	id: number;
	imageUrl: string;
	title: string;
	price: number;
	quantity: number;
	size: string;
	color: string;
	onIncrease: () => void;
	onDecrease: () => void;
	onDelete: () => void;
}

export default function CartItem(props: CartItemProps) {
	return (
		<Card className="flex-row p-2 gap-2 mb-2">
			<View className="justify-center items-center">
				<Image
					className="rounded-lg"
					source={{ uri: props.imageUrl }}
					style={{ width: s(80), height: s(80) }}
				/>
			</View>

			<View className="flex flex-grow justify-between">
				<Text className="font-bold text-lg">{props.title}</Text>
				<Text className="text-gray-500">Size: {props.size}</Text>
				<Text className="text-gray-500">Color: {props.color}</Text>
				<Text className="font-bold text-md">KES {props.price}</Text>

				<View
					style={{ width: s(100) }}
					className="flex flex-row p-1 justify-between items-center border border-border rounded-full"
				>
					<Button
						variant={'secondary'}
						size={'sm'}
						className="rounded-full"
						onPress={props.onIncrease}
					>
						<Text className="text-lg font-bold">+</Text>
					</Button>
					<Text>{props.quantity}</Text>
					<Button
						variant={'secondary'}
						size={'sm'}
						className="rounded-full"
						onPress={props.onDecrease}
					>
						<Text className="text-lg font-bold">-</Text>
					</Button>
				</View>
			</View>

			<View>
				<Pressable
					onPress={props.onDelete}
					className="mt-auto flex flex-row gap-2 items-center justify-between"
				>
					<AntDesign name="delete" color={'#dc2626'} size={14} />
					<Text style={{ color: '#dc2626' }}>Delete</Text>
				</Pressable>
			</View>
		</Card>
	);
}
