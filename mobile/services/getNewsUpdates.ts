import api from '~/api/api';
import { NewsUpdatesResponse } from '~/lib/types';

const getNewsUpdates = async (page: number) => {
	try {
		let baseUrl = `/public/news/updates?page=${page}`;

		const response = await api
			.get<NewsUpdatesResponse>(baseUrl)
			.then((res) => res.data);

		if (response.message) {
			throw new Error(response.message);
		}

		return response;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data.message);
		}

		throw new Error(error.message);
	}
};

export default getNewsUpdates;
