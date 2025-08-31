import { useState } from 'react';
import {
	View,
	ScrollView,
	ActivityIndicator,
	KeyboardAvoidingView,
} from 'react-native';
import { Text } from '~/components/ui/text';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	OrderPayloadFormType,
	OrderPayloadSchema,
} from '~/components/merchandise/CheckoutForm';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import SubmitOrderRequest from '~/services/submitOrderRequest';
import AppShowMessage from '~/components/shared/AppShowMessage';
import { AntDesign } from '@expo/vector-icons';
import AppControlerInput from '~/components/shared/AppControlInput';
import { PAYMENT_METHODS, SHIPPING_FEE } from '~/constants/app';
import { Platform } from 'react-native';
import { RootState } from '~/store/store';
import { clearCart } from '~/store/slices/cart';

export default function CheckoutScreen() {
	const [selectedPayment, setSelectedPayment] = useState('M-Pesa');
	const [loading, setLoading] = useState(false);
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const user = useSelector((state: RootState) => state.user.user);
	const dispatch = useDispatch();

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	const mappedItems = cartItems.map((item) => ({
		product_id: item.id,
		size: item.size,
		color: item.color,
		quantity: item.quantity,
	}));

	let order_details = {
		first_name: '',
		last_name: '',
		email: '',
		phone_number: '',
		address: '',
		city: '',
		postal_code: '',
		payment_method: 'mpesa',
	};

	// there is a logged in user
	if (user) {
		const userNames = user.full_name?.split(' ', 1);
		order_details = {
			first_name: userNames?.length > 0 ? userNames[0] : '',
			last_name: userNames?.length > 1 ? userNames[1] : '',
			email: user.email,
			phone_number: user.phone_number,
			address: user.address || '',
			city: '',
			postal_code: '',
			payment_method: 'mpesa',
		};
	}
	const { control, handleSubmit, setValue, reset } = useForm({
		resolver: zodResolver(OrderPayloadSchema),
		defaultValues: {
			user_id: user?.id,
			status: 'pending',
			payment_status: 'false',
			items: mappedItems,
			order_details: order_details,
		},
	});

	const mutation = useMutation({
		mutationFn: SubmitOrderRequest,
		onSuccess: async (response) => {
			reset();
			dispatch(clearCart());
			const orderId = response.data.id;
			const year = new Date().getFullYear();
			const trackingId = `#KENIC-${year}-${String(orderId).padStart(3, '0')}`;
			router.push({
				pathname: '/(drawer)/merchandise/order-success',
				params: { trackingId: trackingId, total: response.data.amount },
			});
		},
		onError: (error: any) => {
			AppShowMessage({
				message: error.message,
				type: 'danger',
				position: 'top',
				icon: () => (
					<AntDesign name="warning" size={24} color="black" />
				),
			});
		},
		onSettled: () => {
			setLoading(false);
		},
	});

	const onSubmitHandler = (formValues: OrderPayloadFormType) => {
		setLoading(true);
		mutation.mutate(formValues);
	};

	const onError = (error: unknown) => {
		console.log(error);
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			className="flex-1 px-4 py-6 bg-white"
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
			>
				<Text className="text-xl font-bold mb-4 text-center">
					Shipping Info
				</Text>

				{/* Shipping Information */}
				<View className="mb-6">
					<View className="flex-row gap-4">
						<View className="flex-1">
							<Text className="text-lg font-bold mb-2">
								First Name
							</Text>
							<AppControlerInput
								control={control}
								name="order_details.first_name"
								placeholder="John"
							/>
						</View>
						<View className="flex-1">
							<Text className="text-lg font-bold mb-2">
								Last Name
							</Text>
							<AppControlerInput
								control={control}
								name="order_details.last_name"
								placeholder="Doe"
							/>
						</View>
					</View>

					<Text className="text-lg font-bold mb-2">Email</Text>
					<AppControlerInput
						control={control}
						name="order_details.email"
						placeholder="john.doe@example.com"
						keyboardType="email-address"
					/>
					<Text className="text-lg font-bold mb-2">Phone Number</Text>
					<AppControlerInput
						control={control}
						name="order_details.phone_number"
						placeholder="0700000000"
						keyboardType="numeric"
					/>
					<Text className="text-lg font-bold mb-2">Address</Text>
					<AppControlerInput
						control={control}
						name="order_details.address"
						placeholder="Waiyaki way"
					/>
					<View className="flex-row gap-4 mt-2">
						<View className="flex-1">
							<Text className="text-lg font-bold mb-2">City</Text>
							<AppControlerInput
								control={control}
								name="order_details.city"
								placeholder="Nairobi"
							/>
						</View>
						<View className="flex-1">
							<Text className="text-lg font-bold mb-2">
								Postal Code
							</Text>
							<AppControlerInput
								control={control}
								name="order_details.postal_code"
								placeholder="00100"
							/>
						</View>
					</View>
				</View>

				<View className="mb-6 mt-4">
					<Text className="text-xl font-bold">Payment Method</Text>
					{PAYMENT_METHODS.map((method) => (
						<RadioBox
							key={method.name}
							name={method.name}
							icon={method.icon}
							selected={selectedPayment === method.name}
							onPress={() => {
								setValue(
									'order_details.payment_method',
									method.value,
								);
								setSelectedPayment(method.name);
							}}
						/>
					))}
				</View>

				{/* Order Summary */}
				<View className="mb-6">
					<Text className="text-lg font-medium mb-2">
						Order Summary
					</Text>
					<View className="flex-row justify-between mb-1">
						<Text className="text-base">Subtotal</Text>
						<Text className="text-base">Ksh {subtotal}</Text>
					</View>
					<View className="flex-row justify-between mb-1">
						<Text className="text-base">Shipping</Text>
						<Text className="text-base">Ksh {SHIPPING_FEE}</Text>
					</View>
					<View className="flex-row justify-between border-t border-gray-300 mt-2 pt-2">
						<Text className="text-base font-semibold">Total</Text>
						<Text className="text-base font-semibold">
							Ksh {subtotal + SHIPPING_FEE}
						</Text>
					</View>
				</View>

				<Pressable
					disabled={loading}
					onPress={handleSubmit(onSubmitHandler, onError)}
					className={`w-full bg-primary mb-8 py-3 rounded-lg ${loading ? 'opacity-50' : ''}`}
				>
					{loading ? (
						<ActivityIndicator color="white" />
					) : (
						<Text className="text-white text-center text-base font-semibold">
							Place Order
						</Text>
					)}
				</Pressable>
			</KeyboardAvoidingView>
		</ScrollView>
	);
}

const RadioBox = ({
	name,
	icon,
	selected,
	onPress,
}: {
	name: string;
	icon: string;
	selected: boolean;
	onPress: () => void;
}) => (
	<Pressable
		key={name}
		onPress={onPress}
		className={`
              flex-row items-center p-4 rounded-md border mt-4
              ${selected ? 'bg-red-50 border-red-500' : 'bg-white border-gray-300'}
            `}
	>
		<View className="w-5 h-5 mr-3 rounded-full border border-gray-400 items-center justify-center">
			{selected && (
				<View className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
			)}
		</View>

		<Text className="text-base text-gray-700">
			{icon} {name}
		</Text>
	</Pressable>
);
