import { isAxiosError } from 'axios';
import api from '~/api/api';
import { MerchandiseResponse } from '~/lib/types';

const getMerchandise = async (id: number) => {
	try {
		const response = await api
			.get<MerchandiseResponse>(`/public/merchandise/products/${id}`)
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

export default getMerchandise;
