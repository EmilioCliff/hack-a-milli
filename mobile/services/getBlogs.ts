import { isAxiosError } from 'axios';
import api from '~/api/api';
import { BlogsResponse } from '~/lib/types';

const getBlogs = async (page: number) => {
	try {
		const response = await api
			.get<BlogsResponse>(`/public/blogs?page=${page}`)
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

export default getBlogs;
