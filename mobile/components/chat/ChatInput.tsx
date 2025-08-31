import { Keyboard, TouchableOpacity, View } from 'react-native';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Feather } from '@expo/vector-icons';
import { FC } from 'react';

interface chatInputProps {
	messageValue: string;
	setMessageValue: (message: string) => void;
	onMessageSent: (message: string) => void;
}

const ChatInput: FC<chatInputProps> = ({
	messageValue,
	setMessageValue,
	onMessageSent,
}) => {
	const sendMessageHandler = () => {
		if (messageValue.trim().length > 0) {
			onMessageSent(messageValue);
			setMessageValue('');
		}
		Keyboard.dismiss();
	};
	return (
		<View className="p-4 border flex-row bg-white border-gray-300 gap-4 items-center">
			<Input
				value={messageValue}
				onChangeText={setMessageValue}
				multiline
				placeholder="Type your message"
				className="border flex-1 border-gray-300 rounded-md h-full px-4 py-2"
			/>
			<Button onPress={sendMessageHandler} size="icon">
				<Feather name="send" size={20} color="white" />
			</Button>
		</View>
	);
};

export default ChatInput;
