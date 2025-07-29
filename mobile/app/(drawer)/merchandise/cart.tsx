import { FlatList, Pressable, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Link } from 'expo-router';
import EmptyCart from '~/components/merchandise/EmptyCart';
import AppSafeView from '~/components/shared/AppSafeView';
import CartItem from '~/components/merchandise/CartItem';
import { vs } from 'react-native-size-matters';
import { Button } from '~/components/ui/button';

const data = [
	{
		id: 1,
		imageUrl: [
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		],
		title: 'Lenovo Laptop',
		amount: 1500,
	},
	{
		id: 2,
		imageUrl: [
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		],
		title: 'iPhone 16 Pro Max',
		amount: 1500,
	},
	{
		id: 3,
		imageUrl: [
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		],
		title: 'Mac Book',
		amount: 1000,
	},
	{
		id: 4,
		imageUrl: [
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		],
		title: 'Samsung Phone',
		amount: 1800,
	},
	{
		id: 5,
		imageUrl: [
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		],
		title: 'iPhone 16 Pro Max',
		amount: 1500,
	},
	{
		id: 6,
		imageUrl: [
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		],
		title: 'Mac Book',
		amount: 1000,
	},
	{
		id: 7,
		imageUrl: [
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D',
		],
		title: 'Samsung Phone',
		amount: 1800,
	},
];

export default function CartPage() {
	return (
		<AppSafeView>
			{data.length > 0 ? (
				<>
					<View className="flex-1 justify-between p-4">
						<FlatList
							data={data}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
								<CartItem
									id={item.id}
									imageUrl={item.imageUrl[0]}
									title={item.title}
									amount={item.amount}
								/>
							)}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: vs(4) }}
						/>
						<View style={{ marginBlock: vs(8) }}>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-bold text-lg">
									Subtotal:{' '}
								</Text>
								<Text className="font-bold text-lg">
									KES 9893
								</Text>
							</View>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-bold text-lg">
									Shipping:{' '}
								</Text>
								<Text className="font-bold text-lg">
									KES 100
								</Text>
							</View>
							<View
								className="h-1 w-full bg-border"
								style={{ marginBlock: vs(5) }}
							/>
							<View className="flex flex-row justify-between items-center">
								<Text className="font-bold text-lg">
									Total:{' '}
								</Text>
								<Text className="font-bold text-lg">
									KES 9918
								</Text>
							</View>
						</View>
					</View>
					<Link href={'/(drawer)/merchandise/checkout'} asChild>
						<Button className="my-2 mx-4">
							<Text className="text-lg font-bold">
								Continue To Checkout
							</Text>
						</Button>
					</Link>
				</>
			) : (
				<EmptyCart />
			)}
		</AppSafeView>
	);
}
