import { View } from 'react-native';
import { Text } from '../ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { IMAGES } from '~/constants/images';
import TypingEffect from './TypingEffect';

interface responseMessageCardProps {
	message: string;
}

export default function ResponseMessageCard(props: responseMessageCardProps) {
	return (
		<View className="flex-row justify-start gap-2 mt-2">
			<Avatar alt="Publisher Avatar">
				<AvatarImage source={{ uri: '' }} />
				<AvatarFallback className="bg-red-200">
					<Text className="text-red-900 font-semibold">.KE</Text>
				</AvatarFallback>
			</Avatar>
			<View className="bg-gray-300/40 p-2 max-w-[70%] rounded-md">
				{/* <Text className="text-black text-base font-medium">
					{props.message}
				</Text> */}

				<TypingEffect
					style="text-black text-base font-medium"
					text={props.message}
				/>
			</View>
		</View>
	);
}
