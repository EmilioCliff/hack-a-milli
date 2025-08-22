import { isAxiosError } from 'axios';
import api from '~/api/api';
import { RegistrarsResponse } from '~/lib/types';

interface getRegistrarsParams {
	page: number;
	search?: string;
	service?: string;
}

const getRegistrars = async (filter: getRegistrarsParams) => {
	try {
		let baseUrl = `/public/registrars?page=${filter.page}`;

		if (filter.search) {
			baseUrl = baseUrl + `&search=${encodeURIComponent(filter.search)}`;
		}

		if (filter.service) {
			baseUrl =
				baseUrl + `&specialities=${encodeURIComponent(filter.service)}`;
		}

		const response = await api
			.get<RegistrarsResponse>(baseUrl)
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

export default getRegistrars;
