import { isAxiosError } from 'axios';
import api, { protectedApi } from '~/api/api';
import { GetChatResponse } from '~/lib/types';

const getChat = async (id: number) => {
	try {
		const response = await protectedApi
			.get<GetChatResponse>(`/chats/${id}`)
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

export default getChat;
