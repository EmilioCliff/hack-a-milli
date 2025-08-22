// tokenService.ts
import * as SecureStore from 'expo-secure-store';

let accessToken: string | null = null;

export function setAccessToken(token: string) {
	accessToken = token;
}

export function getAccessToken() {
	return accessToken;
}

export async function saveRefreshToken(token: string) {
	await SecureStore.setItemAsync('refresh_token', token);
}

export async function getRefreshToken() {
	return await SecureStore.getItemAsync('refresh_token');
}

export async function clearTokens() {
	accessToken = null;
	await SecureStore.deleteItemAsync('refresh_token');
}
