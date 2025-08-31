import { isAxiosError } from 'axios';
import { protectedApi } from '~/api/api';
import { PostWatcherResponse } from '~/lib/types';

const postWatcher = async (id: number, status: string) => {
	console.log(status);
	try {
		const response = await protectedApi
			.post<PostWatcherResponse>(`/auctions/${id}/watch`, {
				status: status,
			})
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

export default postWatcher;
