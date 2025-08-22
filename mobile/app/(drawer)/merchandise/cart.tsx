import { FlatList, Pressable, View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Link } from 'expo-router';
import EmptyCart from '~/components/merchandise/EmptyCart';
import AppSafeView from '~/components/shared/AppSafeView';
import CartItem from '~/components/merchandise/CartItem';
import { vs } from 'react-native-size-matters';
import { Button } from '~/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store/store';
import {
	decreaseQuantity,
	increaseQuantity,
	removeFromCart,
} from '~/store/slices/cart';
import { SHIPPING_FEE } from '~/constants/app';

export default function CartPage() {
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const dispatch = useDispatch();

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<AppSafeView>
			{cartItems.length > 0 ? (
				<>
					<View className="flex-1 justify-between p-4">
						<FlatList
							data={cartItems}
							keyExtractor={(item, index) =>
								`${item.id}-${item.size}-${item.color}-${index}`
							}
							renderItem={({ item }) => (
								<CartItem
									id={item.id}
									imageUrl={item.imageUrl}
									title={item.title}
									price={item.price}
									quantity={item.quantity}
									size={item.size}
									color={item.color}
									onIncrease={() =>
										dispatch(
											increaseQuantity({
												id: item.id,
												size: item.size,
												color: item.color,
											}),
										)
									}
									onDecrease={() =>
										dispatch(
											decreaseQuantity({
												id: item.id,
												size: item.size,
												color: item.color,
											}),
										)
									}
									onDelete={() =>
										dispatch(
											removeFromCart({
												id: item.id,
												size: item.size,
												color: item.color,
											}),
										)
									}
								/>
							)}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: vs(4) }}
						/>
						<View className="mt-4">
							<View className="flex flex-row justify-between">
								<Text className="font-bold text-lg">
									Subtotal:
								</Text>
								<Text className="font-bold text-lg">
									KES {subtotal}
								</Text>
							</View>
							<View className="flex flex-row justify-between">
								<Text className="font-bold text-lg">
									Shipping:
								</Text>
								<Text className="font-bold text-lg">
									KES {SHIPPING_FEE}
								</Text>
							</View>
							<View className="h-1 w-full bg-border my-2" />
							<View className="flex flex-row justify-between">
								<Text className="font-bold text-lg">
									Total:
								</Text>
								<Text className="font-bold text-lg">
									KES {subtotal + SHIPPING_FEE}
								</Text>
							</View>
						</View>
					</View>
					<Link href="/(drawer)/merchandise/checkout" asChild>
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
