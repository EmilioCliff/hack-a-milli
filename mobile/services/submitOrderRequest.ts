import { isAxiosError } from 'axios';
import api from '~/api/api';
import { OrderPayloadFormType } from '~/components/merchandise/CheckoutForm';
import { CommonResponse } from '~/lib/types';

const SubmitOrderRequest = async (data: OrderPayloadFormType) => {
	try {
		let baseUrl;

		if (data.user_id !== 0) {
			baseUrl = `/users/${data.user_id}/merchandise/orders`;
		} else {
			baseUrl = '/public/merchandise/orders';
		}

		const response = await api
			.post<CommonResponse>(baseUrl, data)
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

export default SubmitOrderRequest;
