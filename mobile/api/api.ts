import axios, { AxiosError, isAxiosError } from 'axios';
import { Redirect, router } from 'expo-router';
import {
	clearTokens,
	getAccessToken,
	getRefreshToken,
	saveRefreshToken,
	setAccessToken,
} from '~/lib/auth';
import { AuthResponse } from '~/lib/types';

const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'X-User-Device': 'mobile',
	},
});
export default api;

// Protected API instance
const protectedApi = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'X-User-Device': 'mobile',
	},
});

// 🔹 Attach access_token to every protected request
protectedApi.interceptors.request.use(
	(config) => {
		const token = getAccessToken();
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// 🔹 Handle 401 → try refresh flow
protectedApi.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest: any = error.config;

		if (
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			try {
				await refreshTokenFlow();
				return protectedApi(originalRequest);
			} catch (err) {
				await clearTokens();
				// redirect to login
				router.replace('/(auth)/signin');
				return Promise.reject(err);
			}
		}
		return Promise.reject(error);
	},
);

async function refreshTokenFlow() {
	const refreshToken = await getRefreshToken();
	if (!refreshToken) throw new Error('No refresh token available');

	try {
		const response = await refreshUserToken(refreshToken);
		const { access_token, refresh_token: newRefresh } = response.data;
		setAccessToken(access_token);
		if (newRefresh) {
			await saveRefreshToken(newRefresh);
		}
	} catch (error) {
		console.error('Refresh token failed:', error);
		throw new Error('Failed to refresh token');
	}
}

export { protectedApi };

const refreshUserToken = async (refreshToken: string) => {
	try {
		const response = await api
			.post<AuthResponse>(`/public/users/refresh-token`, refreshToken)
			.then((res) => res.data);

		if (response.message) {
			throw new Error(response.message);
		}

		return response;
	} catch (error: unknown) {
		if (isAxiosError(error)) {
			if (error.response) {
				throw new Error(error.response.data['message']);
			} else {
				throw new Error(
					'Error while processing request try again later',
				);
			}
		} else {
			throw new Error('Error while processing request try again later');
		}
	}
};
