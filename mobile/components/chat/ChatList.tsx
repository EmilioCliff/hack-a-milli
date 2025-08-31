import React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Modal,
	StyleSheet,
} from 'react-native';
import { Button } from '~/components/ui/button';
import { useDispatch } from 'react-redux';
import { setActiveSession } from '~/store/slices/chat';

interface ChatSession {
	id: string;
	title?: string;
	lastMessage?: string;
}

interface ChatSessionsModalProps {
	visible: boolean;
	onClose: () => void;
	sessions: ChatSession[];
	onSelectSession: (id: string) => void;
}

const ChatSessionsModal: React.FC<ChatSessionsModalProps> = ({
	visible,
	onClose,
	sessions,
	onSelectSession,
}) => {
	const dispatch = useDispatch();

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<View style={styles.sheet}>
					<Text style={styles.header}>Your Chats</Text>

					<FlatList
						data={sessions}
						keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.item}
								onPress={() => {
									onSelectSession(item.id);
									dispatch(setActiveSession(item.id));
									onClose();
								}}
							>
								<Text style={styles.title}>{item.title}</Text>
								<Text style={styles.subtitle}>
									{item.lastMessage || 'No messages yet'}
								</Text>
							</TouchableOpacity>
						)}
					/>

					<Button style={styles.closeButton} onPress={onClose}>
						<Text>Close</Text>
					</Button>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	sheet: {
		backgroundColor: 'white',
		padding: 20,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		maxHeight: '60%',
	},
	header: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	item: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	title: {
		fontWeight: '600',
	},
	subtitle: {
		color: '#666',
	},
	closeButton: {
		marginTop: 12,
	},
});

export default ChatSessionsModal;
