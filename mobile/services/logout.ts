import { isAxiosError } from 'axios';
import api from '~/api/api';
import { CommonResponse } from '~/lib/types';

const logoutUser = async () => {
	try {
		const response = await api
			.get<CommonResponse>('/public/users/logout')
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

export default logoutUser;
