import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
	id: number;
	email: string;
	full_name: string;
	phone_number: string;
	address?: string | null;
	avatar_url?: string | null;
	roles?: string[];
}

const initialState: UserState = {
	id: 0,
	full_name: '',
	email: '',
	phone_number: '',
	address: null,
	avatar_url: null,
	roles: [],
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserState>) {
			return action.payload;
		},
		clearUser() {
			return initialState;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
