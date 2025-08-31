import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import preferencesReducer from './slices/preferences';
import userReducer from './slices/user';
import likesReducer from './slices/likes';
import chatReducer from './slices/chat';
import cartReducer from './slices/cart';
import uiReducer from './slices/ui';

const rootReducer = combineReducers({
	preferences: preferencesReducer,
	user: userReducer,
	likes: likesReducer,
	chat: chatReducer,
	cart: cartReducer,
	ui: uiReducer,
});

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	whitelist: ['preferences', 'user', 'likes', 'chat', 'cart'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
