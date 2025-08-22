import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '~/FirebaseConfig';

export const UploadFile = (
	file: Blob,
	filename: string,
	mimeType: string = '',
): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!file) {
			return reject(new Error('No file provided'));
		}

		const storageRef = ref(storage, filename);
		const uploadTask = uploadBytesResumable(storageRef, file, {
			contentType: mimeType,
		});

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(`Upload is ${progress.toFixed(0)}% done`);
			},
			(error) => {
				reject(error.message || 'Upload failed');
			},
			() => {
				resolve();
			},
		);
	});
};
