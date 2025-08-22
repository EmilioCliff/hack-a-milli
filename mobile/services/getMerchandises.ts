import { isAxiosError } from 'axios';
import api from '~/api/api';
import { MerchandisesResponse } from '~/lib/types';

const getMerchandises = async (page: number) => {
	try {
		const response = await api
			.get<MerchandisesResponse>(
				`/public/merchandise/products?page=${page}`,
			)
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

export default getMerchandises;
