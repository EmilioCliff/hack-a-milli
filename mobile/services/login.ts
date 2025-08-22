import { isAxiosError } from 'axios';
import api from '~/api/api';
import { AuthResponse } from '~/lib/types';

interface loginUser {
	email: string;
	password: string;
}

const loginUser = async (data: loginUser) => {
	try {
		const response = await api
			.post<AuthResponse>('/public/users/login', data)
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

export default loginUser;
