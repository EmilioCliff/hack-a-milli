import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, TouchableOpacity } from 'react-native';
import {
	FlatList,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import ChatInput from '~/components/chat/ChatInput';
import ChatSessionsModal from '~/components/chat/ChatList';
import ResponseMessageCard from '~/components/chat/ResponseMessageCard';
import SentMessageCard from '~/components/chat/SentMessageCard';
import ModalToLogo from '~/components/modal/ModalToLogo';
import AppSafeView from '~/components/shared/AppSafeView';
import AppShowMessage from '~/components/shared/AppShowMessage';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { RECEIVED, SENT } from '~/constants/app';
import { useKeyboardState } from '~/hooks/useKeyboardState';
import { Message } from '~/lib/types';
import getChat from '~/services/getChat';
import sendMessage from '~/services/sendMessage';
import {
	addChatSession,
	removeChatSession,
	setActiveSession,
	updateChatSession,
} from '~/store/slices/chat';
import { openLoginModal } from '~/store/slices/ui';
import { RootState } from '~/store/store';

const QUICK_QUESTIONS = [
	'How do I renew my domain?',
	'How do I transfer my domain?',
	'What’s WHOIS?',
];

export default function ChatBot() {
	const [messageInput, setMessageInput] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const sessions = useSelector((state: RootState) => state.chat.sessions);
	const [messagesData, setMessagesData] = useState<Message[]>([]);
	const user = useSelector((state: RootState) => state.user);
	const chats = useSelector((state: RootState) => state.chat);
	const { isKeyboardVisible } = useKeyboardState();
	const flatListRef = useRef<FlatList>(null);
	const dispatch = useDispatch();
	// const [keyboardHeight, setKeyboardHeight] = useState(0);
	// const screenHeight = Dimensions.get('window').height;

	const scrollToBottom = () => {
		if (flatListRef.current && messagesData.length > 0) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	};

	const mutation = useMutation({
		mutationFn: sendMessage,
		onSuccess: (data) => {
			setMessagesData((prev) =>
				prev.filter((msg) => msg.id !== 'thinking'),
			);

			if (data.title) {
				dispatch(
					addChatSession({
						id: String(data.chat_id) || '',
						title: data.title || 'New Chat',
					}),
				);
			}
			onGetResponse(data.data);
		},
		onError: (error: any) => {
			setMessagesData((prev) =>
				prev.filter((msg) => msg.id !== 'thinking'),
			);
			AppShowMessage({
				message: error.message,
				type: 'danger',
				position: 'top',
				icon: () => (
					<Ionicons name="alert-circle" size={24} color="white" />
				),
			});
		},
	});

	const chatMutation = useMutation({
		mutationFn: getChat,
		onSuccess: (data) => {
			setMessageInput('');
			const messagesWithIds = (data.data.message || []).map(
				(msg: { role: string; content: string }, index: number) => ({
					id: String(index + 1),
					role: msg.role,
					content: msg.content,
				}),
			);

			setMessagesData(messagesWithIds);
		},
		onError: () => {
			setMessagesData((prev) =>
				prev.filter((msg) => msg.id !== 'thinking'),
			);
		},
	});

	useEffect(() => {
		return () => setMessagesData([]); // cleanup on unmount
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messagesData, isKeyboardVisible]);

	const onMessageSend = (message: string) => {
		if (!user.isAuthenticated) {
			dispatch(
				openLoginModal({
					title: 'Login required',
					message: 'You need an account to access our chats.',
					confirmLabel: 'Login',
				}),
			);
			return;
		}

		const sentMsg = {
			id: String(messagesData.length + 1),
			content: message,
			role: SENT,
		};
		setMessagesData((prev) => [...prev, sentMsg]);

		mutation.mutate({
			sessionId: chats.activeSessionId,
			message: {
				id: '', // backend will assign ID
				content: message,
				role: SENT,
			},
			history: messagesData,
		});

		setMessagesData((prev) => [
			...prev,
			{ id: 'thinking', content: 'Thinking...', role: RECEIVED },
		]);

		if (chats.activeSessionId) {
			dispatch(
				updateChatSession({
					id: chats.activeSessionId,
					message: sentMsg,
				}),
			);
		}
	};

	const onGetResponse = (response: string) => {
		setMessagesData((prev) => {
			return [
				...prev,
				{
					id: String(prev.length + 1),
					content: response,
					role: RECEIVED,
				},
			];
		});
	};

	const sessionsArray = Object.values(sessions);

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

				<View className="flex-row gap-4">
					<Button
						className="my-6 flex-1"
						variant={'outline'}
						onPress={() => setModalVisible(true)}
					>
						<Text>Open Previous Chat List</Text>
					</Button>
					<Button
						className="my-6 flex-1"
						onPress={() => {
							setMessagesData([]);
							setMessageInput('');
							dispatch(removeChatSession(chats.activeSessionId!));
						}}
						variant={'outline'}
					>
						<Text>New Chat</Text>
					</Button>
				</View>

				<Modal
					visible={modalVisible}
					transparent
					animationType="slide"
					onRequestClose={() => setModalVisible(false)}
				>
					<ChatSessionsModal
						visible={modalVisible}
						onClose={() => setModalVisible(false)}
						sessions={sessionsArray}
						onSelectSession={(id) => {
							setMessagesData([]);
							chatMutation.mutate(Number(id));
						}}
					/>
				</Modal>

				{messagesData.length === 0 && (
					<View className="mb-4 mt-4">
						<Text className="font-semibold mb-2">
							Quick Questions
						</Text>
						<View className="flex-row flex-wrap gap-2">
							{QUICK_QUESTIONS.map((q) => (
								<Pressable
									key={q}
									className="bg-gray-200 px-3 py-1 rounded-lg"
									onPress={() => {
										setMessageInput('');
										onMessageSend(q);
									}}
								>
									<Text>{q}</Text>
								</Pressable>
							))}
						</View>
					</View>
				)}

				<FlatList
					ref={flatListRef}
					data={messagesData}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => {
						return item.role === SENT ? (
							<SentMessageCard
								message={item.content}
								avatar_url={user.user?.avatar_url}
								full_name={user.user?.full_name || ''}
							/>
						) : (
							<ResponseMessageCard message={item.content} />
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
			</View>
		</AppSafeView>
	);
}
