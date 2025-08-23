import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistor } from '../store';

interface ChatSession {
	id: string;
	name: string;
	lastMessage?: string;
}

interface ChatState {
	sessions: Record<string, ChatSession>;
}

const initialState: ChatState = {
	sessions: {},
};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		addChatSession(state, action: PayloadAction<ChatSession>) {
			state.sessions[action.payload.id] = action.payload;
		},
		updateChatSession(state, action: PayloadAction<ChatSession>) {
			state.sessions[action.payload.id] = {
				...state.sessions[action.payload.id],
				...action.payload,
			};
		},
		removeChatSession(state, action: PayloadAction<string>) {
			delete state.sessions[action.payload];
		},
		clearChatSessions(state) {
			state.sessions = {};
		},
	},
});

export const {
	addChatSession,
	updateChatSession,
	removeChatSession,
	clearChatSessions,
} = chatSlice.actions;
export default chatSlice.reducer;
