import { createSlice } from '@reduxjs/toolkit';

interface PreferencesState {
	newsNotification: boolean;
	eventsNotification: boolean;
	trainingNotification: boolean;
	policyNotifications: boolean;
	twoFactorAuthEnabled: boolean;
}

const initialState: PreferencesState = {
	newsNotification: true,
	eventsNotification: true,
	trainingNotification: true,
	policyNotifications: true,
	twoFactorAuthEnabled: false,
};

const preferencesSlice = createSlice({
	name: 'preferences',
	initialState,
	reducers: {
		toggleNewsNotifications(state) {
			state.newsNotification = !state.newsNotification;
		},
		toggleEventsNotifications(state) {
			state.eventsNotification = !state.eventsNotification;
		},
		toggleTrainingNotifications(state) {
			state.trainingNotification = !state.trainingNotification;
		},
		togglePolicyNotifications(state) {
			state.policyNotifications = !state.policyNotifications;
		},
		toggleTwoFactorAuth(state) {
			state.twoFactorAuthEnabled = !state.twoFactorAuthEnabled;
		},
	},
});

export const {
	toggleNewsNotifications,
	toggleEventsNotifications,
	toggleTrainingNotifications,
	togglePolicyNotifications,
	toggleTwoFactorAuth,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
