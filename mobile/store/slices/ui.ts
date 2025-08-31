import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginModalPayload {
	title?: string;
	message?: string;
	confirmLabel?: string;
}

interface UIState {
	showLoginModal: boolean;
	loginModalConfig: LoginModalPayload;
}

const initialState: UIState = {
	showLoginModal: false,
	loginModalConfig: {
		title: 'Login required',
		message: 'You need to login to continue.',
		confirmLabel: 'Go to Login',
	},
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		openLoginModal: (
			state,
			action: PayloadAction<LoginModalPayload | undefined>,
		) => {
			state.showLoginModal = true;
			if (action.payload) {
				state.loginModalConfig = {
					...state.loginModalConfig,
					...action.payload,
				};
			}
		},
		closeLoginModal: (state) => {
			state.showLoginModal = false;
		},
	},
});

export const { openLoginModal, closeLoginModal } = uiSlice.actions;
export default uiSlice.reducer;
