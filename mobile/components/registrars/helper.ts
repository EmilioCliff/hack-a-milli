import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '~/FirebaseConfig';

export const getDownloadURLHelper = () => {
	return new Promise<string>((resolve, reject) => {
		const storageRef = ref(
			storage,
			'news-letters/published/Tika In Action.pdf',
		);

		getDownloadURL(storageRef)
			.then((url) => {
				resolve(url);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

// /news-letters/published/Tika In Action.pdf


