import { View } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { s } from 'react-native-size-matters';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { router } from 'expo-router';

export default function EmptyCart() {
	return (
		<View className="flex-1 justify-center items-center gap-2">
			<Entypo name="shopping-bag" size={s(80)} color={'black'} />
			<Text className="font-bold mt-4 text-3xl">Your Cart is Empty</Text>
			<Text className="text-md mb-6 text-muted-foreground text-center w-[60%]">
				Browse our merchandise and find something you like
			</Text>
			<Button
				onPress={() => router.back()}
				className="rounded-full bg-secondary w-[80%]"
			>
				<Text className="text-lg font-bold">Start Shopping</Text>
			</Button>
		</View>
	);
}
