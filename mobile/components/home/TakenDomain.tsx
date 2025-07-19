import { View } from 'react-native';
import { Card, CardTitle } from '../ui/card';
import { Text } from '../ui/text';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AntDesign } from '@expo/vector-icons';

export default function TakenDomain() {
	return (
		<Card className="p-4 border-l-4 border-l-primary">
			<View className="flex-row justify-between items-center">
				<CardTitle className="font-extrabold font-2xl">
					k.or.ke
				</CardTitle>
				<Badge className="bg-slate-600">
					<Text className="font-bold">taken</Text>
				</Badge>
			</View>
			<View className="my-4">
				<Text>
					<Text className="font-bold">Registered: </Text> 2020-03-15
				</Text>
				<Text>
					<Text className="font-bold">Expires: </Text> 2025-03-15
				</Text>
			</View>
			<Button className="flex-row items-center gap-4 border border-border bg-card shadow-sm shadow-foreground/10 self-start">
				<AntDesign
					className="font-bold"
					name="infocirlceo"
					size={18}
					color="black"
				/>
				<Text className="text-black font-extrabold">
					View WhoIs Info
				</Text>
			</Button>
		</Card>
	);
}
