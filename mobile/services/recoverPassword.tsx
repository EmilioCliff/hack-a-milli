import { isAxiosError } from 'axios';
import api from '~/api/api';
import { CommonResponse, ForgotPasswordForm } from '~/lib/types';

const recoverPassword = async (data: ForgotPasswordForm) => {
	try {
		const response = await api
			.post<CommonResponse>('/public/users/forgot-password', data)
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

export default recoverPassword;
