import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
	id: string | null;
	email: string | null;
	full_name: string | null;
	phone_number: string | null;
	address?: string | null;
	avatar_url?: string | null;
	roles?: string[];
}

const initialState: UserState = {
	id: null,
	full_name: null,
	email: null,
	phone_number: null,
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
