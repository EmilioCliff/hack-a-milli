import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ChatInput from '~/components/chat/ChatInput';
import ResponseMessageCard from '~/components/chat/ResponseMessageCard';
import SentMessageCard from '~/components/chat/SentMessageCard';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import { RECEIVED, SENT } from '~/constants/app';
import { useKeyboardState } from '~/hooks/useKeyboardState';
import { Message } from '~/lib/types';

const messagesList = [
	{
		message: 'Hello',
		id: 1,
		type: 'SENT',
	},
	{
		id: 2,
		message: 'Hi, How can I help you today',
		type: 'RECEIVED',
	},
	{
		id: 3,
		message: 'Tell me about react native',
		type: 'SENT',
	},
	{
		id: 4,
		message:
			'It is something cool you have to believe me mahn. It is something cool you have to believe me mahn',
		type: 'RECEIVED',
	},
];

export default function ChatBot() {
	const [messageInput, setMessageInput] = useState('');
	const [messagesData, setMessegesData] = useState<Message[]>(messagesList);
	const flatListRef = useRef<FlatList>(null);
	const { isKeyboardVisible } = useKeyboardState();
	const user = {
		avatar_url: 'https://i.pravatar.cc/300',
		// avatar_url: '',
		full_name: 'Emilio Cliff',
		message:
			'hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world',
	};

	const scrollToBottom = () => {
		if (flatListRef.current && messagesData.length > 0) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messagesData, isKeyboardVisible]);

	const onMessageSend = () => {
		setMessegesData((prev) => {
			return [
				...prev,
				{
					id: prev.length + 1,
					message: messageInput,
					type: SENT,
				},
			];
		});

		setTimeout(() => {
			onGetResponse(
				'Hello, I am AI Assistant, How can I help you todat?',
			);
		}, 2000);
	};

	const onGetResponse = (response: string) => {
		setMessegesData((prev) => {
			return [
				...prev,
				{
					id: prev.length + 1,
					message: response,
					type: RECEIVED,
				},
			];
		});
	};

	return (
		<AppSafeView>
			<View className="px-4 flex-1">
				<ModalToLogo
					title="Chat Support"
					subtitle="Get instant help with your domain questions"
					icon={
						<Ionicons
							name="chatbubble-ellipses"
							size={32}
							color="white"
						/>
					}
				/>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
				>
					<FlatList
						ref={flatListRef}
						data={messagesData}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => {
							return item.type === SENT ? (
								<SentMessageCard
									message={item.message}
									avatar_url={user.avatar_url}
									full_name={user.full_name}
								/>
							) : (
								<ResponseMessageCard message={item.message} />
							);
						}}
						style={{
							flex: 1,
							backgroundColor: 'white',
							borderTopLeftRadius: 4,
							borderTopRightRadius: 4,
							borderWidth: 1,
							borderBottomWidth: 0,
							borderColor: '#d1d5db',
							padding: 4,
						}}
						contentContainerStyle={{ paddingBottom: 16 }}
						onLayout={scrollToBottom}
						onContentSizeChange={scrollToBottom}
					/>
					<ChatInput
						messageValue={messageInput}
						setMessageValue={setMessageInput}
						onMessageSent={onMessageSend}
					/>
				</KeyboardAvoidingView>
			</View>
		</AppSafeView>
	);
}
