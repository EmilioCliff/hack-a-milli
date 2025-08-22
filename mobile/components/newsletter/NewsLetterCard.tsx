import { Share, View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { NewsLetter } from '~/lib/types';
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'shar'
import { useState } from 'react';
import { Progress } from '../ui/progress';

export default function NewsLetterCard(props: NewsLetter) {
	const [pp, setPP] = useState(70);
	const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
		const progress =
			downloadProgress.totalBytesWritten /
			downloadProgress.totalBytesExpectedToWrite;
		console.log(progress);
		setPP(progress);
	};

	const downloadFile = async () => {
		const downloadableResumable = FileSystem.createDownloadResumable(
			'https://firebasestorage.googleapis.com/v0/b/kenic-hack-a-milli.firebasestorage.app/o/news-letters%2Fpublished%2FTika%20In%20Action.pdf?alt=media&token=6fe8f784-ad22-4a04-af55-60fc647a0a5f',
			FileSystem.documentDirectory + 'Tika In Action 2.pdf',
			{},
			callback,
		);
		const response = await downloadableResumable.downloadAsync();
		console.log('Finished downloading to ', response?.uri);
		sharePdf();
	};

	const sharePdf = async () => {
		console.log('Sharing pdf');
		Share.share({
			message: 'Download the news letter',
			url: 'file:///var/mobile/Containers/Data/Application/1718AAB9-740B-4F33-817B-21271FC3F0D1/Documents/ExponentExperienceData/@anonymous/mobile-fb730ecc-0d64-4faf-b567-4679feef9286/Tika%20In%20Action%202.pdf',
		});
	};

	return (
		<View className="border border-border border-l-primary border-l-2 p-4 rounded-lg mt-6">
			<View className="flex-row justify-between items-center mb-4">
				<Badge className="bg-red-200">
					<Text className="text-red-700">
						{format(props.date, 'yyy-MM-dd')}
					</Text>
				</Badge>
				<Text className="text-gray-500">
					{format(props.date, 'yyyy')}
				</Text>
			</View>
			<Text className="text-xl font-bold">{props.title}</Text>
			<Text className="text-gray-600 my-2">{props.description}</Text>
			<View className="flex-row gap-2">
				<Button onPress={downloadFile} className="flex-1">
					<Text className="text-white font-bold">Download</Text>
				</Button>
				<Button className="bg-secondary flex-1">
					<Text className="text-white font-bold">View</Text>
				</Button>
			</View>
		</View>
	);
}
