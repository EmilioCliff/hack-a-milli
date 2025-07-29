import { Image, View } from 'react-native';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Text } from '../ui/text';
import { s, vs } from 'react-native-size-matters';

interface merchCardProps {
	id: number;
	imageUrl: string;
	title: string;
	amount: number;
}

export default function MerchCard(props: merchCardProps) {
	return (
		<Card style={{ height: vs(190), width: s(160) }}>
			<View
				className="overflow-hidden p-4"
				style={{ height: vs(130), width: '100%' }}
			>
				<Image
					source={{ uri: props.imageUrl }}
					className="mx-auto h-full w-full rounded-lg"
				/>
			</View>
			<CardContent>
				<Text className="font-semibold">{props.title}</Text>
				<CardTitle className="mt-2 text-secondary">
					KES {props.amount}
				</CardTitle>
			</CardContent>
		</Card>
	);
}
