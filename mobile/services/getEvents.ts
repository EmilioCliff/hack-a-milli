import { isAxiosError } from 'axios';
import api from '~/api/api';
import { EventsResponse } from '~/lib/types';

interface getEventsParams {
	page: number;
	search?: string;
	status?: string;
	venue?: string;
}

const getEvents = async (filter: getEventsParams) => {
	try {
		let baseUrl = `/public/events?page=${filter.page}`;

		if (filter.search) {
			baseUrl = baseUrl + `&search=${encodeURIComponent(filter.search)}`;
		}

		if (filter.status) {
			baseUrl = baseUrl + `&status=${encodeURIComponent(filter.status)}`;
		}

		if (filter.venue) {
			baseUrl = baseUrl + `&venue=${encodeURIComponent(filter.venue)}`;
		}

		const response = await api
			.get<EventsResponse>(baseUrl)
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

export default getEvents;
