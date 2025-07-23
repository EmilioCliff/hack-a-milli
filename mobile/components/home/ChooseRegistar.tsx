import { View, Image } from 'react-native';
import { Card, CardContent, CardFooter } from '../ui/card';
import { IMAGES } from '~/constants/images';
import { s, vs } from 'react-native-size-matters';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { FontAwesome } from '@expo/vector-icons';

export default function ChooseRegistar() {
	return (
		<Card>
			<Image
				source={IMAGES.event}
				style={{
					height: vs(150),
					width: '100%',
				}}
				resizeMode="cover"
			/>
			<CardContent className="mt-2">
				<Text className="font-extrabold text-xl">
					Truehost Cloud Limited
				</Text>
				<Text className="text-lg">info@truehost.co.ke</Text>
				<Text className="text-lg">0734919116</Text>
			</CardContent>
			<CardFooter>
				<Button className="flex-row items-center justify-center gap-2 w-full ">
					<FontAwesome name="external-link" size={16} color="white" />
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						className="font-bold text-lg"
					>
						Register with Truehost Cloud Limited
					</Text>
				</Button>
			</CardFooter>
		</Card>
	);
}
