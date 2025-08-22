import api from '~/api/api';
import { NewsUpdateResponse } from '~/lib/types';

const getNewsUpdate = async (id: number) => {
	try {
		const response = await api
			.get<NewsUpdateResponse>(`/public/news/updates/${id}`)
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

export default getNewsUpdate;
