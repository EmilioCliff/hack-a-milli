import { isAxiosError } from 'axios';
import api from '~/api/api';
import { NewsLettersResponse } from '~/lib/types';

interface getEventsParams {
	page: number;
	date_range?: string;
}

const getNewsLetters = async (filter: getEventsParams) => {
	try {
		let baseUrl = `/public/news/letter?page=${filter.page}`;

		if (filter.date_range) {
			const range = filter.date_range.split('-');
			baseUrl =
				baseUrl +
				`&start_date=${encodeURIComponent(range[0])}&end_date=${encodeURIComponent(range[1])}`;
		}

		const response = await api
			.get<NewsLettersResponse>(baseUrl)
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

export default getNewsLetters;
