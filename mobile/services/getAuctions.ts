import { isAxiosError } from 'axios';
import api from '~/api/api';
import { AuctionResponse } from '~/lib/types';

interface getAuctionsParams {
	page: number;
	search?: string;
	category?: string;
}

const getAuctions = async (filter: getAuctionsParams) => {
	try {
		let baseUrl = `/public/auctions?page=${filter.page}`;

		if (filter.search) {
			baseUrl = baseUrl + `&search=${encodeURIComponent(filter.search)}`;
		}

		if (filter.category && filter.category !== 'all') {
			baseUrl =
				baseUrl + `&category=${encodeURIComponent(filter.category)}`;
		}

		const response = await api
			.get<AuctionResponse>(baseUrl)
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

export default getAuctions;
