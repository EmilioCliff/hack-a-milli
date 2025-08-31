import { isAxiosError } from 'axios';
import { protectedApi } from '~/api/api';
import { SendMessageData, SendMessageResponse } from '~/lib/types';

const sendMessage = async (data: SendMessageData) => {
	console.log('Sending message with data:', data);
	try {
		var response: SendMessageResponse;
		if (!data.sessionId) {
			response = await protectedApi
				.post<SendMessageResponse>('/chats', {
					role: data.message.role,
					content: data.message.content,
				})
				.then((res) => res.data);
		} else {
			response = await protectedApi
				.post<SendMessageResponse>(
					`/chats/${data.sessionId}/messages`,
					{
						message: data.message,
						history: data.history,
					},
				)
				.then((res) => res.data);
		}

		console.log(response);

		if (response.message) {
			throw new Error(response.message);
		}

		return response;
	} catch (error: any) {
		console.log(error);
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

export default sendMessage;
