import { isAxiosError } from 'axios';
import api from '~/api/api';
import { EnqueryFormType } from '~/components/contact/EnqueryForm';
import { CommonResponse } from '~/lib/types';

const SendInqueryMessage = async (data: EnqueryFormType) => {
	try {
		const response = await api
			.post<CommonResponse>('/public/inquery', data)
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

export default SendInqueryMessage;
