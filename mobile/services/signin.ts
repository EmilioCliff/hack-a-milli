import { isAxiosError } from 'axios';
import api from '~/api/api';
import { getFcmToken } from '~/lib/firebaseNotifications';
import { AuthResponse, SignInFormType } from '~/lib/types';

const signIn = async (data: SignInFormType) => {
	try {
		const deviceToken = await getFcmToken();
		const response = await api
			.post<AuthResponse>('/public/users/login', data, {
				headers: {
					'X-Device-Token': deviceToken || '',
				},
			})
			.then((res) => res.data);

		if (response.message) {
			throw new Error(response.message);
		}

		return response;
	} catch (error: any) {
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

export default signIn;
