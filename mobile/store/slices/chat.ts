import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
	id: string;
	content: string;
	role: string; // 'user' or 'assistant'
}

interface ChatSession {
	id: string;
	title?: string;
	lastMessage?: string;
}

interface ChatState {
	sessions: Record<string, ChatSession>;
	activeSessionId?: string;
}

const initialState: ChatState = {
	sessions: {},
	activeSessionId: undefined,
};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		addChatSession(state, action: PayloadAction<ChatSession>) {
			state.sessions[action.payload.id] = action.payload;
			state.activeSessionId = action.payload.id;
		},
		updateChatSession(
			state,
			action: PayloadAction<{ id: string; message: ChatMessage }>,
		) {
			const session = state.sessions[action.payload.id];
			if (session) {
				session.lastMessage = action.payload.message.content;
			}
		},
		setActiveSession(state, action: PayloadAction<string>) {
			state.activeSessionId = action.payload;
		},
		removeChatSession(state, action: PayloadAction<string>) {
			delete state.sessions[action.payload];
			if (state.activeSessionId === action.payload) {
				state.activeSessionId = undefined;
			}
		},
		clearChatSessions(state) {
			state.sessions = {};
			state.activeSessionId = undefined;
		},
	},
});

export const {
	addChatSession,
	updateChatSession,
	setActiveSession,
	removeChatSession,
	clearChatSessions,
} = chatSlice.actions;
export default chatSlice.reducer;
