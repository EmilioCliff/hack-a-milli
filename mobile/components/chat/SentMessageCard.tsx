import { View } from 'react-native';
import { Text } from '../ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface sentMessageCardProps {
	avatar_url: string | undefined;
	full_name: string;
	message: string;
}

export default function SentMessageCard(props: sentMessageCardProps) {
	return (
		<View className="flex-row justify-end gap-2 mt-2">
			<View className="bg-primary p-2 max-w-[70%] rounded-md">
				<Text className="text-white text-base font-medium">
					{props.message}
				</Text>
			</View>
			<Avatar alt="Publisher Avatar">
				<AvatarImage
					source={{
						uri: props.avatar_url,
					}}
				/>
				<AvatarFallback className="bg-green-200">
					<Text className="text-green-900 font-semibold">
						{props.full_name
							.split(' ')
							.map((word) => word.charAt(0))
							.join('')
							.toUpperCase()}
					</Text>
				</AvatarFallback>
			</Avatar>
		</View>
	);
}
