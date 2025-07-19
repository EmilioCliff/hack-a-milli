import { View } from 'react-native';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function AvailableDomain() {
	return (
		<Card className="p-4 border-l-4 border-l-primary">
			<View className="flex-row justify-between items-center">
				<View className="flex-row gap-2">
					<CardTitle className="font-extrabold font-2xl">
						k.or.ke
					</CardTitle>
					<PremiumBadgeLinearGradient>
						<Badge className="bg-transparent">
							<Text className="font-bold">Premium</Text>
						</Badge>
					</PremiumBadgeLinearGradient>
				</View>
				<Badge className="bg-secondary">
					<Text className="font-bold">available</Text>
				</Badge>
			</View>
			<Text className="mt-2 font-extrabold text-2xl text-secondary">
				KES 1,500
			</Text>
			<View className="flex-row flex-wrap justify-between my-2 p-4 bg-secondary/10 rounded-lg">
				<View className="w-[30%]">
					<Text className="text-muted-foreground">Reneral:</Text>
					<Text className="font-bold">KES 1,500</Text>
				</View>
				<View className="w-[30%]">
					<Text className="text-muted-foreground">Transfer:</Text>
					<Text className="font-bold">KES 1,500</Text>
				</View>
				<View className="w-[30%]">
					<Text className="text-muted-foreground">Restore:</Text>
					<Text className="font-bold">KES 5,000</Text>
				</View>
			</View>
			<Button className="bg-primary">
				<Text>Select Registrar</Text>
			</Button>
		</Card>
	);
}

const PremiumBadgeLinearGradient = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<LinearGradient
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
			colors={['#facc15', '#f97316']}
			style={{ borderRadius: 999 }}
		>
			{children}
		</LinearGradient>
	);
};
