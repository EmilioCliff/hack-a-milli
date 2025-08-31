import { isAxiosError } from 'axios';
import api from '~/api/api';
import { CommonResponse, VerifyOTPForm } from '~/lib/types';

const verifyOTP = async (data: VerifyOTPForm) => {
	try {
		const response = await api
			.post<CommonResponse>('/public/users/verify-otp', data)
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

export default verifyOTP;
