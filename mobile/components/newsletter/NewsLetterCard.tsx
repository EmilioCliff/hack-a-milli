import { Linking, Share, View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { NewsLetter } from '~/lib/types';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import { FC } from 'react';

interface newsLetterCardProps {
	data: NewsLetter;
	setIsDownloading: (status: boolean) => void;
	setDownloadProgress: (progress: number) => void;
}

const NewsLetterCard: FC<newsLetterCardProps> = ({
	data,
	setDownloadProgress,
	setIsDownloading,
}) => {
	const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
		const progress =
			downloadProgress.totalBytesWritten /
			downloadProgress.totalBytesExpectedToWrite;

		setDownloadProgress(Math.round(progress * 100 * 100) / 100);
	};

	const downloadFile = async () => {
		setIsDownloading(true);
		setDownloadProgress(0);
		const downloadableResumable = FileSystem.createDownloadResumable(
			data.pdf_url,
			FileSystem.documentDirectory + data.title + '.pdf',
			{},
			callback,
		);
		const response = await downloadableResumable.downloadAsync();
		setIsDownloading(false);
		Share.share({
			message: 'Save the news letter',
			url: response?.uri,
		});
	};

	return (
		<View className="border border-border border-l-primary border-l-2 p-4 rounded-lg mt-6">
			<View className="flex-row justify-between items-center mb-4">
				<Badge className="bg-red-200">
					<Text className="text-red-700">
						{format(data.date, 'yyy-MM-dd')}
					</Text>
				</Badge>
				<Text className="text-gray-500">
					{format(data.date, 'yyyy')}
				</Text>
			</View>
			<Text className="text-xl font-bold">{data.title}</Text>
			<Text className="text-gray-600 my-2">{data.description}</Text>
			<View className="flex-row gap-2">
				<Button onPress={downloadFile} className="flex-1">
					<Text className="text-white font-bold">Download</Text>
				</Button>
				<Button
					onPress={() => Linking.openURL(data.pdf_url)}
					className="bg-secondary flex-1"
				>
					<Text className="text-white font-bold">View</Text>
				</Button>
			</View>
		</View>
	);
};

export default NewsLetterCard;
