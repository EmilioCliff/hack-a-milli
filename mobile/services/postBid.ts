import { isAxiosError } from 'axios';
import api, { protectedApi } from '~/api/api';
import { PostBidResponse } from '~/lib/types';

const postBid = async (id: number, amount: number) => {
	try {
		const response = await protectedApi
			.post<PostBidResponse>(`/auctions/${id}/bids`, {
				amount: amount,
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

export default postBid;
