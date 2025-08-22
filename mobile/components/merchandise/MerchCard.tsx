import { Image, View } from 'react-native';
import { Card, CardContent, CardTitle } from '../ui/card';
import { Text } from '../ui/text';
import { s, vs } from 'react-native-size-matters';
import { Merchandise } from '~/lib/types';

export default function MerchCard(props: Merchandise) {
	return (
		<Card style={{ height: vs(190), width: s(160) }}>
			<View
				className="overflow-hidden p-4"
				style={{ height: vs(130), width: '100%' }}
			>
				<Image
					source={{ uri: props.image_url[0] }}
					className="mx-auto h-full w-full rounded-lg"
				/>
			</View>
			<CardContent>
				<Text className="font-semibold">{props.name}</Text>
				<CardTitle className="mt-2 text-secondary">
					KES {props.price}
				</CardTitle>
			</CardContent>
		</Card>
	);
}
