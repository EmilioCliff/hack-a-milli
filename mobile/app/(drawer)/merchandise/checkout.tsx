import React, { useState } from 'react';
import { View, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Input } from '~/components/ui/input';

const paymentMethods = [
	{
		name: 'M-Pesa',
		icon: '📱',
	},
	{
		name: 'Credit/Debit Card',
		icon: '💳',
	},
	{
		name: 'Bank Transfer',
		icon: '🏦',
	},
];

export default function CheckoutScreen() {
	const [fullName, setFullName] = useState('');
	const [address, setAddress] = useState('');
	const [selectedPayment, setSelectedPayment] = useState('M-Pesa');
	const [loading, setLoading] = useState(false);

	const handlePlaceOrder = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			router.push('/(drawer)/merchandise/order-success');
		}, 1500);
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			className="flex-1 px-4 py-6 bg-white"
		>
			<Text className="text-xl font-bold mb-4 text-center">
				Shipping Info
			</Text>

			{/* Shipping Information */}
			<View className="mb-6">
				<Text className="text-lg font-bold mb-2">Full Name</Text>
				<TextInput
					placeholder="Enter your full name"
					value={fullName}
					onChangeText={setFullName}
					className="border border-gray-300 rounded-md px-4 py-2 mb-3"
				/>
				<Text className="text-lg font-bold mb-2">Email</Text>
				<TextInput
					placeholder="Enter your email"
					value={fullName}
					onChangeText={setFullName}
					className="border border-gray-300 rounded-md px-4 py-2 mb-3"
				/>
				<Text className="text-lg font-bold mb-2">Phone Number</Text>
				<TextInput
					placeholder="Enter your phone number"
					value={fullName}
					onChangeText={setFullName}
					className="border border-gray-300 rounded-md px-4 py-2 mb-3"
				/>
				<Text className="text-lg font-bold mb-2">Address</Text>
				<TextInput
					placeholder="Enter your address"
					value={address}
					onChangeText={setAddress}
					className="border border-gray-300 rounded-md px-4 py-2"
				/>
				<View className="flex-row gap-4 mt-2">
					<View className="flex-1">
						<Text className="text-lg font-bold mb-2">City</Text>
						<TextInput
							placeholder="City"
							value={address}
							onChangeText={setAddress}
							className="border border-gray-300 rounded-md px-4 py-2"
						/>
					</View>
					<View className="flex-1">
						<Text className="text-lg font-bold mb-2">
							Postal Code
						</Text>
						<TextInput
							placeholder="Postal Code"
							value={address}
							onChangeText={setAddress}
							className="border border-gray-300 rounded-md px-4 py-2"
						/>
					</View>
				</View>
			</View>

			<View className="mb-6 mt-4">
				<Text className="text-xl font-bold">Payment Method</Text>
				{paymentMethods.map((method) => (
					<RadioBox
						key={method.name}
						name={method.name}
						icon={method.icon}
						selected={selectedPayment === method.name}
						onPress={() => setSelectedPayment(method.name)}
					/>
				))}
			</View>

			{/* Order Summary */}
			<View className="mb-6">
				<Text className="text-lg font-medium mb-2">Order Summary</Text>
				<View className="flex-row justify-between mb-1">
					<Text className="text-base">Subtotal</Text>
					<Text className="text-base">Ksh 1500</Text>
				</View>
				<View className="flex-row justify-between mb-1">
					<Text className="text-base">Shipping</Text>
					<Text className="text-base">Ksh 200</Text>
				</View>
				<View className="flex-row justify-between border-t border-gray-300 mt-2 pt-2">
					<Text className="text-base font-semibold">Total</Text>
					<Text className="text-base font-semibold">Ksh 1700</Text>
				</View>
			</View>

			<Pressable
				disabled={loading}
				onPress={handlePlaceOrder}
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
