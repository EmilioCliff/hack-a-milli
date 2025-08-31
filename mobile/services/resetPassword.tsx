import { isAxiosError } from 'axios';
import api from '~/api/api';
import { CommonResponse, ResetPasswordForm } from '~/lib/types';

const resetPassword = async (data: ResetPasswordForm) => {
	try {
		const response = await api
			.post<CommonResponse>(
				`/public/users/reset-password?token=${data.token}`,
				{
					password: data.newPassword,
				},
			)
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

export default resetPassword;
